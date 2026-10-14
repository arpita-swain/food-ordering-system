from typing import Optional
from pydantic import BaseModel, Field


class PaymentCreateSessionRequest(BaseModel):
    amount: float = Field(..., gt=0)
    orderId: Optional[str] = None
    method: Optional[str] = "UPI"


class PaymentCreateSessionResponse(BaseModel):
    success: bool = True
    gateway: str = "Razorpay"
    keyId: str = "rzp_test_foodiego_demo"
    currency: str = "INR"
    amount: float  # In paise (amount * 100)
    transactionId: str


class PaymentVerifyRequest(BaseModel):
    transactionId: str
    signature: Optional[str] = "demo_signature"
    orderId: Optional[str] = None


class PaymentVerifyResponse(BaseModel):
    success: bool = True
    status: str = "PAID"
    transactionId: str
    timestamp: str
