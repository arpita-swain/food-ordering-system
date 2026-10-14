from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.coupon import Coupon
from app.schemas.coupon import CouponCreate
from app.utils.helpers import generate_id


class CouponService:
    @staticmethod
    def get_coupons(db: Session) -> List[Dict[str, Any]]:
        coupons = db.query(Coupon).filter(Coupon.is_active == True).all()
        return [c.to_dict() for c in coupons]

    @staticmethod
    def validate_coupon(db: Session, code: str, cart_total: float) -> Dict[str, Any]:
        clean_code = code.strip().upper()
        coupon = db.query(Coupon).filter(Coupon.code == clean_code).first()

        if not coupon or not coupon.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid or expired coupon code '{code}'. Try SAVE50 or FOODIE100"
            )

        if cart_total < coupon.min_order:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Minimum order of ₹{coupon.min_order} required for coupon {coupon.code}"
            )

        discount = 0.0
        if coupon.discount_type == "percent":
            calculated = (cart_total * coupon.discount_percent) / 100.0
            discount = min(calculated, coupon.max_discount)
        else:
            discount = min(coupon.discount_amount, coupon.max_discount)

        discount_val = round(discount, 2)

        return {
            "success": True,
            "coupon": coupon.to_dict(),
            "discount": discount_val,
            "message": f"Coupon {coupon.code} applied successfully! You saved ₹{int(discount_val)}"
        }

    @staticmethod
    def create_coupon(db: Session, data: CouponCreate) -> Dict[str, Any]:
        clean_code = data.code.strip().upper()
        existing = db.query(Coupon).filter(Coupon.code == clean_code).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Coupon code '{clean_code}' already exists"
            )

        coupon_id = generate_id("cpn")
        new_coupon = Coupon(
            id=coupon_id,
            code=clean_code,
            description=data.description,
            discount_type=data.discountType,
            discount_percent=data.discountPercent or 0.0,
            discount_amount=data.discountAmount or 0.0,
            min_order=data.minOrder or 199.0,
            max_discount=data.maxDiscount or 100.0,
            badge=data.badge or "Special",
            expiry=data.expiry or "Valid for limited time",
            is_active=data.isActive if data.isActive is not None else True,
        )

        db.add(new_coupon)
        db.commit()
        db.refresh(new_coupon)
        return new_coupon.to_dict()
