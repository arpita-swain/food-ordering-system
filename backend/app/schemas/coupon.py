from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class CouponBase(BaseModel):
    code: str
    description: str
    discountType: str = "fixed"  # "fixed" or "percent"
    discountPercent: Optional[float] = 0.0
    discountAmount: Optional[float] = 0.0
    minOrder: Optional[float] = 199.0
    maxDiscount: Optional[float] = 100.0
    badge: Optional[str] = "Popular"
    expiry: Optional[str] = "Never expires"
    isActive: Optional[bool] = True


class CouponCreate(CouponBase):
    pass


class CouponResponse(CouponBase):
    id: str

    class Config:
        from_attributes = True


class CouponValidateRequest(BaseModel):
    code: str
    cartTotal: float


class CouponValidateResponse(BaseModel):
    success: bool = True
    coupon: CouponResponse
    discount: float
    message: str
