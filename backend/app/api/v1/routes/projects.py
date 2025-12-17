from fastapi import APIRouter, HTTPException, status
from uuid import UUID
from typing import List

from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectOut,
)
from app.services.storage import project_storage

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=List[ProjectOut])
def list_projects():
    return project_storage.list()


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate):
    return project_storage.create(payload)


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: UUID):
    project = project_storage.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(project_id: UUID, payload: ProjectUpdate):
    project = project_storage.update(project_id, payload)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: UUID):
    project = project_storage.delete(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
