from typing import Optional
from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    icon: Optional[str] = "🍽️"
    image: Optional[str] = None
    isActive: Optional[bool] = True


class CategoryCreate(CategoryBase):
    id: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: str

    class Config:
        from_attributes = True
