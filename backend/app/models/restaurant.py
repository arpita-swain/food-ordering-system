import json
from datetime import datetime, timezone
from typing import List
from sqlalchemy import String, Integer, Float, Boolean, Text, DateTime, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Restaurant(Base):
    __tablename__ = "restaurants"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    tagline: Mapped[str] = mapped_column(String(255), nullable=True)
    rating: Mapped[float] = mapped_column(Float, default=4.5)
    rating_count: Mapped[str] = mapped_column(String(30), default="New")
    cuisines: Mapped[list] = mapped_column(JSON, default=list)  # list of strings
    price_for_two: Mapped[int] = mapped_column(Integer, default=300)
    delivery_time: Mapped[str] = mapped_column(String(50), default="25-30 min")
    delivery_time_minutes: Mapped[int] = mapped_column(Integer, default=28)
    distance: Mapped[str] = mapped_column(String(50), default="2.5 km")
    distance_km: Mapped[float] = mapped_column(Float, default=2.5)
    pure_veg: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    offer: Mapped[str] = mapped_column(String(150), nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    is_open: Mapped[bool] = mapped_column(Boolean, default=True)
    opening_hours: Mapped[str] = mapped_column(String(100), default="10:00 AM - 11:00 PM")
    address: Mapped[str] = mapped_column(String(300), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, default=21.9542)
    longitude: Mapped[float] = mapped_column(Float, default=87.2721)
    cover_image: Mapped[str] = mapped_column(String(500), nullable=True)
    logo: Mapped[str] = mapped_column(String(500), nullable=True)
    categories: Mapped[list] = mapped_column(JSON, default=list)  # list of category names

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    foods = relationship("FoodItem", back_populates="restaurant", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="restaurant", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="restaurant", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "tagline": self.tagline,
            "rating": self.rating,
            "ratingCount": self.rating_count,
            "cuisines": self.cuisines if isinstance(self.cuisines, list) else [],
            "priceForTwo": self.price_for_two,
            "deliveryTime": self.delivery_time,
            "deliveryTimeMinutes": self.delivery_time_minutes,
            "distance": self.distance,
            "distanceKm": self.distance_km,
            "pureVeg": self.pure_veg,
            "offer": self.offer,
            "featured": self.featured,
            "isOpen": self.is_open,
            "openingHours": self.opening_hours,
            "address": self.address,
            "lat": self.latitude,
            "lng": self.longitude,
            "coverImage": self.cover_image,
            "logo": self.logo,
            "categories": self.categories if isinstance(self.categories, list) else [],
        }
