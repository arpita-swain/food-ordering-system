from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    restaurant_id: Mapped[str] = mapped_column(String(50), ForeignKey("restaurants.id", ondelete="RESTRICT"), index=True, nullable=False)
    restaurant_name: Mapped[str] = mapped_column(String(150), nullable=False)
    restaurant_address: Mapped[str] = mapped_column(String(300), nullable=True)

    # Financial pricing breakdown (recalculated by backend)
    subtotal: Mapped[float] = mapped_column(Float, default=0.0)
    delivery_fee: Mapped[float] = mapped_column(Float, default=0.0)
    platform_fee: Mapped[float] = mapped_column(Float, default=5.0)
    taxes: Mapped[float] = mapped_column(Float, default=0.0)
    delivery_tip: Mapped[float] = mapped_column(Float, default=0.0)
    discount: Mapped[float] = mapped_column(Float, default=0.0)
    grand_total: Mapped[float] = mapped_column(Float, default=0.0)

    # Delivery & instructions
    delivery_option: Mapped[str] = mapped_column(String(50), default="standard")
    special_instructions: Mapped[str] = mapped_column(Text, nullable=True)

    # Address snapshot
    delivery_name: Mapped[str] = mapped_column(String(100), nullable=False)
    delivery_phone: Mapped[str] = mapped_column(String(30), nullable=False)
    delivery_type: Mapped[str] = mapped_column(String(30), default="Home")
    delivery_address_line: Mapped[str] = mapped_column(String(500), nullable=False)
    delivery_latitude: Mapped[float] = mapped_column(Float, default=21.9540)
    delivery_longitude: Mapped[float] = mapped_column(Float, default=87.2720)

    # Status & Logistics
    status: Mapped[str] = mapped_column(String(30), default="Placed", index=True)  # Placed, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled
    estimated_delivery_time: Mapped[str] = mapped_column(String(50), default="25-30 minutes")
    delivery_partner_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    delivery_partner_info: Mapped[dict] = mapped_column(
        JSON,
        default=lambda: {
            "name": "Rajesh Kumar",
            "phone": "+91 98111 22334",
            "rating": 4.9,
            "vehicle": "Hero Splendor (WB-34-AB-1290)"
        }
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        index=True,
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False, cascade="all, delete-orphan")
    status_history = relationship("OrderStatusHistory", back_populates="order", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="order", cascade="all, delete-orphan")

    def build_tracking_steps(self):
        status_rank = {
            "Placed": 0,
            "Confirmed": 1,
            "Preparing": 2,
            "Out for Delivery": 3,
            "Delivered": 4,
            "Cancelled": -1,
        }
        current_rank = status_rank.get(self.status, 0)
        formatted_time = self.created_at.strftime("%I:%M %p") if self.created_at else "Just now"

        steps = [
            {"label": "Order Placed", "time": formatted_time, "done": current_rank >= 0},
            {"label": "Restaurant Confirmed", "time": "In 2 mins", "done": current_rank >= 1},
            {"label": "Food Being Prepared", "time": "In 10 mins", "done": current_rank >= 2},
            {"label": "Out for Delivery", "time": "In 18 mins", "done": current_rank >= 3},
            {"label": "Delivered", "time": "In 28 mins", "done": current_rank >= 4},
        ]
        return steps

    def to_dict(self):
        review = self.reviews[0] if self.reviews else None
        rating_obj = None
        if review:
            rating_obj = {
                "restaurant": review.restaurant_rating,
                "food": review.food_rating,
                "review": review.review,
                "tags": review.tags or [],
                "ratedAt": review.created_at.isoformat() if review.created_at else None,
            }

        payment_dict = {
            "method": self.payment.method if self.payment else "COD",
            "status": self.payment.status if self.payment else "PENDING",
            "transactionId": self.payment.transaction_id if self.payment else f"TXN_{self.id}",
        }

        return {
            "id": self.id,
            "date": self.created_at.isoformat() if self.created_at else datetime.now(timezone.utc).isoformat(),
            "restaurantId": self.restaurant_id,
            "restaurantName": self.restaurant_name,
            "restaurantAddress": self.restaurant_address,
            "status": self.status,
            "items": [item.to_dict() for item in self.items],
            "pricing": {
                "subtotal": round(self.subtotal, 2),
                "deliveryFee": round(self.delivery_fee, 2),
                "platformFee": round(self.platform_fee, 2),
                "taxes": round(self.taxes, 2),
                "deliveryTip": round(self.delivery_tip, 2),
                "discount": round(self.discount, 2),
                "grandTotal": round(self.grand_total, 2),
            },
            "deliveryOption": self.delivery_option,
            "specialInstructions": self.special_instructions or "",
            "deliveryAddress": {
                "name": self.delivery_name,
                "phone": self.delivery_phone,
                "type": self.delivery_type,
                "addressLine": self.delivery_address_line,
                "lat": self.delivery_latitude,
                "lng": self.delivery_longitude,
            },
            "payment": payment_dict,
            "estimatedDeliveryTime": self.estimated_delivery_time,
            "deliveryPartner": self.delivery_partner_info or {
                "name": "Rajesh Kumar",
                "phone": "+91 98111 22334",
                "rating": 4.9,
                "vehicle": "Hero Splendor (WB-34-AB-1290)"
            },
            "trackingSteps": self.build_tracking_steps(),
            "rating": rating_obj,
        }
