from fastapi import FastAPI
from app.services.sentiment import router as sentiment_router

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Welcome to the Analytics Microservice"}

app.include_router(sentiment_router, prefix="/sentiment", tags=["sentiment"])