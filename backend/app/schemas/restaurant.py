from typing import Optional, List, Union
from pydantic import BaseModel, Field


class RestaurantBase(BaseModel):
    name: str
    tagline: Optional[str] = None
    rating: Optional[float] = 4.5
    ratingCount: Optional[str] = "New"
    cuisines: Optional[Union[List[str], str]] = []
    priceForTwo: Optional[int] = 300
    deliveryTime: Optional[str] = "25-30 min"
    deliveryTimeMinutes: Optional[int] = 28
    distance: Optional[str] = "2.5 km"
    distanceKm: Optional[float] = 2.5
    pureVeg: Optional[bool] = False
    offer: Optional[str] = None
    featured: Optional[bool] = False
    isOpen: Optional[bool] = True
    openingHours: Optional[str] = "10:00 AM - 11:00 PM"
    address: str
    lat: Optional[float] = 21.9542
    lng: Optional[float] = 87.2721
    coverImage: Optional[str] = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000"
    logo: Optional[str] = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200"
    categories: Optional[List[str]] = []


class RestaurantCreate(RestaurantBase):
    pass


class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    rating: Optional[float] = None
    ratingCount: Optional[str] = None
    cuisines: Optional[Union[List[str], str]] = None
    priceForTwo: Optional[int] = None
    deliveryTime: Optional[str] = None
    deliveryTimeMinutes: Optional[int] = None
    distance: Optional[str] = None
    distanceKm: Optional[float] = None
    pureVeg: Optional[bool] = None
    offer: Optional[str] = None
    featured: Optional[bool] = None
    isOpen: Optional[bool] = None
    openingHours: Optional[str] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    coverImage: Optional[str] = None
    logo: Optional[str] = None
    categories: Optional[List[str]] = None


class RestaurantResponse(BaseModel):
    id: str
    name: str
    tagline: Optional[str] = None
    rating: float
    ratingCount: str
    cuisines: List[str]
    priceForTwo: int
    deliveryTime: str
    deliveryTimeMinutes: int
    distance: str
    distanceKm: float
    pureVeg: bool
    offer: Optional[str] = None
    featured: bool
    isOpen: bool
    openingHours: str
    address: str
    lat: float
    lng: float
    coverImage: Optional[str] = None
    logo: Optional[str] = None
    categories: List[str]

    class Config:
        from_attributes = True
