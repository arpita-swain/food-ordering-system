from datetime import datetime, timezone
from sqlalchemy import String, Boolean, Float, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Address(Base):
    __tablename__ = "addresses"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    type: Mapped[str] = mapped_column(String(30), default="Home")  # Home, Work, Other
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    house: Mapped[str] = mapped_column(String(200), nullable=True)
    street: Mapped[str] = mapped_column(String(200), nullable=True)
    landmark: Mapped[str] = mapped_column(String(200), nullable=True)
    city: Mapped[str] = mapped_column(String(100), default="Dantan")
    state: Mapped[str] = mapped_column(String(100), default="West Bengal")
    pincode: Mapped[str] = mapped_column(String(20), default="721426")
    address_line: Mapped[str] = mapped_column(String(500), nullable=True)
    latitude: Mapped[float] = mapped_column(Float, default=21.9540)
    longitude: Mapped[float] = mapped_column(Float, default=87.2720)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)

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

    user = relationship("User", back_populates="addresses")

    def to_dict(self):
        line = self.address_line
        if not line:
            parts = [p for p in [self.house, self.street, self.landmark, self.city, self.state, self.pincode] if p]
            line = ", ".join(parts)
        return {
            "id": self.id,
            "userId": self.user_id,
            "type": self.type,
            "name": self.name,
            "phone": self.phone,
            "house": self.house,
            "street": self.street,
            "landmark": self.landmark,
            "city": self.city,
            "state": self.state,
            "pincode": self.pincode,
            "addressLine": line,
            "lat": self.latitude,
            "lng": self.longitude,
            "isDefault": self.is_default,
        }
