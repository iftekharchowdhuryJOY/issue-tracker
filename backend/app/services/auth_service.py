from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.jwt import create_access_token
from app.core.security import verify_password, hash_password
from app.core.http_exceptions import bad_request
from app.core.errors import ErrorCodes

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

    async def register(self, db: AsyncSession, email: str, password: str):
        stmt = select(User).filter(User.email == email)
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            bad_request(
                code=ErrorCodes.VALIDATION_ERROR,
                message="Email already registered"
            )

        user = User(
            email=email,
            hashed_password=hash_password(password)
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return create_access_token(subject=str(user.id))


auth_service = AuthService()
