from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Dict

from app.schemas.project import ProjectCreate, ProjectUpdate
from app.schemas.issue import IssueCreate, IssueUpdate



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
            "created_at": datetime.now(timezone.utc),
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


class IssueStorage:
    def __init__(self):
        self._issues: dict[UUID, dict] = {}

    def list_by_project(self, project_id: UUID, status=None, priority=None):
        issues = [
            i for i in self._issues.values()
            if i["project_id"] == project_id
        ]

        if status:
            issues = [i for i in issues if i["status"] == status]

        if priority:
            issues = [i for i in issues if i["priority"] == priority]

        return issues

    def get(self, issue_id: UUID):
        return self._issues.get(issue_id)

    def create(self, project_id: UUID, data: IssueCreate):
        issue_id = uuid4()
        now = datetime.now(timezone.utc)

        issue = {
            "id": issue_id,
            "project_id": project_id,
            **data.model_dump(),
            "created_at": now,
            "updated_at": None,
        }

        self._issues[issue_id] = issue
        return issue

    def update(self, issue_id: UUID, data: IssueUpdate):
        issue = self._issues.get(issue_id)
        if not issue:
            return None

        issue.update(data.model_dump(exclude_unset=True))
        issue["updated_at"] = datetime.now(timezone.utc)
        return issue

    def delete(self, issue_id: UUID):
        return self._issues.pop(issue_id, None)


issue_storage = IssueStorage()



project_storage = ProjectStorage()
