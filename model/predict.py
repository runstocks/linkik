import joblib
import sys
import json
import os

# --- Path setup ---
# Get the absolute path of the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
# Construct the absolute path for the model file
model_path = os.path.join(script_dir, 'predictive_model.joblib')

# Cargar el modelo entrenado
try:
    model = joblib.load(model_path)
except FileNotFoundError:
    print(json.dumps({"error": f"Modelo no encontrado en '{model_path}'."}))
    sys.exit(1)

# Leer el valor de entrada desde los argumentos de la línea de comandos
try:
    # El primer argumento (sys.argv[0]) es el nombre del script,
    # el que nos interesa es el segundo (sys.argv[1])
    input_value = float(sys.argv[1])
except (IndexError, ValueError):
    print(json.dumps({"error": "Argumento inválido. Se esperaba un número para 'Open Gap %'."}))
    sys.exit(1)

# Crear el array 2D que el modelo espera
# [[valor]]
input_data = [[input_value]]

# Realizar la predicción
prediction = model.predict(input_data)

# Imprimir el resultado como un JSON
# Devolvemos un objeto con una clave "prediction"
# prediction[0] para obtener el valor numérico de la predicción
print(json.dumps({"prediction": prediction[0]}))
