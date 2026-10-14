from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String(50), ForeignKey("orders.id", ondelete="CASCADE"), index=True, nullable=False)
    food_id: Mapped[str] = mapped_column(String(50), nullable=True)  # Reference to food_items.id
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)  # Immutable snapshot price at order placement
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    size: Mapped[str] = mapped_column(String(100), default="Regular")
    extras: Mapped[list] = mapped_column(JSON, default=list)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    order = relationship("Order", back_populates="items")

    def to_dict(self):
        return {
            "id": self.food_id or self.id,
            "name": self.name,
            "price": self.price,
            "quantity": self.quantity,
            "size": self.size,
            "extras": self.extras if isinstance(self.extras, list) else [],
        }
