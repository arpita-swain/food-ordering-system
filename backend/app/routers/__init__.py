"""API routers package"""
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.restaurants import router as restaurants_router
from app.routers.categories import router as categories_router
from app.routers.foods import router as foods_router
from app.routers.coupons import router as coupons_router
from app.routers.orders import router as orders_router
from app.routers.payments import router as payments_router
from app.routers.favorites import router as favorites_router
from app.routers.admin import router as admin_router

__all__ = [
    "auth_router",
    "users_router",
    "restaurants_router",
    "categories_router",
    "foods_router",
    "coupons_router",
    "orders_router",
    "payments_router",
    "favorites_router",
    "admin_router",
]
