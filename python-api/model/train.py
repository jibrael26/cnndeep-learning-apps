"""
Rice Plant Disease Detection - Training Script
Train CNN model with rice disease dataset
"""

import os
import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, TensorBoard, CSVLogger
from datetime import datetime
import matplotlib.pyplot as plt

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from model.cnn_model import RiceDiseaseClassifier


def create_data_generators(
    dataset_path: str,
    target_size: tuple = (224, 224),
    batch_size: int = 32,
    validation_split: float = 0.2
):
    """
    Create training and validation data generators
    
    Args:
        dataset_path: Path to dataset directory with subdirectories for each class
        target_size: Target image size
        batch_size: Batch size for training
        validation_split: Fraction of data to use for validation
        
    Returns:
        Tuple of (train_generator, validation_generator)
    """
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        vertical_flip=True,
        fill_mode='nearest',
        validation_split=validation_split
    )
    
    # Only rescaling for validation
    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=validation_split
    )
    
    # Training generator
    train_generator = train_datagen.flow_from_directory(
        dataset_path,
        target_size=target_size,
        batch_size=batch_size,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )
    
    # Validation generator
    validation_generator = val_datagen.flow_from_directory(
        dataset_path,
        target_size=target_size,
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )
    
    return train_generator, validation_generator


def train_model(
    dataset_path: str,
    model_type: str = 'custom',
    epochs: int = 50,
    batch_size: int = 32,
    output_dir: str = 'trained_models'
):
    """
    Train the rice disease classification model
    
    Args:
        dataset_path: Path to dataset directory
        model_type: Type of model ('custom', 'mobilenet', 'resnet')
        epochs: Number of training epochs
        batch_size: Batch size
        output_dir: Directory to save trained model and logs
    """
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    print("=" * 60)
    print("Rice Plant Disease Detection - Model Training")
    print("=" * 60)
    print(f"Dataset path: {dataset_path}")
    print(f"Model type: {model_type}")
    print(f"Epochs: {epochs}")
    print(f"Batch size: {batch_size}")
    print("=" * 60)
    
    # Create data generators
    print("\n[1/5] Creating data generators...")
    train_gen, val_gen = create_data_generators(
        dataset_path,
        batch_size=batch_size
    )
    
    # Get class names from generator
    class_names = list(train_gen.class_indices.keys())
    num_classes = len(class_names)
    
    print(f"Found {train_gen.samples} training images")
    print(f"Found {val_gen.samples} validation images")
    print(f"Classes: {class_names}")
    
    # Save class names
    class_names_file = os.path.join(output_dir, 'class_names.json')
    with open(class_names_file, 'w') as f:
        json.dump(class_names, f, indent=2)
    
    # Build model
    print("\n[2/5] Building model...")
    classifier = RiceDiseaseClassifier(
        input_shape=(224, 224, 3),
        num_classes=num_classes,
        model_type=model_type
    )
    
    # Update disease classes in classifier
    classifier.DISEASE_CLASSES = class_names
    
    classifier.build()
    classifier.summary()
    
    # Callbacks
    print("\n[3/5] Setting up callbacks...")
    callbacks = [
        ModelCheckpoint(
            filepath=os.path.join(output_dir, f'best_model_{timestamp}.h5'),
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=15,
            restore_best_weights=True,
            verbose=1
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.2,
            patience=7,
            min_lr=1e-7,
            verbose=1
        ),
        CSVLogger(
            os.path.join(output_dir, f'training_log_{timestamp}.csv')
        ),
        TensorBoard(
            log_dir=os.path.join(output_dir, 'logs', timestamp)
        )
    ]
    
    # Train model
    print("\n[4/5] Training model...")
    history = classifier.model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=epochs,
        callbacks=callbacks
    )
    
    # Save final model
    print("\n[5/5] Saving model...")
    final_model_path = os.path.join(output_dir, 'rice_cnn_model.h5')
    classifier.save(final_model_path)
    
    # Save training history
    history_file = os.path.join(output_dir, f'training_history_{timestamp}.json')
    history_data = {
        'accuracy': [float(x) for x in history.history['accuracy']],
        'val_accuracy': [float(x) for x in history.history['val_accuracy']],
        'loss': [float(x) for x in history.history['loss']],
        'val_loss': [float(x) for x in history.history['val_loss']]
    }
    with open(history_file, 'w') as f:
        json.dump(history_data, f, indent=2)
    
    # Generate training plots
    plot_training_history(history, output_dir, timestamp)
    
    # Evaluate model and compute metrics
    print("\n" + "=" * 60)
    print("Evaluating Model...")
    print("=" * 60)
    
    # Get predictions on validation set
    val_gen.reset()
    predictions = classifier.model.predict(val_gen, verbose=1)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = val_gen.classes
    
    # Calculate metrics
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
    
    accuracy = accuracy_score(true_classes, predicted_classes)
    precision = precision_score(true_classes, predicted_classes, average='weighted', zero_division=0)
    recall = recall_score(true_classes, predicted_classes, average='weighted', zero_division=0)
    f1 = f1_score(true_classes, predicted_classes, average='weighted', zero_division=0)
    conf_matrix = confusion_matrix(true_classes, predicted_classes).tolist()
    
    print(f"\nFinal Validation Metrics:")
    print(f"  Accuracy:  {accuracy*100:.2f}%")
    print(f"  Precision: {precision*100:.2f}%")
    print(f"  Recall:    {recall*100:.2f}%")
    print(f"  F1 Score:  {f1*100:.2f}%")
    
    # Save evaluation metrics for API
    eval_metrics = {
        'accuracy': float(accuracy),
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1),
        'confusion_matrix': conf_matrix,
        'model_type': model_type,
        'last_trained': timestamp,
        'num_classes': num_classes,
        'class_names': class_names
    }
    
    eval_metrics_path = os.path.join(output_dir, 'evaluation_metrics.json')
    with open(eval_metrics_path, 'w') as f:
        json.dump(eval_metrics, f, indent=2)
    
    print(f"\n" + "=" * 60)
    print("Training Complete!")
    print("=" * 60)
    print(f"Model saved to: {final_model_path}")
    print(f"Training log saved to: {history_file}")
    print(f"Evaluation metrics saved to: {eval_metrics_path}")
    
    return classifier, history


