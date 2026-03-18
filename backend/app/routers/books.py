from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.book import Book as BookModel
from app.schemas.book import BookCreate, BookOut
from app.dependencies import get_current_librarian_or_admin
from app.models.user import User as UserModel

router = APIRouter(
    prefix="/api/books",
    tags=["books"],
)

@router.post("/", response_model=BookOut)
def create_book(
    book: BookCreate, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_librarian_or_admin)
):
    db_book = db.query(BookModel).filter(BookModel.isbn == book.isbn).first()
    if db_book:
        raise HTTPException(status_code=400, detail="Book with this ISBN already exists")
    
    new_book = BookModel(**book.model_dump())
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

@router.get("/", response_model=list[BookOut])
def read_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    books = db.query(BookModel).offset(skip).limit(limit).all()
    return books

@router.get("/{book_id}", response_model=BookOut)
def read_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(BookModel).filter(BookModel.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book
