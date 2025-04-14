from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from textblob import TextBlob

router = APIRouter()

class Review(BaseModel):
    review_text: str

@router.post("/sentimentscore")
def analyze_sentiment(review: Review):
    if not review.review_text.strip():
        raise HTTPException(status_code=400, detail="Review text cannot be empty.")
    
    blob = TextBlob(review.review_text)
    polarity = blob.sentiment.polarity
    return {"sentiment_score": polarity}