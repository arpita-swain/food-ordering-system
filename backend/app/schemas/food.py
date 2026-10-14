from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class FoodBase(BaseModel):
    name: str
    restaurantId: str
    category: str
    description: Optional[str] = None
    price: float
    rating: Optional[float] = 4.5
    ratingCount: Optional[int] = 1
    isVeg: Optional[bool] = False
    isBestseller: Optional[bool] = False
    isRecommended: Optional[bool] = False
    image: Optional[str] = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
    customizations: Optional[Dict[str, Any]] = Field(
        default_factory=lambda: {
            "sizes": [{"name": "Regular", "price": 0}],
            "extras": []
        }
    )
    isAvailable: Optional[bool] = True


class FoodCreate(FoodBase):
    pass


class FoodUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    rating: Optional[float] = None
    ratingCount: Optional[int] = None
    isVeg: Optional[bool] = None
    isBestseller: Optional[bool] = None
    isRecommended: Optional[bool] = None
    image: Optional[str] = None
    customizations: Optional[Dict[str, Any]] = None
    isAvailable: Optional[bool] = None


class FoodResponse(BaseModel):
    id: str
    restaurantId: str
    name: str
    category: str
    description: Optional[str] = None
    price: float
    rating: float
    ratingCount: int
    isVeg: bool
    isBestseller: bool
    isRecommended: bool
    image: Optional[str] = None
    customizations: Dict[str, Any]
    isAvailable: bool

    class Config:
        from_attributes = True
