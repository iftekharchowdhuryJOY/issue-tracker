from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.authorization import require_owner
from app.core.dependencies import get_current_user
from app.core.errors import ErrorCodes
from app.core.http_exceptions import not_found
from app.db.models.user import User
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
from app.services.project_service import project_service

router = APIRouter(prefix="/issues", tags=["issues"])

@router.get("/projects/{project_id}", response_model=Page[IssueOut])
def list_issues(
    project_id: UUID,
    page: int = 1,
    page_size: int = 10,
    sort_by: str = "created_at",
    order: SortOrder = SortOrder.desc,
    status: IssueStatus | None = None,
    priority: IssuePriority | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = project_service.get(db, project_id)
    if not project:
        not_found(
            ErrorCodes.PROJECT_NOT_FOUND,
            "Project not found",
        )
    require_owner(project.owner_id, current_user.id)

    pagination = PaginationParams(page=page, page_size=page_size)

    items, total = issue_service.list_by_project(
        db=db,
        project_id=project_id,
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
def create_issue(
    project_id: UUID, 
    payload: IssueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = project_service.get(db, project_id)
    if not project:
        not_found(
            ErrorCodes.PROJECT_NOT_FOUND,
            "Project not found",
        )
    require_owner(project.owner_id, current_user.id)
    return issue_service.create(db, project_id, payload)

@router.get("/{issue_id}", response_model=IssueOut)
def get_issue(issue_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    issue = issue_service.get(db, issue_id)
    if not issue:
        not_found(
            ErrorCodes.ISSUE_NOT_FOUND,
            "Issue not found",
        )
    project = project_service.get(db, issue.project_id)
    require_owner(project.owner_id, current_user.id)
    return issue


@router.patch("/{issue_id}", response_model=IssueOut)
def update_issue(
    issue_id: UUID, 
    payload: IssueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    issue = issue_service.get(db, issue_id)
    if not issue:
        not_found(
            ErrorCodes.ISSUE_NOT_FOUND,
            "Issue not found",
        )
    project = project_service.get(db, issue.project_id)
    require_owner(project.owner_id, current_user.id)
    return issue_service.update(db, issue_id, payload)


@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_issue(issue_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    issue = issue_service.get(db, issue_id)
    if not issue:
        not_found(
            ErrorCodes.ISSUE_NOT_FOUND,
            "Issue not found",
        )
    project = project_service.get(db, issue.project_id)
    require_owner(project.owner_id, current_user.id)
    issue_service.delete(db, issue_id)

