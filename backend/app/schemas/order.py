from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field


class OrderItemInput(BaseModel):
    id: Optional[str] = None  # food item id
    name: str
    price: float
    quantity: int = 1
    size: Optional[str] = "Regular"
    extras: Optional[List[Union[str, Dict[str, Any]]]] = []


class PricingInput(BaseModel):
    subtotal: Optional[float] = 0.0
    deliveryFee: Optional[float] = 0.0
    platformFee: Optional[float] = 5.0
    taxes: Optional[float] = 0.0
    deliveryTip: Optional[float] = 0.0
    discount: Optional[float] = 0.0
    grandTotal: Optional[float] = 0.0


class DeliveryAddressInput(BaseModel):
    name: str
    phone: str
    type: Optional[str] = "Home"
    addressLine: str
    lat: Optional[float] = 21.9540
    lng: Optional[float] = 87.2720


class PaymentInput(BaseModel):
    method: Optional[str] = "UPI"
    status: Optional[str] = "Paid"
    transactionId: Optional[str] = None


class OrderCreateRequest(BaseModel):
    restaurantId: str
    restaurantName: str
    restaurantAddress: Optional[str] = None
    items: List[OrderItemInput]
    pricing: Optional[PricingInput] = None
    deliveryOption: Optional[str] = "standard"
    specialInstructions: Optional[str] = ""
    deliveryAddress: DeliveryAddressInput
    payment: Optional[PaymentInput] = None


class OrderStatusUpdateRequest(BaseModel):
    status: str


class OrderRatingRequest(BaseModel):
    restaurantRating: float = Field(..., ge=1, le=5)
    foodRating: float = Field(..., ge=1, le=5)
    review: Optional[str] = ""
    tags: Optional[List[str]] = []


class OrderResponse(BaseModel):
    id: str
    date: str
    restaurantId: str
    restaurantName: str
    restaurantAddress: Optional[str] = None
    status: str
    items: List[Dict[str, Any]]
    pricing: Dict[str, float]
    deliveryOption: Optional[str] = "standard"
    specialInstructions: Optional[str] = ""
    deliveryAddress: Dict[str, Any]
    payment: Dict[str, Any]
    estimatedDeliveryTime: str
    deliveryPartner: Dict[str, Any]
    trackingSteps: List[Dict[str, Any]]
    rating: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
