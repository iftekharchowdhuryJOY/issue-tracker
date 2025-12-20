from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.jwt import create_access_token
from app.core.security import verify_password
from app.db.models.user import User


class AuthService:
    async def authenticate(self, db: AsyncSession, email: str, password: str):
        stmt = select(User).filter(User.email == email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        return create_access_token(subject=str(user.id))


auth_service = AuthService()
