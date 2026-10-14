from typing import Dict, Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import verify_password, get_password_hash, create_access_token
from app.schemas.auth import RegisterRequest, LoginRequest
from app.utils.helpers import generate_id


class AuthService:
    @staticmethod
    def register(db: Session, req: RegisterRequest) -> Dict[str, Any]:
        # Check email uniqueness
        existing_email = db.query(User).filter(User.email.ilike(req.email)).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists"
            )

        # Check phone uniqueness
        existing_phone = db.query(User).filter(User.phone == req.phone).first()
        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this phone number already exists"
            )

        user_id = generate_id("user")
        hashed_pw = get_password_hash(req.password)

        new_user = User(
            id=user_id,
            name=req.name,
            email=req.email.lower(),
            phone=req.phone,
            password_hash=hashed_pw,
            role=req.role or "Customer",
            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            status="Active",
            orders_count=0,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token = create_access_token(data={"sub": new_user.id, "role": new_user.role, "email": new_user.email})

        return {
            "success": True,
            "token": token,
            "user": new_user.to_dict(),
        }

    @staticmethod
    def login(db: Session, req: LoginRequest) -> Dict[str, Any]:
        identifier = req.email.strip().lower()
        # Find by email or phone
        user = db.query(User).filter(
            (User.email.ilike(identifier)) | (User.phone == identifier)
        ).first()

        if not user or not verify_password(req.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email/phone or password"
            )

        if user.status != "Active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account is currently disabled or suspended"
            )

        token = create_access_token(data={"sub": user.id, "role": user.role, "email": user.email})

        return {
            "success": True,
            "token": token,
            "user": user.to_dict(),
        }

    @staticmethod
    def send_otp(phone: str) -> Dict[str, Any]:
        return {
            "success": True,
            "message": f"OTP successfully sent to {phone}. (Use demo OTP: 1234)"
        }

    @staticmethod
    def verify_otp(phone: str, otp: str) -> Dict[str, Any]:
        # Demo OTP verification standard
        if otp in ["1234", "0000"] or len(otp) == 4:
            return {
                "success": True,
                "message": "Phone number verified successfully"
            }
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP code. Please use 1234 for demo login."
        )
