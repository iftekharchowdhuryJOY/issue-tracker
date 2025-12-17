from fastapi import APIRouter, HTTPException, status, Depends
from uuid import UUID
from typing import List
from sqlalchemy.orm import Session

from app.schemas.issue import (
    IssueCreate,
    IssueUpdate,
    IssueOut,
    IssueStatus,
    IssuePriority,
)
from app.db.session import get_db
from app.services.issue_service import issue_service
from app.services.project_service import project_service

router = APIRouter(prefix="/issues", tags=["issues"])

@router.get(
    "/projects/{project_id}",
    response_model=List[IssueOut],
)
def list_issues(
    project_id: UUID,
    status: IssueStatus | None = None,
    priority: IssuePriority | None = None,
    db: Session = Depends(get_db),
):
    if not project_service.get(db, project_id):
        raise HTTPException(404, "Project not found")

    return issue_service.list_by_project(db, project_id, status, priority)

@router.post(
    "/projects/{project_id}",
    response_model=IssueOut,
    status_code=status.HTTP_201_CREATED,
)
def create_issue(
    project_id: UUID, 
    payload: IssueCreate,
    db: Session = Depends(get_db),
):
    if not project_service.get(db, project_id):
        raise HTTPException(404, "Project not found")

    return issue_service.create(db, project_id, payload)

@router.get("/{issue_id}", response_model=IssueOut)
def get_issue(issue_id: UUID, db: Session = Depends(get_db)):
    issue = issue_service.get(db, issue_id)
    if not issue:
        raise HTTPException(404, "Issue not found")
    return issue


@router.patch("/{issue_id}", response_model=IssueOut)
def update_issue(
    issue_id: UUID, 
    payload: IssueUpdate,
    db: Session = Depends(get_db),
):
    issue = issue_service.update(db, issue_id, payload)
    if not issue:
        raise HTTPException(404, "Issue not found")
    return issue


@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_issue(issue_id: UUID, db: Session = Depends(get_db)):
    issue = issue_service.delete(db, issue_id)
    if not issue:
        raise HTTPException(404, "Issue not found")

