from uuid import UUID, uuid4
from datetime import datetime
from typing import Dict

from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectStorage:
    def __init__(self):
        self._projects: Dict[UUID, dict] = {}

    def list(self):
        return list(self._projects.values())

    def get(self, project_id: UUID):
        return self._projects.get(project_id)

    def create(self, data: ProjectCreate):
        project_id = uuid4()
        project = {
            "id": project_id,
            "name": data.name,
            "description": data.description,
            "created_at": datetime.utcnow(),
        }
        self._projects[project_id] = project
        return project

    def update(self, project_id: UUID, data: ProjectUpdate):
        project = self._projects.get(project_id)
        if not project:
            return None

        update_data = data.model_dump(exclude_unset=True)
        project.update(update_data)
        return project

    def delete(self, project_id: UUID):
        return self._projects.pop(project_id, None)


project_storage = ProjectStorage()
