import time
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.payment import Payment
from app.models.order import Order
from app.schemas.payment import (
    PaymentCreateSessionRequest,
    PaymentCreateSessionResponse,
    PaymentVerifyRequest,
    PaymentVerifyResponse,
)


class PaymentService:
    @staticmethod
    def create_session(req: PaymentCreateSessionRequest) -> Dict[str, Any]:
        txn_id = f"TXN_{req.method or 'UPI'}_{int(time.time() * 1000)}"
        return {
            "success": True,
            "gateway": "Razorpay",
            "keyId": "rzp_test_foodiego_demo",
            "currency": "INR",
            "amount": round(req.amount * 100, 2),  # in paise
            "transactionId": txn_id,
        }

    @staticmethod
    def verify(db: Session, req: PaymentVerifyRequest) -> Dict[str, Any]:
        # Update payment record if matching transaction exists
        payment = db.query(Payment).filter(Payment.transaction_id == req.transactionId).first()
        if payment:
            payment.status = "PAID"
            payment.signature = req.signature or "verified_demo_signature"
            db.commit()

        return {
            "success": True,
            "status": "PAID",
            "transactionId": req.transactionId,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
