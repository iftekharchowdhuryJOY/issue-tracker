import asyncio
import sys
import os
from sqlalchemy import select

# Add the project root to sys.path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from app.db.session import AsyncSessionLocal
from app.db.models.user import User
from app.core.security import hash_password

async def create_user(email, password):
    async with AsyncSessionLocal() as db:
        try:
            # Check if user already exists
            stmt = select(User).filter(User.email == email)
            result = await db.execute(stmt)
            user = result.scalar_one_or_none()
            
            if user:
                print(f"User {email} already exists.")
                return

            new_user = User(
                email=email,
                hashed_password=hash_password(password)
            )
            db.add(new_user)
            await db.commit()
            await db.refresh(new_user)
            print(f"User {email} created successfully.")
        except Exception as e:
            print(f"Error creating user: {e}")
            await db.rollback()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 create_user.py <email> <password>")
    else:
        asyncio.run(create_user(sys.argv[1], sys.argv[2]))
