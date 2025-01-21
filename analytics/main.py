from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from textblob import TextBlob

app = FastAPI(title="Consumer Sentiment Analysis API", description="Analytics module for consumer sentiment analysis", version="1.0")

# Request model
class SentimentRequest(BaseModel):
    text: str

# Response model
class SentimentResponse(BaseModel):
    sentiment_score: float
    sentiment_category: str

@app.get("/")
def root():
    return {"message": "Welcome to the Consumer Sentiment Analysis API"}

@app.post("/analyze-sentiment", response_model=SentimentResponse)
def analyze_sentiment(request: SentimentRequest):