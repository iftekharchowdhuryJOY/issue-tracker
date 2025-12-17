from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session

from app.db.models.issue import Issue
from app.schemas.issue import IssueCreate, IssueUpdate, IssueStatus, IssuePriority



class IssueService:
    def list_by_project(
        self,
        db: Session,
        project_id: UUID,
        status: IssueStatus | None = None,
        priority: IssuePriority | None = None,
    ):
        query = db.query(Issue).filter(Issue.project_id == project_id)

        if status:
            query = query.filter(Issue.status == status.value)

        if priority:
            query = query.filter(Issue.priority == priority.value)

        return query.all()

    def get(self, db: Session, issue_id: UUID):
        return db.get(Issue, issue_id)

    def create(self, db: Session, project_id: UUID, data: IssueCreate):
        issue = Issue(
            project_id=project_id,
            title=data.title,
            description=data.description,
            status=data.status.value,
            priority=data.priority.value,
            created_at=datetime.utcnow(),
        )
        db.add(issue)
        db.commit()
        db.refresh(issue)
        return issue

    def update(self, db: Session, issue_id: UUID, data: IssueUpdate):
        issue = db.get(Issue, issue_id)
        if not issue:
            return None

        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            if field in {"status", "priority"}:
                value = value.value
            setattr(issue, field, value)

        issue.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(issue)
        return issue

    def delete(self, db: Session, issue_id: UUID):
        issue = db.get(Issue, issue_id)
        if not issue:
            return None

        db.delete(issue)
        db.commit()
        return issue


issue_service = IssueService()
