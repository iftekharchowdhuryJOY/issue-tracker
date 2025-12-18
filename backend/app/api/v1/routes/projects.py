from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.authorization import require_owner
from app.core.dependencies import get_current_user
from app.core.errors import ErrorCodes
from app.core.http_exceptions import not_found
from app.db.models.user import User
from app.db.session import get_db
from app.schemas.page import Page
from app.schemas.pagination import PaginationParams
from app.schemas.project import (
    ProjectCreate,
    ProjectOut,
    ProjectUpdate,
)
from app.schemas.sorting import SortOrder
from app.services.project_service import project_service

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=Page[ProjectOut])
def list_projects(
    page: int = 1,
    page_size: int = 10,
    sort_by: str = "created_at",
    order: SortOrder = SortOrder.desc,
    db: Session = Depends(get_db),
):
    pagination = PaginationParams(page=page, page_size=page_size)
    items, total = project_service.list(
        db=db,
        pagination=pagination,
        sort_by=sort_by,
        order=order,
    )
    return {"items": items, "page": page, "page_size": page_size, "total": total}


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return project_service.create(
        db=db,
        data=payload,
        owner_id=current_user.id,
    )


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = project_service.get(db, project_id)
    if not project:
        not_found(
            ErrorCodes.PROJECT_NOT_FOUND,
            "Project not found",
        )
    require_owner(project.owner_id, current_user.id)
    return project


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(project_id: UUID, payload: ProjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = project_service.get(db, project_id)
    if not project:
        not_found(
            ErrorCodes.PROJECT_NOT_FOUND,
            "Project not found",
        )
    require_owner(project.owner_id, current_user.id)
    return project_service.update(db, project_id, payload)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = project_service.get(db, project_id)
    if not project:
        not_found(
            ErrorCodes.PROJECT_NOT_FOUND,
            "Project not found",
        )
    require_owner(project.owner_id, current_user.id)
    project_service.delete(db, project_id)