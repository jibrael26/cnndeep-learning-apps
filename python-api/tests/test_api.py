"""
Test cases for Rice Plant Disease Detection API
"""

import pytest
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app


@pytest.fixture
def client():
    """Create test client"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    
    data = response.get_json()
    assert 'status' in data
    assert data['status'] == 'healthy'
    assert 'timestamp' in data


def test_get_classes(client):
    """Test get classes endpoint"""
    response = client.get('/classes')
    assert response.status_code == 200
    
    data = response.get_json()
    assert 'classes' in data
    assert isinstance(data['classes'], list)
    assert len(data['classes']) > 0


def test_model_info(client):
    """Test model info endpoint"""
    response = client.get('/model-info')
    assert response.status_code == 200
    
    data = response.get_json()
    assert 'disease_classes' in data
    assert 'num_classes' in data
    assert 'metrics' in data


def test_predict_no_image(client):
    """Test predict endpoint without image"""
    response = client.post('/predict')
    assert response.status_code in [400, 503]  # 400 if model loaded, 503 if not


def test_predict_invalid_file_type(client):
    """Test predict endpoint with invalid file type"""
    from io import BytesIO
    
    data = {
        'image': (BytesIO(b'invalid data'), 'test.txt')
    }
    response = client.post('/predict', data=data, content_type='multipart/form-data')
    # Should return 400 for invalid file type or 503 if model not loaded
    assert response.status_code in [400, 503]


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
