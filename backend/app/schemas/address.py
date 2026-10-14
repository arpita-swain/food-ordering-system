from typing import Optional
from pydantic import BaseModel


class AddressBase(BaseModel):
    type: str = "Home"
    name: str
    phone: str
    house: Optional[str] = None
    street: Optional[str] = None
    landmark: Optional[str] = None
    city: Optional[str] = "Dantan"
    state: Optional[str] = "West Bengal"
    pincode: Optional[str] = "721426"
    addressLine: Optional[str] = None
    lat: Optional[float] = 21.9540
    lng: Optional[float] = 87.2720
    isDefault: Optional[bool] = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    type: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    house: Optional[str] = None
    street: Optional[str] = None
    landmark: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    addressLine: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    isDefault: Optional[bool] = None


class AddressResponse(AddressBase):
    id: str
    userId: Optional[str] = None

    class Config:
        from_attributes = True
