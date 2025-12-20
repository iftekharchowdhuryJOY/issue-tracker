from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_project_for_user
from app.db.models.project import Project
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
async def list_projects(
    page: int = 1,
    page_size: int = 10,
    sort_by: str = "created_at",
    order: SortOrder = SortOrder.desc,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pagination = PaginationParams(page=page, page_size=page_size)
    items, total = await project_service.list(
        db=db,
        pagination=pagination,
        sort_by=sort_by,
        order=order,
        owner_id=current_user.id,
    )
    return {"items": items, "page": page, "page_size": page_size, "total": total}


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await project_service.create(
        db=db,
        data=payload,
        owner_id=current_user.id,
    )


@router.get("/{project_id}", response_model=ProjectOut)
async def get_project(project: Project = Depends(get_project_for_user)):
    return project


@router.patch("/{project_id}", response_model=ProjectOut)
async def update_project(
    payload: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    project: Project = Depends(get_project_for_user),
):
    return await project_service.update(db, project.id, payload)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    db: AsyncSession = Depends(get_db),
    project: Project = Depends(get_project_for_user),
):
    await project_service.delete(db, project.id)