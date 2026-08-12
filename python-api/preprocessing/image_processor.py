"""
Rice Plant Disease Detection - Image Preprocessing Module
Handles image loading, resizing, normalization, and augmentation
"""

import cv2
import numpy as np
from PIL import Image
import io
from typing import Tuple, Optional, Union
import os


class ImagePreprocessor:
    """
    Preprocessor for rice leaf images before CNN prediction
    """
    
    def __init__(self, target_size: Tuple[int, int] = (224, 224)):
        """
        Initialize preprocessor with target image size
        
        Args:
            target_size: Tuple of (width, height) for resizing images
        """
        self.target_size = target_size
    
    def load_image(self, image_source: Union[str, bytes, Image.Image]) -> np.ndarray:
        """
        Load image from various sources
        
        Args:
            image_source: File path, bytes, or PIL Image
            
        Returns:
            numpy array of the image in RGB format
        """
        if isinstance(image_source, str):
            # Load from file path
            if not os.path.exists(image_source):
                raise FileNotFoundError(f"Image file not found: {image_source}")
            image = Image.open(image_source)
        elif isinstance(image_source, bytes):
            # Load from bytes
            image = Image.open(io.BytesIO(image_source))
        elif isinstance(image_source, Image.Image):
            # Already a PIL Image
            image = image_source
        else:
            raise ValueError(f"Unsupported image source type: {type(image_source)}")
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        return np.array(image)
    
    def resize_image(self, image: np.ndarray) -> np.ndarray:
        """
        Resize image to target size
        
        Args:
            image: numpy array of the image
            
        Returns:
            Resized image as numpy array
        """
        return cv2.resize(image, self.target_size, interpolation=cv2.INTER_LANCZOS4)
    
    def normalize_image(self, image: np.ndarray) -> np.ndarray:
        """
        Normalize pixel values to [0, 1] range
        
        Args:
            image: numpy array of the image (0-255)
            
        Returns:
            Normalized image as numpy array (0-1)
        """
        return image.astype(np.float32) / 255.0
    
    def preprocess(self, image_source: Union[str, bytes, Image.Image]) -> np.ndarray:
        """
        Full preprocessing pipeline for prediction
        
        Args:
            image_source: Image file path, bytes, or PIL Image
            
        Returns:
            Preprocessed image ready for CNN prediction (batch format)
        """
        # Load image
        image = self.load_image(image_source)
        
        # Resize to target size
        image = self.resize_image(image)
        
        # Normalize pixel values
        image = self.normalize_image(image)
        
        # Add batch dimension for model prediction
        image = np.expand_dims(image, axis=0)
        
        return image
    
    def preprocess_batch(self, image_sources: list) -> np.ndarray:
        """
        Preprocess multiple images for batch prediction
        
        Args:
            image_sources: List of image sources
            
        Returns:
            Batch of preprocessed images
        """
        processed_images = []
        for source in image_sources:
            image = self.load_image(source)
            image = self.resize_image(image)
            image = self.normalize_image(image)
            processed_images.append(image)
        
        return np.array(processed_images)


class DataAugmentor:
    """
    Data augmentation for training CNN models
    """
    
    def __init__(self):
        pass
    
    def horizontal_flip(self, image: np.ndarray) -> np.ndarray:
        """Flip image horizontally"""
        return cv2.flip(image, 1)
    
    def vertical_flip(self, image: np.ndarray) -> np.ndarray:
        """Flip image vertically"""
        return cv2.flip(image, 0)
    
    def rotate(self, image: np.ndarray, angle: float) -> np.ndarray:
        """Rotate image by given angle"""
        h, w = image.shape[:2]
        center = (w // 2, h // 2)
        matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
        return cv2.warpAffine(image, matrix, (w, h))
    
    def adjust_brightness(self, image: np.ndarray, factor: float) -> np.ndarray:
        """Adjust image brightness"""
        hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
        hsv = hsv.astype(np.float32)
        hsv[:, :, 2] = np.clip(hsv[:, :, 2] * factor, 0, 255)
        hsv = hsv.astype(np.uint8)
        return cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
    
    def add_noise(self, image: np.ndarray, noise_factor: float = 0.1) -> np.ndarray:
        """Add random noise to image"""
        noise = np.random.randn(*image.shape) * 255 * noise_factor
        noisy_image = np.clip(image.astype(np.float32) + noise, 0, 255)
        return noisy_image.astype(np.uint8)
    
    def augment(self, image: np.ndarray, augmentations: Optional[list] = None) -> list:
        """
        Apply multiple augmentations to an image
        
        Args:
            image: Original image
            augmentations: List of augmentation names to apply
            
        Returns:
            List of augmented images including original
        """
        if augmentations is None:
            augmentations = ['horizontal_flip', 'rotate_15', 'rotate_-15', 'brightness_up', 'brightness_down']
        
        results = [image]  # Include original
        
        for aug in augmentations:
            if aug == 'horizontal_flip':
                results.append(self.horizontal_flip(image))
            elif aug == 'vertical_flip':
                results.append(self.vertical_flip(image))
            elif aug.startswith('rotate_'):
                angle = float(aug.split('_')[1])
                results.append(self.rotate(image, angle))
            elif aug == 'brightness_up':
                results.append(self.adjust_brightness(image, 1.2))
            elif aug == 'brightness_down':
                results.append(self.adjust_brightness(image, 0.8))
            elif aug == 'noise':
                results.append(self.add_noise(image))
        
        return results
