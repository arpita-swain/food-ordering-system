"""
Seed script to populate MySQL database with realistic FoodieGo initial dataset.
Runs independently without frontend runtime dependencies.
"""
import sys
import os
from datetime import datetime, timezone

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.connection import SessionLocal, engine
from app.database.base import Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.address import Address
from app.models.category import Category
from app.models.restaurant import Restaurant
from app.models.food import FoodItem
from app.models.coupon import Coupon
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.order_status_history import OrderStatusHistory
from app.models.payment import Payment

# Ensure tables exist
Base.metadata.create_all(bind=engine)


def seed_database():
    db = SessionLocal()
    print("🌱 Starting database seeding for FoodieGo...")

    try:
        # 1. Seed Users
        demo_users = [
            {
                "id": "user-customer",
                "name": "Arpit Sinha",
                "email": "customer@foodiego.com",
                "phone": "+91 98765 43210",
                "role": "Customer",
                "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                "orders_count": 14,
            },
            {
                "id": "user-partner",
                "name": "Rajesh Kumar (Partner)",
                "email": "delivery@foodiego.com",
                "phone": "+91 98111 22334",
                "role": "Delivery Partner",
                "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
                "orders_count": 842,
            },
            {
                "id": "user-admin",
                "name": "Admin Supervisor",
                "email": "admin@foodiego.com",
                "phone": "+91 90000 00001",
                "role": "Admin",
                "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                "orders_count": 0,
            },
            {
                "id": "user-1",
                "name": "Arpit Sinha",
                "email": "arpit@foodiego.com",
                "phone": "+91 98765 43211",
                "role": "Customer",
                "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                "orders_count": 5,
            },
        ]

        for u_data in demo_users:
            existing = db.query(User).filter(User.email == u_data["email"]).first()
            if not existing:
                user = User(
                    id=u_data["id"],
                    name=u_data["name"],
                    email=u_data["email"],
                    phone=u_data["phone"],
                    password_hash=get_password_hash("password123"),
                    role=u_data["role"],
                    avatar=u_data["avatar"],
                    status="Active",
                    orders_count=u_data["orders_count"],
                )
                db.add(user)
                print(f"  + User created: {user.email} (Role: {user.role})")

        db.commit()

        # 2. Seed Addresses for demo customer
        sample_addresses = [
            {
                "id": "addr-1",
                "user_id": "user-customer",
                "type": "Home",
                "name": "Arpit Sinha",
                "phone": "+91 98765 43210",
                "house": "Flat 4B, Sunrise Enclave",
                "street": "Station Road, Near Post Office",
                "landmark": "Opposite State Bank",
                "city": "Dantan",
                "state": "West Bengal",
                "pincode": "721426",
                "address_line": "Flat 4B, Sunrise Enclave, Station Road, Near Post Office, Dantan, West Bengal",
                "latitude": 21.9540,
                "longitude": 87.2720,
                "is_default": True,
            },
            {
                "id": "addr-2",
                "user_id": "user-customer",
                "type": "Work",
                "name": "Arpit Sinha",
                "phone": "+91 98765 43210",
                "house": "Tech Hub Floor 3",
                "street": "IT Park Bypass, Sector 5",
                "landmark": "Near City Gate",
                "city": "Dantan",
                "state": "West Bengal",
                "pincode": "721426",
                "address_line": "Tech Hub Floor 3, IT Park Bypass, Sector 5, Dantan, West Bengal",
                "latitude": 21.9620,
                "longitude": 87.2650,
                "is_default": False,
            },
        ]

        for a_data in sample_addresses:
            existing = db.query(Address).filter(Address.id == a_data["id"]).first()
            if not existing:
                addr = Address(**a_data)
                db.add(addr)

        db.commit()

        # 3. Seed Categories
        categories_data = [
            {"id": "cat-biryani", "name": "Biryani", "icon": "🍱", "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300"},
            {"id": "cat-pizza", "name": "Pizza", "icon": "🍕", "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300"},
            {"id": "cat-burgers", "name": "Burgers", "icon": "🍔", "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300"},
            {"id": "cat-chicken", "name": "Chicken", "icon": "🍗", "image": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300"},
            {"id": "cat-indian", "name": "Indian", "icon": "🍛", "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300"},
            {"id": "cat-chinese", "name": "Chinese", "icon": "🍜", "image": "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300"},
            {"id": "cat-rolls", "name": "Rolls", "icon": "🌯", "image": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300"},
            {"id": "cat-pasta", "name": "Pasta", "icon": "🍝", "image": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300"},
            {"id": "cat-healthy", "name": "Healthy", "icon": "🥗", "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300"},
            {"id": "cat-desserts", "name": "Desserts", "icon": "🍰", "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300"},
            {"id": "cat-cafe", "name": "Cafe", "icon": "☕", "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300"},
            {"id": "cat-beverages", "name": "Beverages", "icon": "🥤", "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300"},
        ]

        for c_data in categories_data:
            existing = db.query(Category).filter(Category.id == c_data["id"]).first()
            if not existing:
                cat = Category(
                    id=c_data["id"],
                    name=c_data["name"],
                    icon=c_data["icon"],
                    image=c_data["image"],
                    is_active=True,
                )
                db.add(cat)

        db.commit()

        # 4. Seed Restaurants
        restaurants_data = [
            {
                "id": "rest-1",
                "name": "Spice Garden Royal",
                "tagline": "Authentic Nawabi Biryani & North Indian Grills",
                "rating": 4.6,
                "rating_count": "2.4K+",
                "cuisines": ["Biryani", "Indian", "North Indian", "Mughlai"],
                "price_for_two": 350,
                "delivery_time": "25-30 min",
                "delivery_time_minutes": 28,
                "distance": "2.4 km",
                "distance_km": 2.4,
                "pure_veg": False,
                "offer": "30% OFF up to ₹75",
                "featured": True,
                "is_open": True,
                "opening_hours": "11:00 AM - 11:30 PM",
                "address": "Near Grand Mall, Main High Road, Dantan, West Bengal",
                "latitude": 21.9542,
                "longitude": 87.2721,
                "cover_image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000",
                "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200",
                "categories": ["Recommended", "Bestsellers", "Biryani", "Starters", "Main Course", "Breads", "Beverages"],
            },
            {
                "id": "rest-2",
                "name": "Burger Craft & Co.",
                "tagline": "Artisanal Smash Burgers & Crispy Loaded Fries",
                "rating": 4.5,
                "rating_count": "1.8K+",
                "cuisines": ["Burgers", "Fast Food", "Beverages", "American"],
                "price_for_two": 280,
                "delivery_time": "20-25 min",
                "delivery_time_minutes": 22,
                "distance": "1.8 km",
                "distance_km": 1.8,
                "pure_veg": False,
                "offer": "FLAT ₹100 OFF on ₹299",
                "featured": True,
                "is_open": True,
                "opening_hours": "10:30 AM - 12:00 AM",
                "address": "Food Street Plaza, Sector 4, Dantan",
                "latitude": 21.9610,
                "longitude": 87.2680,
                "cover_image": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000",
                "logo": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200",
                "categories": ["Recommended", "Bestsellers", "Burgers", "Starters", "Sides", "Beverages"],
            },
            {
                "id": "rest-3",
                "name": "Green Leaf Pure Veg",
                "tagline": "100% Satvik, Pure Vegetarian Feasts & South Indian",
                "rating": 4.7,
                "rating_count": "3.1K+",
                "cuisines": ["Indian", "Healthy", "South Indian", "Chinese"],
                "price_for_two": 250,
                "delivery_time": "25-35 min",
                "delivery_time_minutes": 30,
                "distance": "3.1 km",
                "distance_km": 3.1,
                "pure_veg": True,
                "offer": "20% OFF on ₹200+",
                "featured": True,
                "is_open": True,
                "opening_hours": "08:00 AM - 10:30 PM",
                "address": "Station Bypass Road, Dantan Bazar",
                "latitude": 21.9480,
                "longitude": 87.2790,
                "cover_image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000",
                "logo": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200",
                "categories": ["Recommended", "Bestsellers", "South Indian", "Main Course", "Rice", "Desserts"],
            },
            {
                "id": "rest-4",
                "name": "Wok & Roll Asian Street",
                "tagline": "Dimsums, Hakka Noodles & Sizzling Manchurian",
                "rating": 4.4,
                "rating_count": "1.2K+",
                "cuisines": ["Chinese", "Rolls", "Asian", "Noodles"],
                "price_for_two": 320,
                "delivery_time": "30-35 min",
                "delivery_time_minutes": 32,
                "distance": "2.9 km",
                "distance_km": 2.9,
                "pure_veg": False,
                "offer": "FREE Delivery on ₹249",
                "featured": False,
                "is_open": True,
                "opening_hours": "12:00 PM - 11:00 PM",
                "address": "Commercial Hub, Dantan North",
                "latitude": 21.9590,
                "longitude": 87.2750,
                "cover_image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1000",
                "logo": "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=200",
                "categories": ["Recommended", "Bestsellers", "Starters", "Chinese", "Rolls", "Beverages"],
            },
            {
                "id": "rest-5",
                "name": "La Pizzeria Woodfired",
                "tagline": "Neapolitan Sourdough Crust & Creamy Pastas",
                "rating": 4.8,
                "rating_count": "4.5K+",
                "cuisines": ["Pizza", "Pasta", "Italian", "Desserts"],
                "price_for_two": 450,
                "delivery_time": "25-30 min",
                "delivery_time_minutes": 26,
                "distance": "2.1 km",
                "distance_km": 2.1,
                "pure_veg": False,
                "offer": "Buy 1 Get 1 on Medium Pizzas",
                "featured": True,
                "is_open": True,
                "opening_hours": "11:30 AM - 11:00 PM",
                "address": "Italian Boulevard, Near Clock Tower",
                "latitude": 21.9560,
                "longitude": 87.2700,
                "cover_image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000",
                "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200",
                "categories": ["Recommended", "Bestsellers", "Pizza", "Pasta", "Beverages", "Desserts"],
            },
        ]

        for r_data in restaurants_data:
            existing = db.query(Restaurant).filter(Restaurant.id == r_data["id"]).first()
            if not existing:
                rest = Restaurant(**r_data)
                db.add(rest)
                print(f"  + Restaurant created: {rest.name}")

        db.commit()

        # 5. Seed Food Items
        food_items_data = [
            {
                "id": "food-101",
                "restaurant_id": "rest-1",
                "name": "Chicken Dum Biryani",
                "category": "Biryani",
                "description": "Slow-cooked fragrant basmati rice layered with marinated tender chicken pieces, saffron, and aromatic spices.",
                "price": 249.0,
                "rating": 4.8,
                "rating_count": 1420,
                "is_veg": False,
                "is_bestseller": True,
                "is_recommended": True,
                "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
                "customizations": {
                    "sizes": [
                        {"name": "Regular (Serves 1)", "price": 0},
                        {"name": "Large (Serves 2)", "price": 140}
                    ],
                    "extras": [
                        {"name": "Extra Boiled Egg", "price": 20},
                        {"name": "Extra Chicken Piece", "price": 70},
                        {"name": "Salad & Raita Combo", "price": 30}
                    ]
                },
                "is_available": True,
            },
            {
                "id": "food-102",
                "restaurant_id": "rest-1",
                "name": "Mutton Kacchi Biryani",
                "category": "Biryani",
                "description": "Succulent chunks of bone-in prime mutton cooked dum style with long grain aged basmati rice and saffron.",
                "price": 349.0,
                "rating": 4.9,
                "rating_count": 980,
                "is_veg": False,
                "is_bestseller": True,
                "is_recommended": True,
                "image": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600",
                "customizations": {
                    "sizes": [
                        {"name": "Regular", "price": 0},
                        {"name": "Royal Handi (Serves 2)", "price": 160}
                    ],
                    "extras": [
                        {"name": "Extra Mutton Boti (2 pcs)", "price": 110},
                        {"name": "Boiled Egg", "price": 20}
                    ]
                },
                "is_available": True,
            },
            {
                "id": "food-103",
                "restaurant_id": "rest-1",
                "name": "Butter Chicken Masala",
                "category": "Main Course",
                "description": "Char-grilled tandoori chicken cooked in a rich, buttery tomato cream gravy with dried fenugreek.",
                "price": 279.0,
                "rating": 4.6,
                "rating_count": 650,
                "is_veg": False,
                "is_bestseller": False,
                "is_recommended": True,
                "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600",
                "customizations": {
                    "sizes": [
                        {"name": "Half (4 pcs)", "price": 0},
                        {"name": "Full (8 pcs)", "price": 140}
                    ],
                    "extras": [
                        {"name": "Extra Butter Cubes", "price": 25},
                        {"name": "Cream Garnish", "price": 20}
                    ]
                },
                "is_available": True,
            },
            {
                "id": "food-201",
                "restaurant_id": "rest-2",
                "name": "The Boss Chicken Smash Burger",
                "category": "Burgers",
                "description": "Double crunchy spiced chicken patties, melted aged cheddar, caramelized onions, and secret sauce on brioche bun.",
                "price": 199.0,
                "rating": 4.8,
                "rating_count": 1850,
                "is_veg": False,
                "is_bestseller": True,
                "is_recommended": True,
                "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
                "customizations": {
                    "sizes": [
                        {"name": "Single Patty", "price": 0},
                        {"name": "Double Patty Beast", "price": 60}
                    ],
                    "extras": [
                        {"name": "Add Melted Cheese Slice", "price": 30},
                        {"name": "Truffle Mayo Dip", "price": 25}
                    ]
                },
                "is_available": True,
            },
            {
                "id": "food-501",
                "restaurant_id": "rest-5",
                "name": "Farmhouse Margherita Deluxe Pizza",
                "category": "Pizza",
                "description": "Woodfired Italian sourdough crust, San Marzano tomato sauce, fresh buffalo mozzarella, cherry tomatoes, and aromatic sweet basil.",
                "price": 329.0,
                "rating": 4.8,
                "rating_count": 1980,
                "is_veg": True,
                "is_bestseller": True,
                "is_recommended": True,
                "image": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600",
                "customizations": {
                    "sizes": [
                        {"name": "Medium (10 inch)", "price": 0},
                        {"name": "Large (12 inch)", "price": 120}
                    ],
                    "extras": [
                        {"name": "Cheese Burst Crust", "price": 75},
                        {"name": "Extra Olives & Jalapeños", "price": 30}
                    ]
                },
                "is_available": True,
            },
        ]

        for f_data in food_items_data:
            existing = db.query(FoodItem).filter(FoodItem.id == f_data["id"]).first()
            if not existing:
                food = FoodItem(**f_data)
                db.add(food)
                print(f"  + Food item created: {food.name}")

        db.commit()

        # 6. Seed Coupons
        coupons_data = [
            {
                "id": "cpn-1",
                "code": "SAVE50",
                "discount_type": "fixed",
                "discount_amount": 50.0,
                "min_order": 199.0,
                "max_discount": 50.0,
                "description": "Get ₹50 OFF on orders above ₹199",
                "badge": "Popular",
                "expiry": "Valid till 31 Oct 2026",
                "is_active": True,
            },
            {
                "id": "cpn-2",
                "code": "FOODIE100",
                "discount_type": "fixed",
                "discount_amount": 100.0,
                "min_order": 399.0,
                "max_discount": 100.0,
                "description": "Save ₹100 instantly on grand feasts above ₹399",
                "badge": "Super Saver",
                "expiry": "Valid till 15 Nov 2026",
                "is_active": True,
            },
            {
                "id": "cpn-3",
                "code": "TASTY20",
                "discount_type": "percent",
                "discount_percent": 20.0,
                "min_order": 249.0,
                "max_discount": 80.0,
                "description": "20% OFF up to ₹80 on all restaurants",
                "badge": "Festive",
                "expiry": "Valid till 30 Dec 2026",
                "is_active": True,
            },
            {
                "id": "cpn-4",
                "code": "FIRSTORDER",
                "discount_type": "percent",
                "discount_percent": 30.0,
                "min_order": 149.0,
                "max_discount": 120.0,
                "description": "Special 30% discount for your inaugural order",
                "badge": "New User",
                "expiry": "Never expires",
                "is_active": True,
            },
        ]

        for cpn_data in coupons_data:
            existing = db.query(Coupon).filter(Coupon.code == cpn_data["code"]).first()
            if not existing:
                cpn = Coupon(**cpn_data)
                db.add(cpn)
                print(f"  + Coupon created: {cpn.code}")

        db.commit()

        # 7. Seed Sample Delivered Order
        sample_order_id = "FG10254"
        existing_order = db.query(Order).filter(Order.id == sample_order_id).first()
        if not existing_order:
            order = Order(
                id=sample_order_id,
                user_id="user-customer",
                restaurant_id="rest-1",
                restaurant_name="Spice Garden Royal",
                restaurant_address="Near Grand Mall, Main High Road, Dantan, West Bengal",
                subtotal=518.0,
                delivery_fee=0.0,
                platform_fee=5.0,
                taxes=25.9,
                delivery_tip=0.0,
                discount=50.0,
                grand_total=498.9,
                delivery_option="standard",
                special_instructions="Ring doorbell once",
                delivery_name="Arpit Sinha",
                delivery_phone="+91 98765 43210",
                delivery_type="Home",
                delivery_address_line="Flat 4B, Sunrise Enclave, Station Road, Dantan, West Bengal",
                delivery_latitude=21.9540,
                delivery_longitude=87.2720,
                status="Delivered",
                estimated_delivery_time="Delivered in 24 mins",
                delivery_partner_info={
                    "name": "Rajesh Kumar",
                    "phone": "+91 98111 22334",
                    "rating": 4.9,
                    "vehicle": "Hero Splendor (WB-34-AB-1290)"
                }
            )
            db.add(order)
            db.flush()

            # Item
            order_item = OrderItem(
                id="item-sample-1",
                order_id=order.id,
                food_id="food-101",
                name="Chicken Dum Biryani",
                price=249.0,
                quantity=2,
                size="Regular (Serves 1)",
                extras=["Extra Boiled Egg"]
            )
            db.add(order_item)

            # Payment
            payment = Payment(
                id="pay-sample-1",
                order_id=order.id,
                user_id="user-customer",
                method="UPI",
                amount=498.9,
                currency="INR",
                transaction_id="TXN_UPI_98231",
                gateway="Razorpay",
                status="PAID",
            )
            db.add(payment)

            # History
            db.add(OrderStatusHistory(id="osh-1", order_id=order.id, status="Placed", changed_by="Customer"))
            db.add(OrderStatusHistory(id="osh-2", order_id=order.id, status="Confirmed", changed_by="Restaurant"))
            db.add(OrderStatusHistory(id="osh-3", order_id=order.id, status="Delivered", changed_by="Rajesh Kumar"))

            db.commit()
            print(f"  + Sample Order created: {sample_order_id}")

        print("🎉 Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during database seeding: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
