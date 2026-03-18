from pydantic import BaseModel
from typing import Optional

class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    published_year: int
    is_available: bool = True

class BookCreate(BookBase):
    pass

class BookOut(BookBase):
    id: int

    class Config:
        from_attributes = True
