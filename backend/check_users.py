import asyncio
import sys
import os
from sqlalchemy import select

# Add the project root to sys.path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from app.db.session import AsyncSessionLocal
from app.db.models.user import User

async def check_users():
    async with AsyncSessionLocal() as db:
        try:
            stmt = select(User.email)
            result = await db.execute(stmt)
            emails = result.scalars().all()
            
            if not emails:
                print("No users found in database.")
                return

            for email in emails:
                print(f"User found: {email}")
        except Exception as e:
            print(f"Error checking users: {e}")

if __name__ == "__main__":
    asyncio.run(check_users())
