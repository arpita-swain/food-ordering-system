from typing import Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: str = Field(..., description="User email or phone")
    password: str = Field(..., min_length=4, description="User password")


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=20)
    password: str = Field(..., min_length=4)
    role: Optional[str] = Field("Customer", description="Customer | Delivery Partner | Admin")


class AuthResponse(BaseModel):
    success: bool = True
    token: str
    user: Dict[str, Any]


class OtpSendRequest(BaseModel):
    phone: str = Field(..., min_length=7, max_length=20)


class OtpVerifyRequest(BaseModel):
    phone: str = Field(..., min_length=7, max_length=20)
    otp: str = Field(..., min_length=4, max_length=6)


class TokenPayload(BaseModel):
    sub: str  # user_id
    role: str
    email: Optional[str] = None
    exp: Optional[int] = None
