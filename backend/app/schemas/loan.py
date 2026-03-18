from pydantic import BaseModel
from datetime import date
from typing import Optional

class LoanBase(BaseModel):
    book_id: int
    due_date: date

class LoanCreate(LoanBase):
    pass

class LoanOut(LoanBase):
    id: int
    user_id: int
    loan_date: date
    return_date: Optional[date] = None

    class Config:
        from_attributes = True
