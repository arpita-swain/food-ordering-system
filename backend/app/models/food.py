from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class FoodItem(Base):
    __tablename__ = "food_items"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    restaurant_id: Mapped[str] = mapped_column(String(50), ForeignKey("restaurants.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=4.5)
    rating_count: Mapped[int] = mapped_column(Integer, default=1)
    is_veg: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    is_bestseller: Mapped[bool] = mapped_column(Boolean, default=False)
    is_recommended: Mapped[bool] = mapped_column(Boolean, default=False)
    image: Mapped[str] = mapped_column(String(500), nullable=True)
    customizations: Mapped[dict] = mapped_column(
        JSON,
        default=lambda: {
            "sizes": [{"name": "Regular", "price": 0}],
            "extras": []
        }
    )
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)

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
    restaurant = relationship("Restaurant", back_populates="foods")
    favorites = relationship("Favorite", back_populates="food", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "restaurantId": self.restaurant_id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "price": self.price,
            "rating": self.rating,
            "ratingCount": self.rating_count,
            "isVeg": self.is_veg,
            "isBestseller": self.is_bestseller,
            "isRecommended": self.is_recommended,
            "image": self.image,
            "customizations": self.customizations or {"sizes": [], "extras": []},
            "isAvailable": self.is_available,
        }
