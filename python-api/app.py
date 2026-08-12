"""
Rice Plant Disease Detection - Flask API
REST API for serving CNN predictions
"""

import os
import sys
import json
import traceback
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import numpy as np

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

# Create upload folder if not exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize model and preprocessor
classifier = None
preprocessor = ImagePreprocessor(target_size=(224, 224))

# Model evaluation metrics (loaded from file if exists)
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
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def load_model():
    """Load the trained CNN model"""
    global classifier, evaluation_metrics
    
    model_path = app.config['MODEL_PATH']
    class_names_path = app.config['CLASS_NAMES_PATH']
    
    if os.path.exists(model_path):
        try:
            classifier = RiceDiseaseClassifier()
            classifier.load(model_path)
            
            # Load class names if available
            if os.path.exists(class_names_path):
                with open(class_names_path, 'r') as f:
                    classifier.DISEASE_CLASSES = json.load(f)
            
            # Load evaluation metrics if available
            metrics_path = os.path.join(os.path.dirname(model_path), 'evaluation_metrics.json')
            if os.path.exists(metrics_path):
                with open(metrics_path, 'r') as f:
                    evaluation_metrics.update(json.load(f))
            
            # Load training history if available
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


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': classifier is not None,
        'timestamp': datetime.now().isoformat()
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict disease from uploaded image
    
    Request: multipart/form-data with 'image' field
    Response: JSON with prediction results
    """
    if classifier is None:
        return jsonify({
            'error': 'Model not loaded',
            'message': 'The CNN model is not available. Please train the model first.'
        }), 503
    
    if 'image' not in request.files:
        return jsonify({
            'error': 'No image provided',
            'message': 'Please upload an image file'
        }), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({
            'error': 'No file selected',
            'message': 'Please select a file to upload'
        }), 400
    
    if not allowed_file(file.filename):
        return jsonify({
            'error': 'Invalid file type',
            'message': f'Allowed file types: {", ".join(ALLOWED_EXTENSIONS)}'
        }), 400
    
    try:
        # Read image bytes
        image_bytes = file.read()
        
        # Preprocess image
        processed_image = preprocessor.preprocess(image_bytes)
        
        # Get prediction
        result = classifier.predict(processed_image)
        
        return jsonify({
            'success': True,
            'prediction': {
                'disease': result['predicted_class'],
                'confidence': round(result['confidence'] * 100, 2),
                'all_predictions': {
                    k: round(v * 100, 2) 
                    for k, v in result['all_predictions'].items()
                }
            },
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e)
        }), 500


@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information and evaluation metrics"""
    return jsonify({
        'model_loaded': classifier is not None,
        'disease_classes': classifier.DISEASE_CLASSES if classifier else [],
        'num_classes': len(classifier.DISEASE_CLASSES) if classifier else 0,
        'model_type': evaluation_metrics.get('model_type', 'custom'),
        'metrics': {
            'accuracy': round(evaluation_metrics.get('accuracy', 0) * 100, 2),
            'precision': round(evaluation_metrics.get('precision', 0) * 100, 2),
            'recall': round(evaluation_metrics.get('recall', 0) * 100, 2),
            'f1_score': round(evaluation_metrics.get('f1_score', 0) * 100, 2)
        },
        'confusion_matrix': evaluation_metrics.get('confusion_matrix'),
        'training_history': evaluation_metrics.get('training_history'),
        'last_trained': evaluation_metrics.get('last_trained')
    })


@app.route('/classes', methods=['GET'])
def get_classes():
    """Get list of disease classes with full information"""
    # Load disease descriptions
    descriptions_path = os.path.join(os.path.dirname(__file__), 'disease_descriptions.json')
    disease_descriptions = {}
    if os.path.exists(descriptions_path):
        with open(descriptions_path, 'r', encoding='utf-8') as f:
            disease_descriptions = json.load(f)
    
    # Get class names from model or default
    class_names = classifier.DISEASE_CLASSES if classifier else RiceDiseaseClassifier.DISEASE_CLASSES
    
    # Build full disease list with descriptions
    diseases = []
    for name in class_names:
        # Try exact match first, then case-insensitive
        desc = disease_descriptions.get(name)
        if not desc:
            # Try case-insensitive match
            for key in disease_descriptions:
                if key.lower() == name.lower():
                    desc = disease_descriptions[key]
                    break
        
        disease_info = {
            'name': name,
            'name_id': desc.get('name_id', name) if desc else name,
            'name_scientific': desc.get('name_scientific') if desc else None,
            'description': desc.get('description', 'Deskripsi belum tersedia.') if desc else 'Deskripsi belum tersedia.',
            'symptoms': desc.get('symptoms', '') if desc else '',
            'causes': desc.get('causes', '') if desc else '',
            'treatment': desc.get('treatment', '') if desc else '',
            'prevention': desc.get('prevention', '') if desc else '',
        }
        diseases.append(disease_info)
    
    return jsonify({
        'classes': class_names,
        'diseases': diseases,
        'count': len(diseases)
    })


@app.route('/reload-model', methods=['POST'])
def reload_model():
    """Reload the model from disk"""
    global classifier
    
    success = load_model()
    
    if success:
        return jsonify({
            'success': True,
            'message': 'Model reloaded successfully'
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Failed to reload model'
        }), 500


# Error handlers
@app.errorhandler(413)
def too_large(e):
    return jsonify({
        'error': 'File too large',
        'message': 'Maximum file size is 16MB'
    }), 413


@app.errorhandler(500)
def server_error(e):
    return jsonify({
        'error': 'Server error',
        'message': 'An internal server error occurred'
    }), 500


if __name__ == '__main__':
    # Development server (port 5001 to avoid macOS AirPlay conflict)
    app.run(host='0.0.0.0', port=5001, debug=True)
