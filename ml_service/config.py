import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/cyberdash")
MODEL_PATH = os.getenv("MODEL_PATH", "models/xgb_recommender.pkl")
PORT = int(os.getenv("ML_PORT", 8000))
