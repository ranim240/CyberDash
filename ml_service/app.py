"""
CyberDash ML Microservice — FastAPI + XGBoost
Recommends personalized challenges based on learner skill profiles.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.recommend import router as recommend_router
from config import PORT

app = FastAPI(title="CyberDash ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-recommendation"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=PORT, reload=True)
