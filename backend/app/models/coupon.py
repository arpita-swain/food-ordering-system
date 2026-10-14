from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, Boolean, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base


class Coupon(Base):
    __tablename__ = "coupons"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    discount_type: Mapped[str] = mapped_column(String(20), default="fixed")  # "fixed" or "percent"
    discount_percent: Mapped[float] = mapped_column(Float, default=0.0)
    discount_amount: Mapped[float] = mapped_column(Float, default=0.0)
    max_discount: Mapped[float] = mapped_column(Float, default=100.0)
    min_order: Mapped[float] = mapped_column(Float, default=199.0)
    badge: Mapped[str] = mapped_column(String(50), default="Popular")
    expiry: Mapped[str] = mapped_column(String(100), default="Never expires")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

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

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "description": self.description,
            "discountType": self.discount_type,
            "discountPercent": self.discount_percent,
            "discountAmount": self.discount_amount,
            "maxDiscount": self.max_discount,
            "minOrder": self.min_order,
            "badge": self.badge,
            "expiry": self.expiry,
            "isActive": self.is_active,
        }
