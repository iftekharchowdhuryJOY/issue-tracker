from uuid import UUID

from sqlalchemy import asc, desc, func
from sqlalchemy.orm import Session

from app.db.models.project import Project
from app.schemas.pagination import PaginationParams
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.schemas.sorting import SortOrder


class ProjectService:
    def list(
        self,
        db: Session,
        pagination: PaginationParams,
        sort_by: str = "created_at",
        order: SortOrder = SortOrder.desc,
        owner_id: UUID | None = None,
    ):
        allowed_sort_fields = {
            "created_at": Project.created_at,
            "name": Project.name,
        }

        sort_column = allowed_sort_fields.get(sort_by, Project.created_at)
        order_by = asc(sort_column) if order == SortOrder.asc else desc(sort_column)

        base_query = db.query(Project)
        if owner_id:
            base_query = base_query.filter(Project.owner_id == owner_id)
        
        total = db.query(func.count(Project.id))
        if owner_id:
            total = total.filter(Project.owner_id == owner_id)
        total = total.scalar() or 0

        items = (
            base_query
            .order_by(order_by)
            .offset(pagination.offset)
            .limit(pagination.page_size)
            .all()
        )

        return items, total 


    def get(self, db: Session, project_id: UUID):
        return db.get(Project, project_id)

    def create(self, db: Session, data: ProjectCreate, owner_id: UUID):
        project = Project(
            name=data.name,
            description=data.description,
            owner_id=owner_id,
        )
        db.add(project)
        db.commit()
        db.refresh(project)
        return project

    def update(self, db: Session, project_id: UUID, data: ProjectUpdate):
        project = db.get(Project, project_id)
        if not project:
            return None

        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(project, field, value)

        db.commit()
        db.refresh(project)
        return project

    def delete(self, db: Session, project_id: UUID):
        project = db.get(Project, project_id)
        if not project:
            return None

        db.delete(project)
        db.commit()
        return project


project_service = ProjectService()