def plot_training_history(history, output_dir: str, timestamp: str):
    """Generate and save training history plots"""
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    # Accuracy plot
    axes[0].plot(history.history['accuracy'], label='Training Accuracy')
    axes[0].plot(history.history['val_accuracy'], label='Validation Accuracy')
    axes[0].set_title('Model Accuracy')
    axes[0].set_xlabel('Epoch')
    axes[0].set_ylabel('Accuracy')
    axes[0].legend()
    axes[0].grid(True)
    
    # Loss plot
    axes[1].plot(history.history['loss'], label='Training Loss')
    axes[1].plot(history.history['val_loss'], label='Validation Loss')
    axes[1].set_title('Model Loss')
    axes[1].set_xlabel('Epoch')
    axes[1].set_ylabel('Loss')
    axes[1].legend()
    axes[1].grid(True)
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, f'training_plots_{timestamp}.png'), dpi=150)
    plt.close()


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Train Rice Disease Classification Model')
    parser.add_argument('--dataset', type=str, required=True,
                        help='Path to dataset directory')
    parser.add_argument('--model-type', type=str, default='custom',
                        choices=['custom', 'mobilenet', 'resnet'],
                        help='Type of model architecture')
    parser.add_argument('--epochs', type=int, default=50,
                        help='Number of training epochs')
    parser.add_argument('--batch-size', type=int, default=32,
                        help='Batch size for training')
    parser.add_argument('--output-dir', type=str, default='trained_models',
                        help='Directory to save trained model')
    
    args = parser.parse_args()
    
    train_model(
        dataset_path=args.dataset,
        model_type=args.model_type,
        epochs=args.epochs,
        batch_size=args.batch_size,
        output_dir=args.output_dir
    )
