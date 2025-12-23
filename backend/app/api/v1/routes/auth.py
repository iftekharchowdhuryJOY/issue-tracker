from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import auth_service
from app.core.http_exceptions import unauthorized

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    token = await auth_service.authenticate(
        db,
        payload.email,
        payload.password,
    )
    if not token:
        unauthorized("Invalid credentials")

    return {"access_token": token}


@router.post("/signup", response_model=TokenResponse)
async def signup(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    token = await auth_service.register(
        db,
        payload.email,
        payload.password,
    )
    return {"access_token": token}
