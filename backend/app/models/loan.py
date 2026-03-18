from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import date

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    loan_date = Column(Date, default=date.today)
    due_date = Column(Date)
    return_date = Column(Date, nullable=True)

    book = relationship("Book")
    user = relationship("User")
