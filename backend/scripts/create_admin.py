"""
Script to create or promote an administrator user account.
Usage: python scripts/create_admin.py [email] [password] [name]
"""
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.connection import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from app.utils.helpers import generate_id


def create_or_update_admin(
    email: str = "admin@foodiego.com",
    password: str = "password123",
    name: str = "FoodieGo Admin",
    phone: str = "+91 90000 00001",
):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email.lower()).first()
        if user:
            user.role = "Admin"
            user.password_hash = get_password_hash(password)
            user.status = "Active"
            print(f"✅ Existing user '{email}' successfully promoted to Admin.")
        else:
            user = User(
                id=generate_id("admin"),
                name=name,
                email=email.lower(),
                phone=phone,
                password_hash=get_password_hash(password),
                role="Admin",
                avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                status="Active",
                orders_count=0,
            )
            db.add(user)
            print(f"✅ New Admin account created for '{email}'.")

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"❌ Failed to create admin: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    email_arg = sys.argv[1] if len(sys.argv) > 1 else "admin@foodiego.com"
    pwd_arg = sys.argv[2] if len(sys.argv) > 2 else "password123"
    name_arg = sys.argv[3] if len(sys.argv) > 3 else "FoodieGo Admin"
    create_or_update_admin(email_arg, pwd_arg, name_arg)
