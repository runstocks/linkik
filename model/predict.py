import joblib
import sys
import json
import os
import pandas as pd
import warnings

# --- Suppress Warnings ---
warnings.filterwarnings("ignore", category=UserWarning, module='sklearn')

# --- Path Setup ---
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'predictive_model.joblib')
features_path = os.path.join(script_dir, 'features.json')

# --- 1. Load Artifacts ---
try:
    pipeline = joblib.load(model_path)
    with open(features_path, 'r') as f:
        features_dict = json.load(f)
    required_features = features_dict['all_features']
except FileNotFoundError:
    print(json.dumps({"error": "Model or feature list not found. Please run the training script first."}))
    sys.exit(1)

# --- 2. Get Input Data ---
try:
    # Input is expected as a single JSON string argument
    input_data_json = sys.argv[1]
    input_data = json.loads(input_data_json)
except (IndexError, json.JSONDecodeError):
    print(json.dumps({"error": "Invalid input. Please provide a single JSON string with feature key-value pairs."}))
    # Provide an example of the expected format
    example = {feature: "value" for feature in required_features}
    print(json.dumps({"example_format": example}))
    sys.exit(1)

# --- 3. Validate and Prepare Input ---
# Check if all required features are in the input
missing_features = [feature for feature in required_features if feature not in input_data]
if missing_features:
    print(json.dumps({"error": "Missing features in input", "missing": missing_features}))
    sys.exit(1)

# Create a DataFrame from the input data, ensuring correct column order
try:
    input_df = pd.DataFrame([input_data])
    input_df = input_df[required_features] # Reorder columns to match training
except Exception as e:
    print(json.dumps({"error": f"Failed to create DataFrame: {e}"}))
    sys.exit(1)

# --- 4. Make Prediction ---
try:
    prediction_code = pipeline.predict(input_df)
    prediction_proba = pipeline.predict_proba(input_df)

    # Decode the prediction
    prediction_label = 'green' if prediction_code[0] == 1 else 'red'
    confidence = prediction_proba[0][prediction_code[0]]

    # --- 5. Return Result ---
    result = {
        "prediction": prediction_label,
        "confidence": f"{confidence:.2f}"
    }
    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": f"Prediction failed: {e}"}))
    sys.exit(1)
