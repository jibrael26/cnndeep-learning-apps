"""
Rice Plant Disease Detection - CNN Model Architecture
Custom CNN model for classifying rice leaf diseases
"""

import tensorflow as tf
from tensorflow.keras import layers, models, regularizers
from tensorflow.keras.applications import MobileNetV2, ResNet50V2
from typing import Tuple, Optional
import os


class RiceDiseaseClassifier:
    """
    CNN classifier for rice plant disease detection
    Supports both custom CNN architecture and transfer learning
    """
    
    # Disease classes for rice plant
    DISEASE_CLASSES = [
        'Bacterial Leaf Blight',
        'Brown Spot',
        'Healthy',
        'Hispa',
        'Leaf Blast',
        'Leaf Smut',
        'Sheath Blight'
    ]
    
    def __init__(
        self,
        input_shape: Tuple[int, int, int] = (224, 224, 3),
        num_classes: Optional[int] = None,
        model_type: str = 'custom'
    ):
        """
        Initialize the classifier
        
        Args:
            input_shape: Input image shape (height, width, channels)
            num_classes: Number of disease classes
            model_type: 'custom', 'mobilenet', or 'resnet'
        """
        self.input_shape = input_shape
        self.num_classes = num_classes or len(self.DISEASE_CLASSES)
        self.model_type = model_type
        self.model = None
        self.history = None
    
    def build_custom_model(self) -> models.Sequential:
        """
        Build custom CNN architecture for rice disease classification
        
        Returns:
            Compiled Keras Sequential model
        """
        model = models.Sequential([
            # Input layer
            layers.InputLayer(input_shape=self.input_shape),
            
            # First Convolutional Block
            layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Second Convolutional Block
            layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Third Convolutional Block
            layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Fourth Convolutional Block
            layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Fully Connected Layers
            layers.Flatten(),
            layers.Dense(512, activation='relu', kernel_regularizer=regularizers.l2(0.01)),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(256, activation='relu', kernel_regularizer=regularizers.l2(0.01)),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            
            # Output Layer
            layers.Dense(self.num_classes, activation='softmax')
        ])
        
        return model
    
    def build_mobilenet_model(self) -> models.Model:
        """
        Build transfer learning model using MobileNetV2
        
        Returns:
            Compiled Keras Model with MobileNetV2 backbone
        """
        # Load pre-trained MobileNetV2
        base_model = MobileNetV2(
            input_shape=self.input_shape,
            include_top=False,
            weights='imagenet'
        )
        
        # Freeze base model layers
        base_model.trainable = False
        
        # Build model
        inputs = layers.Input(shape=self.input_shape)
        x = base_model(inputs, training=False)
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.Dense(256, activation='relu')(x)
        x = layers.Dropout(0.5)(x)
        x = layers.Dense(128, activation='relu')(x)
        x = layers.Dropout(0.3)(x)
        outputs = layers.Dense(self.num_classes, activation='softmax')(x)
        
        model = models.Model(inputs, outputs)
        
        return model
    
    def build_resnet_model(self) -> models.Model:
        """
        Build transfer learning model using ResNet50V2
        
        Returns:
            Compiled Keras Model with ResNet50V2 backbone
        """
        # Load pre-trained ResNet50V2
        base_model = ResNet50V2(
            input_shape=self.input_shape,
            include_top=False,
            weights='imagenet'
        )
        
        # Freeze base model layers
        base_model.trainable = False
        
        # Build model
        inputs = layers.Input(shape=self.input_shape)
        x = base_model(inputs, training=False)
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.Dense(512, activation='relu')(x)
        x = layers.Dropout(0.5)(x)
        x = layers.Dense(256, activation='relu')(x)
        x = layers.Dropout(0.3)(x)
        outputs = layers.Dense(self.num_classes, activation='softmax')(x)
        
        model = models.Model(inputs, outputs)
        
        return model
    
    def build(self) -> None:
        """Build the model based on model_type"""
        if self.model_type == 'custom':
            self.model = self.build_custom_model()
        elif self.model_type == 'mobilenet':
            self.model = self.build_mobilenet_model()
        elif self.model_type == 'resnet':
            self.model = self.build_resnet_model()
        else:
            raise ValueError(f"Unknown model type: {self.model_type}")
        
        # Compile model
        self.model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='categorical_crossentropy',
            metrics=['accuracy', 
                     tf.keras.metrics.Precision(name='precision'),
                     tf.keras.metrics.Recall(name='recall')]
        )
    
    def summary(self) -> None:
        """Print model summary"""
        if self.model is None:
            self.build()
        self.model.summary()
    
    def train(
        self,
        train_data,
        validation_data=None,
        epochs: int = 50,
        batch_size: int = 32,
        callbacks: Optional[list] = None
    ):
        """
        Train the model
        
        Args:
            train_data: Training data (generator or tuple of (x, y))
            validation_data: Validation data
            epochs: Number of training epochs
            batch_size: Training batch size
            callbacks: List of Keras callbacks
            
        Returns:
            Training history
        """
        if self.model is None:
            self.build()
        
        # Default callbacks
        if callbacks is None:
            callbacks = [
                tf.keras.callbacks.EarlyStopping(
                    monitor='val_loss',
                    patience=10,
                    restore_best_weights=True
                ),
                tf.keras.callbacks.ReduceLROnPlateau(
                    monitor='val_loss',
                    factor=0.2,
                    patience=5,
                    min_lr=1e-7
                )
            ]
        
        self.history = self.model.fit(
            train_data,
            validation_data=validation_data,
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks
        )
        
        return self.history
    
    def predict(self, image) -> dict:
        """
        Predict disease from preprocessed image
        
        Args:
            image: Preprocessed image array (batch format)
            
        Returns:
            Dictionary with prediction results
        """
        if self.model is None:
            raise RuntimeError("Model not loaded. Call build() or load() first.")
        
        # Get predictions
        predictions = self.model.predict(image, verbose=0)
        
        # Get class probabilities
        class_probs = predictions[0]
        
        # Get predicted class
        predicted_idx = int(tf.argmax(class_probs))
        predicted_class = self.DISEASE_CLASSES[predicted_idx]
        confidence = float(class_probs[predicted_idx])
        
        # Get all predictions with confidence
        all_predictions = {
            self.DISEASE_CLASSES[i]: float(class_probs[i])
            for i in range(len(self.DISEASE_CLASSES))
        }
        
        # Sort by confidence
        all_predictions = dict(
            sorted(all_predictions.items(), key=lambda x: x[1], reverse=True)
        )
        
        return {
            'predicted_class': predicted_class,
            'confidence': confidence,
            'all_predictions': all_predictions
        }
    
    def save(self, filepath: str) -> None:
        """Save model to file"""
        if self.model is None:
            raise RuntimeError("No model to save. Build or train the model first.")
        self.model.save(filepath)
        print(f"Model saved to {filepath}")
    
    def load(self, filepath: str) -> None:
        """Load model from file"""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found: {filepath}")
        self.model = models.load_model(filepath)
        print(f"Model loaded from {filepath}")
    
    def get_evaluation_metrics(self, test_data) -> dict:
        """
        Evaluate model on test data
        
        Args:
            test_data: Test data (generator or tuple of (x, y))
            
        Returns:
            Dictionary with evaluation metrics
        """
        if self.model is None:
            raise RuntimeError("Model not loaded.")
        
        results = self.model.evaluate(test_data, verbose=0)
        metrics = dict(zip(self.model.metrics_names, results))
        
        # Calculate F1 score
        if 'precision' in metrics and 'recall' in metrics:
            precision = metrics['precision']
            recall = metrics['recall']
            if precision + recall > 0:
                metrics['f1_score'] = 2 * (precision * recall) / (precision + recall)
            else:
                metrics['f1_score'] = 0.0
        
        return metrics
