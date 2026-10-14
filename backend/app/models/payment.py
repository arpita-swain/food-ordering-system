from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String(50), ForeignKey("orders.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    method: Mapped[str] = mapped_column(String(50), default="UPI")  # UPI, CARD, NETBANKING, COD
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    transaction_id: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    gateway: Mapped[str] = mapped_column(String(50), default="Razorpay")
    gateway_order_id: Mapped[str] = mapped_column(String(100), nullable=True)
    gateway_payment_id: Mapped[str] = mapped_column(String(100), nullable=True)
    signature: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="PENDING")  # PENDING, PAID, FAILED, REFUNDED

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

    order = relationship("Order", back_populates="payment")

    def to_dict(self):
        return {
            "id": self.id,
            "orderId": self.order_id,
            "userId": self.user_id,
            "method": self.method,
            "amount": self.amount,
            "currency": self.currency,
            "transactionId": self.transaction_id,
            "gateway": self.gateway,
            "status": self.status,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
