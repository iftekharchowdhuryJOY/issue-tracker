from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import asc, desc, func
from sqlalchemy.orm import Session

from app.db.models.issue import Issue
from app.db.models.project import Project
from app.schemas.issue import IssueCreate, IssuePriority, IssueStatus, IssueUpdate
from app.schemas.pagination import PaginationParams
from app.schemas.sorting import SortOrder


class IssueService:
    def list_by_project(
        self,
        db: Session,
        project_id: UUID,
        pagination: PaginationParams,
        status: IssueStatus | None = None,
        priority: IssuePriority | None = None,
        sort_by: str = "created_at",
        order: SortOrder = SortOrder.desc,
    ):
        allowed_sort_fields = {
            "created_at": Issue.created_at,
            "priority": Issue.priority,
            "status": Issue.status,
        }

        sort_column = allowed_sort_fields.get(sort_by, Issue.created_at)
        order_by = asc(sort_column) if order == SortOrder.asc else desc(sort_column)

        query = db.query(Issue).filter(Issue.project_id == project_id)

        if status:
            query = query.filter(Issue.status == status.value)

        if priority:
            query = query.filter(Issue.priority == priority.value)

        total = query.with_entities(func.count(Issue.id)).scalar() or 0

        items = (
            query.order_by(order_by)
            .offset(pagination.offset)
            .limit(pagination.page_size)
            .all()
        )

        return items, total



    def get(self, db: Session, issue_id: UUID):
        return db.get(Issue, issue_id)

    def create(self, db: Session, project_id: UUID, data: IssueCreate):
        project = db.get(Project, project_id)
        if not project:
            return None

        issue = Issue(
            title=data.title,
            description=data.description,
            status=data.status.value,
            priority=data.priority.value,
        )

        project.issues.append(issue)

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

        issue.updated_at = datetime.now(UTC)
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
