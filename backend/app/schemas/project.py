from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID, uuid4


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: str | None = Field(None, max_length=500)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=100)
    description: str | None = Field(None, max_length=500)


class ProjectOut(ProjectBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
