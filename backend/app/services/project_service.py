from uuid import UUID
from sqlalchemy.orm import Session

from app.db.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate

class ProjectService:
    def list(self, db: Session):
        return db.query(Project).all()

    def get(self, db: Session, project_id: UUID):
        return db.get(Project, project_id)

    def create(self, db: Session, data: ProjectCreate):
        project = Project(
            name=data.name,
            description=data.description,
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
