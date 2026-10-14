from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.payment import (
    PaymentCreateSessionRequest,
    PaymentCreateSessionResponse,
    PaymentVerifyRequest,
    PaymentVerifyResponse,
)
from app.services.payment_service import PaymentService

router = APIRouter(prefix="/payments", tags=["Payments & Gateway"])


@router.post("/create-session", response_model=PaymentCreateSessionResponse)
def create_payment_session(req: PaymentCreateSessionRequest):
    """Initialize payment checkout session (Razorpay/Stripe compatible)."""
    return PaymentService.create_session(req)


@router.post("/verify", response_model=PaymentVerifyResponse)
def verify_payment(req: PaymentVerifyRequest, db: Session = Depends(get_db)):
    """Verify cryptographic gateway signature and confirm payment."""
    return PaymentService.verify(db, req)
