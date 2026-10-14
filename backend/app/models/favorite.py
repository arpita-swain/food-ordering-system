from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    restaurant_id: Mapped[str] = mapped_column(String(50), ForeignKey("restaurants.id", ondelete="CASCADE"), nullable=True, index=True)
    food_id: Mapped[str] = mapped_column(String(50), ForeignKey("food_items.id", ondelete="CASCADE"), nullable=True, index=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    user = relationship("User", back_populates="favorites")
    restaurant = relationship("Restaurant", back_populates="favorites")
    food = relationship("FoodItem", back_populates="favorites")

    __table_args__ = (
        UniqueConstraint("user_id", "restaurant_id", name="uq_user_restaurant_favorite"),
        UniqueConstraint("user_id", "food_id", name="uq_user_food_favorite"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "restaurantId": self.restaurant_id,
            "foodId": self.food_id,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
