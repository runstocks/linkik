import joblib
import sys
import json
import os
import pandas as pd
import warnings

# Suppress the UserWarning from scikit-learn about feature names
warnings.filterwarnings("ignore", category=UserWarning, module='sklearn')

# --- Path setup ---
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'predictive_model.joblib')

# Cargar el modelo entrenado
try:
    model = joblib.load(model_path)
except FileNotFoundError:
    print(json.dumps({"error": f"Modelo no encontrado en '{model_path}'."}))
    sys.exit(1)

# Leer el valor de entrada desde los argumentos de la línea de comandos
try:
    input_value = float(sys.argv[1])
except (IndexError, ValueError):
    print(json.dumps({"error": "Argumento inválido. Se esperaba un número para 'Open Gap %'."}))
    sys.exit(1)

# Crear un DataFrame de pandas con el nombre de la característica que el modelo espera
feature_name = 'Open Gap %'
input_df = pd.DataFrame([[input_value]], columns=[feature_name])

# Realizar la predicción
prediction = model.predict(input_df)

# Imprimir el resultado como un JSON
print(json.dumps({"prediction": prediction[0]}))
