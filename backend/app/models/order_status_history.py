from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String(50), ForeignKey("orders.id", ondelete="CASCADE"), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    changed_by: Mapped[str] = mapped_column(String(100), default="System")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    order = relationship("Order", back_populates="status_history")

    def to_dict(self):
        return {
            "id": self.id,
            "orderId": self.order_id,
            "status": self.status,
            "changedBy": self.changed_by,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }
