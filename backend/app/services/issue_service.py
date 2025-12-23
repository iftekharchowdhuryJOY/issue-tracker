import json
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import asc, desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.issue import Issue
from app.db.models.project import Project
from app.schemas.issue import IssueCreate, IssuePriority, IssueStatus, IssueUpdate, IssueOut
from app.schemas.pagination import PaginationParams
from app.schemas.sorting import SortOrder
from app.core.redis import get_cache, set_cache, delete_cache


class IssueService:
    async def list_all(
        self,
        db: AsyncSession,
        user_id: UUID,
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

        stmt = (
            select(Issue)
            .join(Project, Issue.project_id == Project.id)
            .filter(Project.owner_id == user_id)
        )

        if status:
            stmt = stmt.filter(Issue.status == status.value)

        if priority:
            stmt = stmt.filter(Issue.priority == priority.value)

        # Count query
        count_stmt = (
            select(func.count(Issue.id))
            .join(Project, Issue.project_id == Project.id)
            .filter(Project.owner_id == user_id)
        )
        if status:
            count_stmt = count_stmt.filter(Issue.status == status.value)
        if priority:
            count_stmt = count_stmt.filter(Issue.priority == priority.value)

        total_result = await db.execute(count_stmt)
        total = total_result.scalar() or 0

        # Items query
        stmt = (
            stmt.order_by(order_by)
            .offset(pagination.offset)
            .limit(pagination.page_size)
        )
        
        result = await db.execute(stmt)
        items = result.scalars().all()

        return items, total

    async def list_by_project(
        self,
        db: AsyncSession,
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

        stmt = select(Issue).filter(Issue.project_id == project_id)

        if status:
            stmt = stmt.filter(Issue.status == status.value)

        if priority:
            stmt = stmt.filter(Issue.priority == priority.value)

        # Count query
        count_stmt = select(func.count(Issue.id)).filter(Issue.project_id == project_id)
        if status:
            count_stmt = count_stmt.filter(Issue.status == status.value)
        if priority:
            count_stmt = count_stmt.filter(Issue.priority == priority.value)

        total_result = await db.execute(count_stmt)
        total = total_result.scalar() or 0

        # Items query
        stmt = (
            stmt.order_by(order_by)
            .offset(pagination.offset)
            .limit(pagination.page_size)
        )
        
        result = await db.execute(stmt)
        items = result.scalars().all()

        return items, total


    async def get(self, db: AsyncSession, issue_id: UUID):
        # Cache-aside pattern
        cache_key = f"issue:{issue_id}"
        cached_data = await get_cache(cache_key)
        
        if cached_data:
            data = json.loads(cached_data)
            data["id"] = UUID(data["id"])
            data["project_id"] = UUID(data["project_id"])
            if "created_at" in data:
                data["created_at"] = datetime.fromisoformat(data["created_at"])
            if "updated_at" in data and data["updated_at"]:
                data["updated_at"] = datetime.fromisoformat(data["updated_at"])
            return Issue(**data)

        issue = await db.get(Issue, issue_id)
        if issue:
            # Cache the result
            issue_out = IssueOut.model_validate(issue)
            await set_cache(cache_key, issue_out.model_dump_json())
            
        return issue

    async def create(self, db: AsyncSession, project_id: UUID, data: IssueCreate):
        project = await db.get(Project, project_id)
        if not project:
            return None

        issue = Issue(
            project_id=project_id,
            title=data.title,
            description=data.description,
            status=data.status.value,
            priority=data.priority.value,
        )

        db.add(issue)
        await db.commit()
        await db.refresh(issue)
        return issue


    async def update(self, db: AsyncSession, issue_id: UUID, data: IssueUpdate):
        issue = await db.get(Issue, issue_id)
        if not issue:
            return None

        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            if field in {"status", "priority"}:
                value = value.value
            setattr(issue, field, value)

        issue.updated_at = datetime.now(UTC)
        await db.commit()
        await db.refresh(issue)
        
        # Invalidate cache
        await delete_cache(f"issue:{issue_id}")
        
        return issue

    async def delete(self, db: AsyncSession, issue_id: UUID):
        issue = await db.get(Issue, issue_id)
        if not issue:
            return None

        await db.delete(issue)
        await db.commit()
        
        # Invalidate cache
        await delete_cache(f"issue:{issue_id}")
        
        return issue


issue_service = IssueService()
