from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.coupon import (
    CouponResponse,
    CouponCreate,
    CouponValidateRequest,
    CouponValidateResponse,
)
from app.services.coupon_service import CouponService
from app.core.dependencies import require_admin
from app.models.user import User

router = APIRouter(prefix="/coupons", tags=["Coupons & Discounts"])


@router.get("", response_model=List[CouponResponse])
def get_coupons(db: Session = Depends(get_db)):
    """Fetch all active discount coupon vouchers."""
    return CouponService.get_coupons(db)


@router.post("/validate", response_model=CouponValidateResponse)
def validate_coupon(req: CouponValidateRequest, db: Session = Depends(get_db)):
    """Validate a coupon code against current cart value and calculate applicable discount."""
    return CouponService.validate_coupon(db, req.code, req.cartTotal)


@router.post("", response_model=CouponResponse, status_code=status.HTTP_201_CREATED)
def create_coupon(
    data: CouponCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """Admin: Issue a new promotional coupon code."""
    return CouponService.create_coupon(db, data)
