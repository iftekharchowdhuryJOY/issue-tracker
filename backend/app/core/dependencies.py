import json
from datetime import datetime
from uuid import UUID

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.authorization import require_owner
from app.core.errors import ErrorCodes
from app.core.http_exceptions import not_found, unauthorized
from app.core.jwt import decode_token
from app.core.redis import get_cache, set_cache
from app.db.models.issue import Issue
from app.db.models.project import Project
from app.db.models.user import User
from app.db.session import get_db
from app.schemas.user import UserOut
from app.services.issue_service import issue_service
from app.services.project_service import project_service

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    try:
        user_id = decode_token(token)
    except Exception:
        unauthorized("Invalid token")

    # Try to get from cache
    cache_key = f"user:{user_id}"
    cached_user = await get_cache(cache_key)
    if cached_user:
        user_data = json.loads(cached_user)
        # Convert strings back to correct types
        user_data["id"] = UUID(user_data["id"])
        if "created_at" in user_data:
            user_data["created_at"] = datetime.fromisoformat(user_data["created_at"])
        return User(**user_data)

    user = await db.get(User, UUID(user_id))
    if not user:
        unauthorized("User not found")

    # Set cache for 10 minutes
    user_out = UserOut.model_validate(user)
    await set_cache(cache_key, user_out.model_dump_json(), expire=600)

    return user


async def get_project_for_user(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Project:
    project = await project_service.get(db, project_id)
    if not project:
        not_found(
            ErrorCodes.PROJECT_NOT_FOUND,
            "Project not found",
        )
    require_owner(project.owner_id, current_user.id)
    return project


async def get_issue_for_user(
    issue_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Issue:
    issue = await issue_service.get(db, issue_id)
    if not issue:
        not_found(
            ErrorCodes.ISSUE_NOT_FOUND,
            "Issue not found",
        )
    project = await project_service.get(db, issue.project_id)
    require_owner(project.owner_id, current_user.id)
    return issue
