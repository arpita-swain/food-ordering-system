from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.food import FoodItem
from app.models.category import Category
from app.models.restaurant import Restaurant
from app.schemas.food import FoodCreate, FoodUpdate
from app.utils.helpers import generate_id


class FoodService:
    @staticmethod
    def get_food_items(
        db: Session,
        restaurant_id: Optional[str] = None,
        category: Optional[str] = None,
        is_veg: Optional[bool] = None,
        search: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        query = db.query(FoodItem)

        if restaurant_id:
            query = query.filter(FoodItem.restaurant_id == restaurant_id)

        if category and category.lower() != "all":
            query = query.filter(FoodItem.category.ilike(category.strip()))

        if is_veg is not None:
            query = query.filter(FoodItem.is_veg == is_veg)

        if search:
            pat = f"%{search.strip().lower()}%"
            query = query.filter(
                or_(
                    FoodItem.name.ilike(pat),
                    FoodItem.description.ilike(pat),
                    FoodItem.category.ilike(pat),
                )
            )

        items = query.all()
        return [item.to_dict() for item in items]

    @staticmethod
    def get_by_id(db: Session, food_id: str) -> Dict[str, Any]:
        item = db.query(FoodItem).filter(FoodItem.id == food_id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Food item with id '{food_id}' not found"
            )
        return item.to_dict()

    @staticmethod
    def get_categories(db: Session) -> List[Dict[str, Any]]:
        cats = db.query(Category).filter(Category.is_active == True).all()
        return [c.to_dict() for c in cats]

    @staticmethod
    def create_food_item(db: Session, data: FoodCreate) -> Dict[str, Any]:
        restaurant = db.query(Restaurant).filter(Restaurant.id == data.restaurantId).first()
        if not restaurant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Restaurant with id '{data.restaurantId}' not found"
            )

        food_id = generate_id("food")
        new_item = FoodItem(
            id=food_id,
            restaurant_id=data.restaurantId,
            name=data.name,
            category=data.category,
            description=data.description or "Freshly prepared specialty dish with premium spices.",
            price=data.price,
            rating=data.rating or 4.5,
            rating_count=data.ratingCount or 1,
            is_veg=data.isVeg or False,
            is_bestseller=data.isBestseller or False,
            is_recommended=data.isRecommended or False,
            image=data.image or "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
            customizations=data.customizations or {
                "sizes": [{"name": "Regular", "price": 0}],
                "extras": []
            },
            is_available=data.isAvailable if data.isAvailable is not None else True,
        )

        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item.to_dict()

    @staticmethod
    def update_food_item(db: Session, food_id: str, data: FoodUpdate) -> Dict[str, Any]:
        item = db.query(FoodItem).filter(FoodItem.id == food_id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Food item with id '{food_id}' not found"
            )

        update_dict = data.model_dump(exclude_unset=True)
        for key, val in update_dict.items():
            if key == "isVeg":
                item.is_veg = val
            elif key == "isBestseller":
                item.is_bestseller = val
            elif key == "isRecommended":
                item.is_recommended = val
            elif key == "isAvailable":
                item.is_available = val
            elif key == "ratingCount":
                item.rating_count = val
            elif hasattr(item, key):
                setattr(item, key, val)

        db.commit()
        db.refresh(item)
        return item.to_dict()

    @staticmethod
    def delete_food_item(db: Session, food_id: str) -> Dict[str, bool]:
        item = db.query(FoodItem).filter(FoodItem.id == food_id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Food item with id '{food_id}' not found"
            )
        db.delete(item)
        db.commit()
        return {"success": True}
