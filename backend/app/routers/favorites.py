from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.favorite import Favorite
from app.models.restaurant import Restaurant
from app.models.food import FoodItem
from app.models.user import User
from app.core.dependencies import get_current_user
from app.utils.helpers import generate_id

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get("")
def get_user_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Retrieve list of favorite restaurant IDs and food IDs for the user."""
    favs = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    rest_ids = [f.restaurant_id for f in favs if f.restaurant_id]
    food_ids = [f.food_id for f in favs if f.food_id]
    return {
        "restaurantIds": rest_ids,
        "foodIds": food_ids,
    }


@router.post("/restaurants/{restaurant_id}")
def add_favorite_restaurant(
    restaurant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add or toggle restaurant in user's favorites."""
    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.restaurant_id == restaurant_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"success": True, "favorited": False, "message": "Removed from favorites"}

    fav = Favorite(
        id=generate_id("fav"),
        user_id=current_user.id,
        restaurant_id=restaurant_id,
        food_id=None,
    )
    db.add(fav)
    db.commit()
    return {"success": True, "favorited": True, "message": "Added to favorites"}


@router.delete("/restaurants/{restaurant_id}")
def remove_favorite_restaurant(
    restaurant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove restaurant from user's favorites."""
    fav = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.restaurant_id == restaurant_id
    ).first()

    if fav:
        db.delete(fav)
        db.commit()
    return {"success": True}


@router.post("/foods/{food_id}")
def add_favorite_food(
    food_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add or toggle dish in user's favorites."""
    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.food_id == food_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"success": True, "favorited": False, "message": "Removed from favorites"}

    fav = Favorite(
        id=generate_id("fav"),
        user_id=current_user.id,
        restaurant_id=None,
        food_id=food_id,
    )
    db.add(fav)
    db.commit()
    return {"success": True, "favorited": True, "message": "Added to favorites"}


@router.delete("/foods/{food_id}")
def remove_favorite_food(
    food_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove dish from user's favorites."""
    fav = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.food_id == food_id
    ).first()

    if fav:
        db.delete(fav)
        db.commit()
    return {"success": True}
