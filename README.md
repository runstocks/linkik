# Predictive AI for Trading v1

This project is a proof of concept for an AI service that predicts stock behavior based on market data. This version (v1) uses an advanced model to predict whether a stock will close "green" (up) or "red" (down) for the day.

## Project Structure

The repository is organized into two main components:

-   `/model`: Contains everything related to the Machine Learning model.
    -   `dataset.csv`: The dataset used for training. **Note: The current dataset is a very small sample.**
    -   `train.py`: A script to train the AI model and save the necessary components (pipeline and feature list).
    -   `predict.py`: A script that loads the trained model and makes predictions.
    -   `requirements.txt`: Python dependencies.
-   `/webapp`: Contains the web application to interact with the model.
    -   `index.js`: The backend server (Node.js/Express).
    -   `/client`: The frontend application (React/Mantine).

## How to Get Started

Follow these steps to install dependencies and run the project.

### Prerequisites

-   Python 3.x
-   Node.js and npm

### 1. Install Dependencies

There are three sets of dependencies to install:

**a) Python Model:**
Navigate to the project root and run:
```bash
pip install -r model/requirements.txt
```

**b) Backend (Node.js):**
From the project root, run:
```bash
npm install --prefix webapp
```

**c) Frontend (React):**
From the project root, run:
```bash
npm install --prefix webapp/client
```

### 2. Train the AI Model

Before you can make predictions, you need to train the model with the provided dataset. Run the training script from the project root:

```bash
python model/train.py
```

This will create two files in the `/model` directory:
-   `predictive_model.joblib`: The complete, trained model pipeline.
-   `features.json`: A file containing the list of features the model expects.

If these files already exist, they will be overwritten.

### 3. Making a Prediction (Command Line)

The prediction script now requires a JSON object containing all the necessary features.

**To make a prediction, run `model/predict.py` with the JSON string as an argument:**

```bash
python model/predict.py '{"Open Price":1.33,"Previous Day Close Price":1.3,"Premarket Volume":34353,"Open Gap %":0.02,"EOD Volume":4702414,"Ticker":"AREC"}'
```

The script will output a JSON response with the prediction and confidence level:

```json
{"prediction": "green", "confidence": "0.70"}
```

### 4. Running the Web Application

The web application provides a user interface for interacting with the model.

**From the project root, navigate to the `webapp` folder and run:**

```bash
cd webapp
npm run start:dev
```

This will do two things:
1.  Start the backend server at `http://localhost:4001`.
2.  Start the React client's development server and automatically open a tab in your browser at `http://localhost:3000`.

**Note:** The web application's frontend has not yet been updated to support the new JSON-based input format. This will require changes in `/webapp/client/src/App.js` and `/webapp/index.js`.
