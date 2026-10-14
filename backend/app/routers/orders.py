from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.order import (
    OrderCreateRequest,
    OrderStatusUpdateRequest,
    OrderRatingRequest,
    OrderResponse,
)
from app.services.order_service import OrderService
from app.core.dependencies import get_current_user_optional, get_current_user
from app.models.user import User

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    req: OrderCreateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Place a food order.
    Prices are verified against the database and recalculated securely inside an atomic transaction.
    """
    return OrderService.create_order(db, req, current_user)


@router.get("", response_model=List[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Fetch orders. Customers see their own orders; delivery partners and admins see active/all orders.
    """
    return OrderService.get_orders(db, current_user)


@router.get("/history", response_model=List[OrderResponse])
def get_order_history(
    status: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Retrieve past order history for the authenticated customer or guest.
    Supports filtering by status (e.g. 'Delivered', 'Cancelled', 'Placed') and limit.
    """
    return OrderService.get_order_history(db, current_user, status_filter=status, limit=limit)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Retrieve full order details and live delivery tracking status."""
    return OrderService.get_by_id(db, order_id, current_user)


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    req: OrderStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Update order status ('Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled')."""
    return OrderService.update_status(db, order_id, req.status, current_user)


@router.post("/{order_id}/rating")
def rate_order(
    order_id: str,
    req: OrderRatingRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Submit a customer rating and review for a delivered order."""
    return OrderService.rate_order(db, order_id, req, current_user)
