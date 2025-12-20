from datetime import datetime
import json
from uuid import UUID

from sqlalchemy import asc, desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.project import Project
from app.schemas.pagination import PaginationParams
from app.schemas.project import ProjectCreate, ProjectOut, ProjectUpdate
from app.schemas.sorting import SortOrder
from app.core.redis import get_cache, set_cache, delete_cache


class ProjectService:
    async def list(
        self,
        db: AsyncSession,
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

        # Base query for items
        stmt = select(Project)
        if owner_id:
            stmt = stmt.filter(Project.owner_id == owner_id)
        
        # Query for total count
        count_stmt = select(func.count(Project.id))
        if owner_id:
            count_stmt = count_stmt.filter(Project.owner_id == owner_id)
        
        total_result = await db.execute(count_stmt)
        total = total_result.scalar() or 0

        # Apply sorting and pagination to items statement
        stmt = (
            stmt.order_by(order_by)
            .offset(pagination.offset)
            .limit(pagination.page_size)
        )
        
        result = await db.execute(stmt)
        items = result.scalars().all()

        return items, total 


    async def get(self, db: AsyncSession, project_id: UUID):
        # Cache-aside pattern
        cache_key = f"project:{project_id}"
        cached_data = await get_cache(cache_key)
        
        if cached_data:
            data = json.loads(cached_data)
            data["id"] = UUID(data["id"])
            if "created_at" in data:
                data["created_at"] = datetime.fromisoformat(data["created_at"])
            if "owner_id" in data:
                data["owner_id"] = UUID(data["owner_id"])
            return Project(**data)

        project = await db.get(Project, project_id)
        if project:
            # Cache the result
            project_out = ProjectOut.model_validate(project)
            await set_cache(cache_key, project_out.model_dump_json())
            
        return project

    async def create(self, db: AsyncSession, data: ProjectCreate, owner_id: UUID):
        project = Project(
            name=data.name,
            description=data.description,
            owner_id=owner_id,
        )
        db.add(project)
        await db.commit()
        await db.refresh(project)
        return project

    async def update(self, db: AsyncSession, project_id: UUID, data: ProjectUpdate):
        project = await db.get(Project, project_id)
        if not project:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(project, field, value)

        await db.commit()
        await db.refresh(project)
        
        # Invalidate cache
        await delete_cache(f"project:{project_id}")
        
        return project

    async def delete(self, db: AsyncSession, project_id: UUID):
        project = await db.get(Project, project_id)
        if not project:
            return None

        await db.delete(project)
        await db.commit()
        
        # Invalidate cache
        await delete_cache(f"project:{project_id}")
        
        return project


project_service = ProjectService()
