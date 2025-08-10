import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import warnings
import os

# Suppress the UserWarning from scikit-learn about feature names
warnings.filterwarnings("ignore", category=UserWarning, module='sklearn')

# --- Path setup ---
# Get the absolute path of the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
# Construct absolute paths for the dataset and the model output
dataset_path = os.path.join(script_dir, 'dataset.csv')
model_filename = os.path.join(script_dir, 'predictive_model.joblib')


# 1. Cargar el dataset
try:
    df = pd.read_csv(dataset_path, quotechar='"')
except FileNotFoundError:
    print(f"Error: El archivo dataset.csv no se encontró en la ruta '{dataset_path}'.")
    exit()

# 2. Seleccionar las características (X) y el objetivo (y)
feature_column = 'Open Gap %'
target_column = 'RTH Run %'

if feature_column not in df.columns:
    print(f"Error: La columna de característica '{feature_column}' no se encuentra en el dataset.")
    exit()
if target_column not in df.columns:
    print(f"Error: La columna objetivo '{target_column}' no se encuentra en el dataset.")
    exit()

# 3. Preparar los datos
df_clean = df.dropna(subset=[feature_column, target_column])

if df_clean.empty:
    print(f"Error: No hay datos disponibles para entrenar el modelo después de limpiar las filas sin valores en '{feature_column}' y '{target_column}'.")
    exit()

X = df_clean[[feature_column]]
y = df_clean[target_column]

# 4. Entrenar el modelo de regresión lineal
model = LinearRegression()
model.fit(X, y)

# 5. Guardar el modelo entrenado
joblib.dump(model, model_filename)

print(f"Modelo entrenado y guardado exitosamente en '{model_filename}'")
print(f"Usando la característica: '{feature_column}' para predecir '{target_column}'")
print(f"Coeficiente del modelo: {model.coef_[0]}")
print(f"Intersección del modelo: {model.intercept_}")
