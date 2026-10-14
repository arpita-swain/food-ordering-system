from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, Text, DateTime, ForeignKey, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String(50), ForeignKey("orders.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    restaurant_id: Mapped[str] = mapped_column(String(50), ForeignKey("restaurants.id", ondelete="CASCADE"), index=True, nullable=False)
    restaurant_rating: Mapped[float] = mapped_column(Float, default=5.0)
    food_rating: Mapped[float] = mapped_column(Float, default=5.0)
    review: Mapped[str] = mapped_column(Text, nullable=True)
    tags: Mapped[list] = mapped_column(JSON, default=list)

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

    user = relationship("User", back_populates="reviews")
    restaurant = relationship("Restaurant", back_populates="reviews")
    order = relationship("Order", back_populates="reviews")

    def to_dict(self):
        return {
            "id": self.id,
            "orderId": self.order_id,
            "userId": self.user_id,
            "restaurantId": self.restaurant_id,
            "restaurantRating": self.restaurant_rating,
            "foodRating": self.food_rating,
            "review": self.review,
            "tags": self.tags if isinstance(self.tags, list) else [],
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
