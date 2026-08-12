import h5py
import json

filepath = 'trained_models/rice_cnn_model.h5'

with h5py.File(filepath, 'r+') as f:
    if 'model_config' in f.attrs:
        config_str = f.attrs['model_config']
        if isinstance(config_str, bytes):
            config_str = config_str.decode('utf-8')
        
        config = json.loads(config_str)

        # Fungsi rekursif untuk membersihkan parameter Keras yang konflik
        def clean_keys(obj):
            if isinstance(obj, dict):
                obj.pop('quantization_config', None)
                obj.pop('optional', None)
                for k, v in obj.items():
                    clean_keys(v)
            elif isinstance(obj, list):
                for item in obj:
                    clean_keys(item)

        clean_keys(config)
        f.attrs['model_config'] = json.dumps(config).encode('utf-8')
        print("✅ Metadata H5 berhasil dibersihkan dari atribut yang konflik.")
