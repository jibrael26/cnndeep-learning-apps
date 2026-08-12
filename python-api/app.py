"""
Rice Plant Disease Detection - Flask API
REST API for serving CNN predictions + Laravel Reverse Proxy
"""

import os
import sys
import json
import traceback
from datetime import datetime
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from werkzeug.utils import secure_filename
import numpy as np
import requests

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from model.cnn_model import RiceDiseaseClassifier
from preprocessing.image_processor import ImagePreprocessor

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['MODEL_PATH'] = os.path.join(os.path.dirname(__file__), 'trained_models', 'rice_cnn_model.h5')
app.config['CLASS_NAMES_PATH'] = os.path.join(os.path.dirname(__file__), 'trained_models', 'class_names.json')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
LARAVEL_INTERNAL_URL = "http://127.0.0.1:8080"

# Create upload folder if not exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize model and preprocessor
classifier = None
preprocessor = ImagePreprocessor(target_size=(224, 224))

evaluation_metrics = {
    'accuracy': 0.0,
    'precision': 0.0,
    'recall': 0.0,
    'f1_score': 0.0,
    'confusion_matrix': None,
    'training_history': None,
    'model_type': 'custom',
    'last_trained': None
}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def load_model():
    global classifier, evaluation_metrics
    model_path = app.config['MODEL_PATH']
    class_names_path = app.config['CLASS_NAMES_PATH']
    
    if os.path.exists(model_path):
        try:
            classifier = RiceDiseaseClassifier()
            classifier.load(model_path)
            
            if os.path.exists(class_names_path):
                with open(class_names_path, 'r') as f:
                    classifier.DISEASE_CLASSES = json.load(f)
            
            metrics_path = os.path.join(os.path.dirname(model_path), 'evaluation_metrics.json')
            if os.path.exists(metrics_path):
                with open(metrics_path, 'r') as f:
                    evaluation_metrics.update(json.load(f))
            
            history_files = [f for f in os.listdir(os.path.dirname(model_path)) 
                           if f.startswith('training_history_')]
            if history_files:
                latest_history = sorted(history_files)[-1]
                with open(os.path.join(os.path.dirname(model_path), latest_history), 'r') as f:
                    evaluation_metrics['training_history'] = json.load(f)
            
            print(f"Model loaded successfully from {model_path}")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            traceback.print_exc()
            return False
    else:
        print(f"Model file not found: {model_path}")
        return False


# Load model on startup
with app.app_context():
    model_loaded = load_model()


# ==================== PYTHON API ENDPOINTS ====================

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': classifier is not None,
        'timestamp': datetime.now().isoformat()
    })


@app.route('/predict', methods=['POST'])
def predict():
    if classifier is None:
        return jsonify({'error': 'Model not loaded'}), 503
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    file = request.files['image']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid or missing file'}), 400
    
    try:
        image_bytes = file.read()
        processed_image = preprocessor.preprocess(image_bytes)
        result = classifier.predict(processed_image)
        return jsonify({
            'success': True,
            'prediction': {
                'disease': result['predicted_class'],
                'confidence': round(result['confidence'] * 100, 2),
                'all_predictions': {k: round(v * 100, 2) for k, v in result['all_predictions'].items()}
            },
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': 'Prediction failed', 'message': str(e)}), 500


@app.route('/model-info', methods=['GET'])
def model_info():
    return jsonify({
        'model_loaded': classifier is not None,
        'disease_classes': classifier.DISEASE_CLASSES if classifier else [],
        'num_classes': len(classifier.DISEASE_CLASSES) if classifier else 0,
        'metrics': {
            'accuracy': round(evaluation_metrics.get('accuracy', 0) * 100, 2),
            'precision': round(evaluation_metrics.get('precision', 0) * 100, 2),
            'recall': round(evaluation_metrics.get('recall', 0) * 100, 2),
            'f1_score': round(evaluation_metrics.get('f1_score', 0) * 100, 2)
        }
    })


# ==================== LARAVEL REVERSE PROXY GATEWAY ====================

from flask import send_from_directory

# Path absolut ke folder public Laravel
PUBLIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public'))

@app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
def proxy_to_laravel(path):
    # 1. Jangan proxy jika endpoint milik Flask API
    if path in ['predict', 'model-info', 'health', 'classes', 'reload-model']:
        return "Endpoint handled by Flask API", 404

    # 2. SEBAIKNYA: Jika file statis (CSS, JS, Gambar, Font) ada di folder public Laravel, serve langsung!
    requested_file = os.path.join(PUBLIC_DIR, path)
    if path and os.path.exists(requested_file) and os.path.isfile(requested_file):
        return send_from_directory(PUBLIC_DIR, path)

    # 3. Jika bukan file statis, kembalikan request ke Laravel di port 8080
    url = f"{LARAVEL_INTERNAL_URL}/{path}"
    headers = {k: v for k, v in request.headers if k.lower() not in ['host', 'accept-encoding']}
    headers['X-Forwarded-Host'] = request.host
    headers['X-Forwarded-Proto'] = 'https'
    headers['Accept-Encoding'] = 'identity'

    try:
        resp = requests.request(
            method=request.method,
            url=url,
            headers=headers,
            data=request.get_data(),
            cookies=request.cookies,
            allow_redirects=False,
            params=request.args
        )

        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        response_headers = [(k, v) for k, v in resp.headers.items() if k.lower() not in excluded_headers]

        return Response(resp.content, resp.status_code, response_headers)

    except requests.exceptions.ConnectionError:
        return "<h2>502 Bad Gateway</h2><p>Service Laravel belum berjalan di port internal 8080.</p>", 502

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)