from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.authorization import require_owner
from app.core.errors import ErrorCodes
from app.core.http_exceptions import not_found
from app.core.jwt import decode_token
from app.db.models.issue import Issue
from app.db.models.project import Project
from app.db.models.user import User
from app.db.session import get_db
from app.services.issue_service import issue_service
from app.services.project_service import project_service

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    try:
        user_id = decode_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user = await db.get(User, UUID(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

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
