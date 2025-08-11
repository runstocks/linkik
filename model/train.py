import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
import warnings
import os
import json

# --- Suppress Warnings ---
warnings.filterwarnings("ignore", category=UserWarning, module='sklearn')
warnings.filterwarnings("ignore", category=FutureWarning, module='sklearn')

# --- Path Setup ---
script_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(script_dir, 'dataset.csv')
model_path = os.path.join(script_dir, 'predictive_model.joblib')
# We will save the entire pipeline, so a separate scaler is not needed.
features_path = os.path.join(script_dir, 'features.json')

# --- 1. Load and Prepare Data ---
try:
    df = pd.read_csv(dataset_path, quotechar='"')
except FileNotFoundError:
    print(f"Error: dataset.csv not found at '{dataset_path}'.")
    exit()

# --- 2. Data Cleaning and Feature Selection ---
missing_percentage = df.isnull().sum() / len(df)
columns_to_drop = missing_percentage[missing_percentage > 0.05].index
df_filtered = df.drop(columns=columns_to_drop)

target_column = 'Close Direction'
numeric_features = [
    'Open Price', 'Previous Day Close Price', 'Premarket Volume', 'Open Gap %', 'EOD Volume'
]
categorical_features = ['Ticker']

numeric_features = [f for f in numeric_features if f in df_filtered.columns]
categorical_features = [f for f in categorical_features if f in df_filtered.columns]
features = numeric_features + categorical_features

if not features:
    print("Error: No suitable features found after filtering.")
    exit()

df_clean = df_filtered.dropna(subset=[target_column] + features).copy()
df_clean['Date'] = pd.to_datetime(df_clean['Date'])
df_clean = df_clean.sort_values(by='Date').reset_index(drop=True)
df_clean.loc[:, target_column] = df_clean[target_column].apply(lambda x: 1 if x == 'green' else 0)

if len(df_clean) < 2:
    print("Error: Not enough data to train a model (need at least 2 samples).")
    exit()

X = df_clean[features]
y = df_clean[target_column].astype(int)

# --- 3. Time-Series Data Split ---
split_index = int(len(X) * 0.8)
# Ensure at least 1 sample in test set
if split_index == len(X):
    split_index -= 1

X_train, X_test = X.iloc[:split_index], X.iloc[split_index:]
y_train, y_test = y.iloc[:split_index], y.iloc[split_index:]

print(f"Training set size: {len(X_train)} samples")
print(f"Test set size: {len(X_test)} samples")

if len(X_train) == 0 or len(X_test) == 0:
    print("Error: Training or test set is empty. Cannot proceed.")
    exit()

# --- 4. Define and Train the Model ---
numeric_transformer = StandardScaler()
categorical_transformer = OneHotEncoder(handle_unknown='ignore')

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ],
    remainder='passthrough'
)

# Define the model
model = RandomForestClassifier(n_estimators=10, random_state=42, max_depth=2)

# Create the full pipeline
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', model)
])

# Train the model
pipeline.fit(X_train, y_train)

print("\nModel training complete.")

# --- 5. Evaluate the Model ---
print("\n--- Model Evaluation ---")
y_pred = pipeline.predict(X_test)
report = classification_report(y_test, y_pred, zero_division=0)
print(report)
print("------------------------")

# --- 6. Save Artifacts ---
joblib.dump(pipeline, model_path)
# Save the feature list for the prediction script
features_dict = {
    'numeric_features': numeric_features,
    'categorical_features': categorical_features,
    'all_features': features
}
with open(features_path, 'w') as f:
    json.dump(features_dict, f)

print(f"Model saved to '{model_path}'")
print(f"Feature list saved to '{features_path}'")
