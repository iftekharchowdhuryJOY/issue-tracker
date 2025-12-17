from fastapi import APIRouter, HTTPException, status
from uuid import UUID
from typing import List

from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectOut,
)

from sqlalchemy.orm import Session
from fastapi import Depends

from app.db.session import get_db
from app.services.project_service import project_service


router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=List[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    return project_service.list(db)


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    return project_service.create(db, payload)


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: UUID, db: Session = Depends(get_db)):
    project = project_service.get(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(project_id: UUID, payload: ProjectUpdate, db: Session = Depends(get_db)):
    project = project_service.update(db, project_id, payload)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: UUID, db: Session = Depends(get_db)):
    project = project_service.delete(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
