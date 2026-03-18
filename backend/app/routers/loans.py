from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models.loan import Loan as LoanModel
from app.models.book import Book as BookModel
from app.schemas.loan import LoanCreate, LoanOut
from app.dependencies import get_current_active_user, get_current_librarian_or_admin
from app.models.user import User as UserModel

router = APIRouter(
    prefix="/api/loans",
    tags=["loans"],
)

@router.post("/", response_model=LoanOut)
def create_loan(
    loan: LoanCreate, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    # Check if book exists and is available
    book = db.query(BookModel).filter(BookModel.id == loan.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if not book.is_available:
        raise HTTPException(status_code=400, detail="Book is currently unavailable")
    
    # Create the loan using current user
    new_loan = LoanModel(
        book_id=loan.book_id,
        user_id=current_user.id,
        due_date=loan.due_date
    )
    
    # Mark book as unavailable
    book.is_available = False
    
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    return new_loan

@router.put("/{loan_id}/return", response_model=LoanOut)
def return_loan(
    loan_id: int, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    loan = db.query(LoanModel).filter(LoanModel.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if loan.return_date:
        raise HTTPException(status_code=400, detail="Book already returned")
        
    # Only owner or admin/librarian can return
    if loan.user_id != current_user.id and current_user.role not in ["admin", "librarian"]:
        raise HTTPException(status_code=403, detail="Not authorized to return this book")

    loan.return_date = date.today()

    # Mark book as available
    book = db.query(BookModel).filter(BookModel.id == loan.book_id).first()
    if book:
        book.is_available = True

    db.commit()
    db.refresh(loan)
    return loan

@router.get("/", response_model=list[LoanOut])
def read_loans(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_librarian_or_admin)
):
    # Only admins and librarians can see ALL loans
    return db.query(LoanModel).offset(skip).limit(limit).all()

@router.get("/my-loans", response_model=list[LoanOut])
def read_my_loans(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    # Users can see their own loans
    return db.query(LoanModel).filter(LoanModel.user_id == current_user.id).offset(skip).limit(limit).all()
