from unittest.mock import MagicMock, AsyncMock
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import event, select
from sqlalchemy.engine import Engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

import app.core.redis

# Mock Redis for tests to avoid loop issues and external dependencies
app.core.redis.get_cache = AsyncMock(return_value=None)
app.core.redis.set_cache = AsyncMock()
app.core.redis.delete_cache = AsyncMock()

from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.core.security import hash_password
from app.db.models.user import User

# Use a separate test database
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test_issue_tracker.db"

engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# SQLAlchemy 2.0 Async Session Factory
TestingSessionLocal = async_sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

@pytest.fixture(scope="session", autouse=True)
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

@pytest.fixture
async def db_session():
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()

@pytest.fixture
async def client(db_session):
    async def override_get_db():
        async with TestingSessionLocal() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()

@pytest.fixture
async def auth_client(client, db_session):
    # Create a test user
    user_stmt = select(User).filter(User.email == "test@example.com")
    result = await db_session.execute(user_stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        user = User(
            email="test@example.com",
            hashed_password=hash_password("password123")
        )
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "password123"}
    )
    token = response.json()["access_token"]
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client
