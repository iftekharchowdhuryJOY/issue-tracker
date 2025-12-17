from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from uuid import UUID
from enum import Enum


class IssueStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    done = "done"


class IssuePriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    
class IssueBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str | None = Field(None, max_length=1000)
    status: IssueStatus = IssueStatus.open
    priority: IssuePriority = IssuePriority.medium


class IssueCreate(IssueBase):
    pass


class IssueUpdate(BaseModel):
    title: str | None = Field(None, min_length=3, max_length=200)
    description: str | None = Field(None, max_length=1000)
    status: IssueStatus | None = None
    priority: IssuePriority | None = None


class IssueOut(IssueBase):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
