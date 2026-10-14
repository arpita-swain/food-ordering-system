from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.models.restaurant import Restaurant
from app.schemas.restaurant import RestaurantCreate, RestaurantUpdate
from app.utils.helpers import generate_id


class RestaurantService:
    @staticmethod
    def get_restaurants(
        db: Session,
        pure_veg: Optional[bool] = None,
        min_rating: Optional[float] = None,
        cuisine: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        query = db.query(Restaurant)

        if pure_veg is True:
            query = query.filter(Restaurant.pure_veg == True)

        if min_rating is not None and min_rating > 0:
            query = query.filter(Restaurant.rating >= min_rating)

        if search:
            search_pattern = f"%{search.strip().lower()}%"
            query = query.filter(
                or_(
                    Restaurant.name.ilike(search_pattern),
                    Restaurant.address.ilike(search_pattern),
                    Restaurant.tagline.ilike(search_pattern),
                )
            )

        restaurants = query.all()

        # Cuisine filter in Python because cuisines is stored as JSON array
        if cuisine and cuisine.lower() != "all":
            target_cuisine = cuisine.strip().lower()
            restaurants = [
                r for r in restaurants
                if any(target_cuisine in str(c).lower() for c in (r.cuisines or []))
            ]

        # In-memory search fallback for cuisines if search was provided
        if search:
            search_lower = search.strip().lower()
            # Make sure restaurants with cuisine match are included if not already captured
            pass

        # Sorting
        if sort_by == "rating":
            restaurants.sort(key=lambda x: x.rating, reverse=True)
        elif sort_by == "deliveryTime":
            restaurants.sort(key=lambda x: x.delivery_time_minutes)
        elif sort_by == "priceLow":
            restaurants.sort(key=lambda x: x.price_for_two)
        elif sort_by == "distance":
            restaurants.sort(key=lambda x: x.distance_km)

        return [r.to_dict() for r in restaurants]

    @staticmethod
    def get_by_id(db: Session, restaurant_id: str) -> Dict[str, Any]:
        restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
        if not restaurant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Restaurant with id '{restaurant_id}' not found"
            )
        return restaurant.to_dict()

    @staticmethod
    def create_restaurant(db: Session, data: RestaurantCreate) -> Dict[str, Any]:
        rest_id = generate_id("rest")
        cuisines_list = data.cuisines
        if isinstance(cuisines_list, str):
            cuisines_list = [c.strip() for c in cuisines_list.split(",") if c.strip()]

        restaurant = Restaurant(
            id=rest_id,
            name=data.name,
            tagline=data.tagline or "Delicious food freshly delivered",
            rating=data.rating or 4.5,
            rating_count=data.ratingCount or "New",
            cuisines=cuisines_list or ["Multicuisine"],
            price_for_two=data.priceForTwo or 300,
            delivery_time=data.deliveryTime or "25-30 min",
            delivery_time_minutes=data.deliveryTimeMinutes or 28,
            distance=data.distance or "2.5 km",
            distance_km=data.distanceKm or 2.5,
            pure_veg=data.pureVeg or False,
            offer=data.offer,
            featured=data.featured or False,
            is_open=data.isOpen if data.isOpen is not None else True,
            opening_hours=data.openingHours or "10:00 AM - 11:00 PM",
            address=data.address,
            latitude=data.lat or 21.9542,
            longitude=data.lng or 87.2721,
            cover_image=data.coverImage or "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000",
            logo=data.logo or "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200",
            categories=data.categories or ["Recommended", "Bestsellers", "Main Course", "Beverages"],
        )

        db.add(restaurant)
        db.commit()
        db.refresh(restaurant)
        return restaurant.to_dict()

    @staticmethod
    def update_restaurant(db: Session, restaurant_id: str, data: RestaurantUpdate) -> Dict[str, Any]:
        restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
        if not restaurant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Restaurant with id '{restaurant_id}' not found"
            )

        update_dict = data.model_dump(exclude_unset=True)
        for key, val in update_dict.items():
            if key == "cuisines":
                if isinstance(val, str):
                    val = [c.strip() for c in val.split(",") if c.strip()]
                restaurant.cuisines = val
            elif key == "priceForTwo":
                restaurant.price_for_two = val
            elif key == "deliveryTime":
                restaurant.delivery_time = val
            elif key == "deliveryTimeMinutes":
                restaurant.delivery_time_minutes = val
            elif key == "distance":
                restaurant.distance = val
            elif key == "distanceKm":
                restaurant.distance_km = val
            elif key == "pureVeg":
                restaurant.pure_veg = val
            elif key == "ratingCount":
                restaurant.rating_count = val
            elif key == "isOpen":
                restaurant.is_open = val
            elif key == "openingHours":
                restaurant.opening_hours = val
            elif key == "lat":
                restaurant.latitude = val
            elif key == "lng":
                restaurant.longitude = val
            elif key == "coverImage":
                restaurant.cover_image = val
            elif hasattr(restaurant, key):
                setattr(restaurant, key, val)

        db.commit()
        db.refresh(restaurant)
        return restaurant.to_dict()

    @staticmethod
    def delete_restaurant(db: Session, restaurant_id: str) -> Dict[str, bool]:
        restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
        if not restaurant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Restaurant with id '{restaurant_id}' not found"
            )
        db.delete(restaurant)
        db.commit()
        return {"success": True}
