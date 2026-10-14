from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    role: Optional[str] = "Customer"
    avatar: Optional[str] = None
    status: Optional[str] = "Active"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    avatar: Optional[str] = None
    status: Optional[str] = None
    password: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    role: str
    avatar: Optional[str] = None
    ordersCount: int = 0
    status: str = "Active"
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True
