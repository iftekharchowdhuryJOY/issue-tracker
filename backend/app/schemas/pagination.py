from pydantic import BaseModel, Field


class PaginationParams(BaseModel):
    page: int = Field(1, ge=1, description="Page number (1-based)")
    page_size: int = Field(
        10,
        ge=1,
        le=100,
        description="Items per page (max 100)",
    )

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size
