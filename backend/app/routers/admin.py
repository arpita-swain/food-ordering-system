from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.connection import get_db
from app.models.order import Order
from app.models.restaurant import Restaurant
from app.models.user import User
from app.models.food import FoodItem
from app.core.dependencies import require_admin

router = APIRouter(prefix="/admin", tags=["Admin Portal"])


@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
) -> Dict[str, Any]:
    """Admin: Retrieve platform key performance indicators and metrics."""
    total_orders = db.query(Order).count()
    total_restaurants = db.query(Restaurant).count()
    total_users = db.query(User).count()
    total_foods = db.query(FoodItem).count()

    total_revenue = db.query(func.sum(Order.grand_total)).scalar() or 0.0
    active_orders = db.query(Order).filter(Order.status != "Delivered").count()

    return {
        "totalOrders": total_orders,
        "totalRevenue": round(float(total_revenue), 2),
        "totalRestaurants": total_restaurants,
        "totalUsers": total_users,
        "totalFoods": total_foods,
        "activeOrders": active_orders,
    }
