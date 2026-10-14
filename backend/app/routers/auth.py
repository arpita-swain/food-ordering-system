from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    OtpSendRequest,
    OtpVerifyRequest,
)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new customer, delivery partner, or administrator."""
    return AuthService.register(db, req)


@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate with email/phone & password to obtain JWT access token."""
    return AuthService.login(db, req)


@router.post("/otp/send")
def send_otp(req: OtpSendRequest):
    """Send one-time password to mobile phone number."""
    return AuthService.send_otp(req.phone)


@router.post("/otp/verify")
def verify_otp(req: OtpVerifyRequest):
    """Verify phone OTP."""
    return AuthService.verify_otp(req.phone, req.otp)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Fetch the currently authenticated user's profile details."""
    return current_user.to_dict()
