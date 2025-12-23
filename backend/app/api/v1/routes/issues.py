from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_issue_for_user, get_project_for_user
from app.db.models.issue import Issue
from app.db.models.project import Project
from app.db.session import get_db
from app.schemas.issue import (
    IssueCreate,
    IssueOut,
    IssuePriority,
    IssueStatus,
    IssueUpdate,
)
from app.schemas.page import Page
from app.schemas.pagination import PaginationParams
from app.schemas.sorting import SortOrder
from app.services.issue_service import issue_service

from app.core.dependencies import get_current_user, get_issue_for_user, get_project_for_user
from app.db.models.user import User

router = APIRouter(prefix="/issues", tags=["issues"])


@router.get("/", response_model=Page[IssueOut])
async def list_all_issues(
    page: int = 1,
    page_size: int = 10,
    sort_by: str = "created_at",
    order: SortOrder = SortOrder.desc,
    status: IssueStatus | None = None,
    priority: IssuePriority | None = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    pagination = PaginationParams(page=page, page_size=page_size)

    items, total = await issue_service.list_all(
        db=db,
        user_id=user.id,
        pagination=pagination,
        status=status,
        priority=priority,
        sort_by=sort_by,
        order=order,
    )

    return {"items": items, "page": page, "page_size": page_size, "total": total}


@router.get("/projects/{project_id}", response_model=Page[IssueOut])
async def list_issues(
    page: int = 1,
    page_size: int = 10,
    sort_by: str = "created_at",
    order: SortOrder = SortOrder.desc,
    status: IssueStatus | None = None,
    priority: IssuePriority | None = None,
    db: AsyncSession = Depends(get_db),
    project: Project = Depends(get_project_for_user),
):
    pagination = PaginationParams(page=page, page_size=page_size)

    items, total = await issue_service.list_by_project(
        db=db,
        project_id=project.id,
        pagination=pagination,
        status=status,
        priority=priority,
        sort_by=sort_by,
        order=order,
    )

    return {"items": items, "page": page, "page_size": page_size, "total": total}


@router.post(
    "/projects/{project_id}",
    response_model=IssueOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_issue(
    payload: IssueCreate,
    db: AsyncSession = Depends(get_db),
    project: Project = Depends(get_project_for_user),
):
    return await issue_service.create(db, project.id, payload)


@router.get("/{issue_id}", response_model=IssueOut)
async def get_issue(issue: Issue = Depends(get_issue_for_user)):
    return issue


@router.patch("/{issue_id}", response_model=IssueOut)
async def update_issue(
    payload: IssueUpdate,
    db: AsyncSession = Depends(get_db),
    issue: Issue = Depends(get_issue_for_user),
):
    return await issue_service.update(db, issue.id, payload)


@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_issue(
    db: AsyncSession = Depends(get_db),
    issue: Issue = Depends(get_issue_for_user),
):
    await issue_service.delete(db, issue.id)
