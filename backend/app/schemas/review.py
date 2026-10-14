from typing import Optional, List
from pydantic import BaseModel, Field


class ReviewCreateRequest(BaseModel):
    restaurantRating: float = Field(..., ge=1, le=5)
    foodRating: float = Field(..., ge=1, le=5)
    review: Optional[str] = ""
    tags: Optional[List[str]] = []


class ReviewResponse(BaseModel):
    id: str
    orderId: str
    userId: str
    restaurantId: str
    restaurantRating: float
    foodRating: float
    review: Optional[str] = None
    tags: List[str]
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True
