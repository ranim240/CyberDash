"""
Prediction service — loads the trained XGBoost model and predicts success probability.
"""
import joblib
import os
from config import MODEL_PATH

_model = None

def get_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Train the model first.")
        _model = joblib.load(MODEL_PATH)
    return _model

def predict_success_probability(features_df):
    """Returns P(success) for a (learner, challenge) pair."""
    model = get_model()
    proba = model.predict_proba(features_df)[0][1]  # probability of class 1 (success)
    return float(proba)
