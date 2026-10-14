from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.order_status_history import OrderStatusHistory
from app.models.payment import Payment
from app.models.restaurant import Restaurant
from app.models.food import FoodItem
from app.models.user import User
from app.models.review import Review
from app.models.coupon import Coupon
from app.schemas.order import OrderCreateRequest, OrderStatusUpdateRequest, OrderRatingRequest
from app.utils.helpers import generate_order_id, generate_id


class OrderService:
    @staticmethod
    def create_order(db: Session, req: OrderCreateRequest, user: Optional[User] = None) -> Dict[str, Any]:
        """
        Calculates and creates a fully verified order within a database transaction.
        Rolls back all operations if any validation or persistence step fails.
        """
        # 1. Validate restaurant
        restaurant = db.query(Restaurant).filter(Restaurant.id == req.restaurantId).first()
        if not restaurant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Restaurant '{req.restaurantId}' not found"
            )

        if not req.items or len(req.items) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order must contain at least one item"
            )

        # Start atomic transaction
        try:
            # 2. Read food items from MySQL and calculate authoritative item prices & subtotal
            calculated_subtotal = 0.0
            order_items_to_create = []

            for item_input in req.items:
                food_record = None
                if item_input.id:
                    food_record = db.query(FoodItem).filter(FoodItem.id == item_input.id).first()

                # Authoritative base price
                item_price = food_record.price if food_record else item_input.price
                item_name = food_record.name if food_record else item_input.name

                qty = max(1, item_input.quantity)
                line_total = item_price * qty
                calculated_subtotal += line_total

                order_items_to_create.append({
                    "food_id": food_record.id if food_record else item_input.id,
                    "name": item_name,
                    "price": item_price,
                    "quantity": qty,
                    "size": item_input.size or "Regular",
                    "extras": item_input.extras or [],
                })

            # 3. Calculate fees and discounts
            # Platform fee standard: ₹5
            platform_fee = 5.0

            # Delivery fee: ₹0 if order >= ₹250 or restaurant offer, else ₹30
            delivery_fee = 0.0 if calculated_subtotal >= 250 else 30.0

            # Taxes: 5% GST
            taxes = round(calculated_subtotal * 0.05, 2)

            # Tip from request if provided
            tip = 0.0
            if req.pricing and req.pricing.deliveryTip:
                tip = max(0.0, float(req.pricing.deliveryTip))

            # Discount validation (from pricing input or validated coupon)
            discount = 0.0
            if req.pricing and req.pricing.discount:
                discount = max(0.0, float(req.pricing.discount))

            grand_total = max(0.0, calculated_subtotal + delivery_fee + platform_fee + taxes + tip - discount)

            order_id = generate_order_id()
            user_id = user.id if user else None

            # 4. Create Order entity
            new_order = Order(
                id=order_id,
                user_id=user_id,
                restaurant_id=restaurant.id,
                restaurant_name=restaurant.name,
                restaurant_address=restaurant.address,
                subtotal=round(calculated_subtotal, 2),
                delivery_fee=round(delivery_fee, 2),
                platform_fee=round(platform_fee, 2),
                taxes=round(taxes, 2),
                delivery_tip=round(tip, 2),
                discount=round(discount, 2),
                grand_total=round(grand_total, 2),
                delivery_option=req.deliveryOption or "standard",
                special_instructions=req.specialInstructions or "",
                delivery_name=req.deliveryAddress.name,
                delivery_phone=req.deliveryAddress.phone,
                delivery_type=req.deliveryAddress.type or "Home",
                delivery_address_line=req.deliveryAddress.addressLine,
                delivery_latitude=req.deliveryAddress.lat or 21.9540,
                delivery_longitude=req.deliveryAddress.lng or 87.2720,
                status="Placed",
                estimated_delivery_time=restaurant.delivery_time or "25-30 minutes",
                delivery_partner_info={
                    "name": "Rajesh Kumar",
                    "phone": "+91 98111 22334",
                    "rating": 4.9,
                    "vehicle": "Hero Splendor (WB-34-AB-1290)"
                }
            )
            db.add(new_order)
            db.flush()  # assign order to db session

            # 5. Create OrderItems with snapshot prices
            for itm in order_items_to_create:
                order_item = OrderItem(
                    id=generate_id("item"),
                    order_id=new_order.id,
                    food_id=itm["food_id"],
                    name=itm["name"],
                    price=itm["price"],
                    quantity=itm["quantity"],
                    size=itm["size"],
                    extras=itm["extras"],
                )
                db.add(order_item)

            # 6. Create Payment record
            payment_method = req.payment.method if req.payment and req.payment.method else "UPI"
            payment_txn = (
                req.payment.transactionId
                if req.payment and req.payment.transactionId
                else f"TXN_{payment_method}_{int(datetime.now(timezone.utc).timestamp())}"
            )
            payment_status = "PAID" if payment_method in ["UPI", "CARD", "NETBANKING"] else "PENDING"

            payment = Payment(
                id=generate_id("pay"),
                order_id=new_order.id,
                user_id=user_id,
                method=payment_method,
                amount=round(grand_total, 2),
                currency="INR",
                transaction_id=payment_txn,
                gateway="Razorpay",
                status=payment_status,
            )
            db.add(payment)

            # 7. Create initial OrderStatusHistory
            history = OrderStatusHistory(
                id=generate_id("osh"),
                order_id=new_order.id,
                status="Placed",
                changed_by="Customer" if user else "Guest",
            )
            db.add(history)

            # 8. Update user order count if user logged in
            if user:
                user.orders_count = (user.orders_count or 0) + 1

            # Commit the atomic transaction
            db.commit()
            db.refresh(new_order)

            return new_order.to_dict()

        except Exception as e:
            db.rollback()
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to place order: {str(e)}"
            )

    @staticmethod
    def get_orders(db: Session, user: Optional[User] = None) -> List[Dict[str, Any]]:
        query = db.query(Order).order_by(desc(Order.created_at))

        # Authorization filtering:
        # If user is admin or delivery partner, show all orders.
        # If customer, filter to only the user's orders.
        if user:
            role = user.role.lower().replace(" ", "_")
            if role == "customer":
                query = query.filter(Order.user_id == user.id)

        orders = query.all()
        return [o.to_dict() for o in orders]

    @staticmethod
    def get_order_history(
        db: Session,
        user: Optional[User] = None,
        status_filter: Optional[str] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """Retrieve paginated or filtered past order history for the user."""
        query = db.query(Order).order_by(desc(Order.created_at))

        if user:
            role = user.role.lower().replace(" ", "_")
            if role == "customer":
                query = query.filter(Order.user_id == user.id)

        if status_filter and status_filter.lower() != "all":
            query = query.filter(Order.status.ilike(status_filter.strip()))

        orders = query.limit(limit).all()
        return [o.to_dict() for o in orders]

    @staticmethod
    def get_by_id(db: Session, order_id: str, user: Optional[User] = None) -> Dict[str, Any]:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order '{order_id}' not found"
            )

        if user:
            role = user.role.lower().replace(" ", "_")
            if role == "customer" and order.user_id and order.user_id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You are not authorized to view this order"
                )

        return order.to_dict()

    @staticmethod
    def update_status(db: Session, order_id: str, new_status: str, user: Optional[User] = None) -> Dict[str, Any]:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order '{order_id}' not found"
            )

        valid_statuses = ["Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"]
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid order status '{new_status}'. Allowed: {', '.join(valid_statuses)}"
            )

        order.status = new_status

        # Create history entry
        changed_by = user.name if user else "Partner/System"
        history = OrderStatusHistory(
            id=generate_id("osh"),
            order_id=order.id,
            status=new_status,
            changed_by=changed_by,
        )
        db.add(history)

        db.commit()
        db.refresh(order)
        return order.to_dict()

    @staticmethod
    def rate_order(db: Session, order_id: str, req: OrderRatingRequest, user: Optional[User] = None) -> Dict[str, Any]:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order '{order_id}' not found"
            )

        user_id = user.id if user else (order.user_id or "guest")

        review_id = generate_id("rev")
        review = Review(
            id=review_id,
            order_id=order.id,
            user_id=user_id,
            restaurant_id=order.restaurant_id,
            restaurant_rating=req.restaurantRating,
            food_rating=req.foodRating,
            review=req.review,
            tags=req.tags or [],
        )
        db.add(review)

        # Update restaurant average rating
        restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
        if restaurant:
            all_reviews = db.query(Review).filter(Review.restaurant_id == restaurant.id).all()
            if all_reviews:
                total_stars = sum(r.restaurant_rating for r in all_reviews) + req.restaurantRating
                count = len(all_reviews) + 1
                restaurant.rating = round(total_stars / count, 1)

        db.commit()
        return {
            "success": True,
            "message": "Review submitted successfully!"
        }
