import sys
import os

# Ensure app module can be found when running this script as a standalone file
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.book import Book
from app.core.security import get_password_hash

# Initialize Database securely
Base.metadata.create_all(bind=engine)

def seed_database():
    db: Session = SessionLocal()
    try:
        # Check if users already exist
        if db.query(User).count() == 0:
            print("Seeding Users...")
            admin_user = User(
                email="admin@library.com",
                hashed_password=get_password_hash("admin123"),
                role="admin"
            )
            standard_user = User(
                email="user@library.com",
                hashed_password=get_password_hash("user123"),
                role="user"
            )
            db.add_all([admin_user, standard_user])
            db.commit()

        # Check if books exist
        if db.query(Book).count() == 0:
            print("Seeding Books...")
            books = [
                Book(title="The Hobbit", author="J.R.R. Tolkien", isbn="978-0547928227", published_year=1937),
                Book(title="1984", author="George Orwell", isbn="978-0451524935", published_year=1949),
                Book(title="Dune", author="Frank Herbert", isbn="978-0441172719", published_year=1965),
                Book(title="Foundation", author="Isaac Asimov", isbn="978-0553293357", published_year=1951),
                Book(title="Brave New World", author="Aldous Huxley", isbn="978-0060850524", published_year=1932),
                Book(title="Fahrenheit 451", author="Ray Bradbury", isbn="978-1451673319", published_year=1953)
            ]
            db.add_all(books)
            db.commit()

        print("✅ Database seeding completed successfully. You can now log in.")
    except Exception as e:
        print(f"❌ Error during seeding: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
