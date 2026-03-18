from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "user"

class UserOut(UserBase):
    id: int
    is_active: bool
    role: str

    class Config:
        from_attributes = True
