from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.restaurant import (
    RestaurantResponse,
    RestaurantCreate,
    RestaurantUpdate,
)
from app.services.restaurant_service import RestaurantService
from app.core.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/restaurants", tags=["Restaurants"])


@router.get("", response_model=List[RestaurantResponse])
def get_restaurants(
    pureVeg: Optional[bool] = Query(None, description="Filter purely vegetarian restaurants"),
    minRating: Optional[float] = Query(None, description="Minimum customer star rating"),
    cuisine: Optional[str] = Query(None, description="Filter by cuisine (e.g., Biryani, Pizza)"),
    search: Optional[str] = Query(None, description="Search keyword for restaurant name or dishes"),
    sortBy: Optional[str] = Query(None, description="Sort: rating | deliveryTime | priceLow | distance"),
    db: Session = Depends(get_db),
):
    """Retrieve all available restaurants with optional filtering and sorting."""
    return RestaurantService.get_restaurants(
        db=db,
        pure_veg=pureVeg,
        min_rating=minRating,
        cuisine=cuisine,
        search=search,
        sort_by=sortBy,
    )


@router.get("/{restaurant_id}", response_model=RestaurantResponse)
def get_restaurant_by_id(restaurant_id: str, db: Session = Depends(get_db)):
    """Retrieve detailed information for a specific restaurant by its unique ID."""
    return RestaurantService.get_by_id(db, restaurant_id)


@router.post("", response_model=RestaurantResponse, status_code=status.HTTP_201_CREATED)
def create_restaurant(
    data: RestaurantCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """Admin: Add a new partner restaurant."""
    return RestaurantService.create_restaurant(db, data)


@router.put("/{restaurant_id}", response_model=RestaurantResponse)
def update_restaurant(
    restaurant_id: str,
    data: RestaurantUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """Admin: Update an existing restaurant's profile, hours, or status."""
    return RestaurantService.update_restaurant(db, restaurant_id, data)


@router.delete("/{restaurant_id}")
def delete_restaurant(
    restaurant_id: str,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """Admin: Remove a restaurant from the platform."""
    return RestaurantService.delete_restaurant(db, restaurant_id)
