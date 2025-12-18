import sys
import os
from sqlalchemy.orm import Session

# Add the project root to sys.path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from app.db.session import SessionLocal
from app.db.models.user import User
from app.core.security import hash_password

def create_user(email, password):
    db = SessionLocal()
    try:
        # Check if user already exists
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User {email} already exists.")
            return

        new_user = User(
            email=email,
            hashed_password=hash_password(password)
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"User {email} created successfully.")
    except Exception as e:
        print(f"Error creating user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 create_user.py <email> <password>")
    else:
        create_user(sys.argv[1], sys.argv[2])
