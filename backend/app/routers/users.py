from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.address import AddressCreate, AddressResponse
from app.models.user import User
from app.models.address import Address
from app.core.dependencies import get_current_user, require_admin
from app.core.security import get_password_hash
from app.utils.helpers import generate_id

router = APIRouter(prefix="/users", tags=["Users & Addresses"])


@router.get("", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """Admin: Fetch all registered users."""
    users = db.query(User).all()
    return [u.to_dict() for u in users]


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    updates: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user profile. Users can update their own profile; admins can update any user."""
    is_admin = current_user.role.lower().replace(" ", "_") == "admin"
    if current_user.id != user_id and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    data = updates.model_dump(exclude_unset=True)
    if "password" in data and data["password"]:
        user.password_hash = get_password_hash(data["password"])
        del data["password"]

    for key, value in data.items():
        if hasattr(user, key):
            setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user.to_dict()


# Addresses Endpoints
@router.get("/addresses", response_model=List[AddressResponse])
def get_addresses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve saved delivery addresses for the logged-in user."""
    addresses = db.query(Address).filter(Address.user_id == current_user.id).all()
    return [a.to_dict() for a in addresses]


@router.post("/addresses", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
def add_address(
    data: AddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a new delivery address for the logged-in user."""
    existing_count = db.query(Address).filter(Address.user_id == current_user.id).count()
    is_default = data.isDefault if data.isDefault is not None else (existing_count == 0)

    if is_default:
        # Reset existing defaults
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})

    addr_id = generate_id("addr")
    new_addr = Address(
        id=addr_id,
        user_id=current_user.id,
        type=data.type or "Home",
        name=data.name,
        phone=data.phone,
        house=data.house,
        street=data.street,
        landmark=data.landmark,
        city=data.city or "Dantan",
        state=data.state or "West Bengal",
        pincode=data.pincode or "721426",
        address_line=data.addressLine,
        latitude=data.lat or 21.9540,
        longitude=data.lng or 87.2720,
        is_default=is_default,
    )
    db.add(new_addr)
    db.commit()
    db.refresh(new_addr)
    return new_addr.to_dict()


@router.delete("/addresses/{address_id}")
def delete_address(
    address_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a delivery address belonging to the user."""
    addr = db.query(Address).filter(
        Address.id == address_id,
        Address.user_id == current_user.id
    ).first()

    if not addr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )

    db.delete(addr)
    db.commit()
    return {"success": True}


@router.patch("/addresses/{address_id}/default", response_model=List[AddressResponse])
def set_default_address(
    address_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark an address as default."""
    addresses = db.query(Address).filter(Address.user_id == current_user.id).all()
    found = False
    for a in addresses:
        if a.id == address_id:
            a.is_default = True
            found = True
        else:
            a.is_default = False

    if not found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )

    db.commit()
    return [a.to_dict() for a in addresses]
