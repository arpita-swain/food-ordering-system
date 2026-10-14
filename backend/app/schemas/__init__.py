"""Pydantic schemas package"""
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    OtpSendRequest,
    OtpVerifyRequest,
    TokenPayload,
)
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.address import AddressCreate, AddressResponse
from app.schemas.restaurant import RestaurantCreate, RestaurantUpdate, RestaurantResponse
from app.schemas.category import CategoryResponse
from app.schemas.food import FoodCreate, FoodUpdate, FoodResponse
from app.schemas.coupon import CouponCreate, CouponValidateRequest, CouponValidateResponse, CouponResponse
from app.schemas.order import (
    OrderCreateRequest,
    OrderStatusUpdateRequest,
    OrderRatingRequest,
    OrderResponse,
)
from app.schemas.payment import (
    PaymentCreateSessionRequest,
    PaymentCreateSessionResponse,
    PaymentVerifyRequest,
    PaymentVerifyResponse,
)
from app.schemas.review import ReviewResponse

__all__ = [
    "LoginRequest",
    "RegisterRequest",
    "AuthResponse",
    "OtpSendRequest",
    "OtpVerifyRequest",
    "TokenPayload",
    "UserResponse",
    "UserUpdate",
    "AddressCreate",
    "AddressResponse",
    "RestaurantCreate",
    "RestaurantUpdate",
    "RestaurantResponse",
    "CategoryResponse",
    "FoodCreate",
    "FoodUpdate",
    "FoodResponse",
    "CouponCreate",
    "CouponValidateRequest",
    "CouponValidateResponse",
    "CouponResponse",
    "OrderCreateRequest",
    "OrderStatusUpdateRequest",
    "OrderRatingRequest",
    "OrderResponse",
    "PaymentCreateSessionRequest",
    "PaymentCreateSessionResponse",
    "PaymentVerifyRequest",
    "PaymentVerifyResponse",
    "ReviewResponse",
]
