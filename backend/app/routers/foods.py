from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.food import FoodResponse, FoodCreate, FoodUpdate
from app.services.food_service import FoodService
from app.core.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/foods", tags=["Food Items"])


@router.get("", response_model=List[FoodResponse])
def get_food_items(
    restaurantId: Optional[str] = Query(None, description="Filter foods by restaurant ID"),
    category: Optional[str] = Query(None, description="Filter foods by category (e.g. Biryani, Starters)"),
    isVeg: Optional[bool] = Query(None, description="Filter purely vegetarian dishes"),
    search: Optional[str] = Query(None, description="Search keywords in dish name or description"),
    db: Session = Depends(get_db),
):
    """Retrieve food items with optional filtering by restaurant, category, or vegetarian flag."""
    return FoodService.get_food_items(
        db=db,
        restaurant_id=restaurantId,
        category=category,
        is_veg=isVeg,
        search=search,
    )


@router.get("/{food_id}", response_model=FoodResponse)
def get_food_by_id(food_id: str, db: Session = Depends(get_db)):
    """Retrieve a single food item by ID."""
    return FoodService.get_by_id(db, food_id)


@router.post("", response_model=FoodResponse, status_code=status.HTTP_201_CREATED)
def create_food_item(
    data: FoodCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """Admin: Add a new dish to a restaurant menu."""
    return FoodService.create_food_item(db, data)


@router.put("/{food_id}", response_model=FoodResponse)
def update_food_item(
    food_id: str,
    data: FoodUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """Admin: Modify dish pricing, availability, or customization options."""
    return FoodService.update_food_item(db, food_id, data)


@router.delete("/{food_id}")
def delete_food_item(
    food_id: str,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """Admin: Delete a dish from the menu."""
    return FoodService.delete_food_item(db, food_id)
