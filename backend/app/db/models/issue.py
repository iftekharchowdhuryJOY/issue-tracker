from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from uuid import UUID, uuid4

from app.db.base import Base
from sqlalchemy.orm import relationship



class Issue(Base):
    __tablename__ = "issues"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)

    project_id: Mapped[UUID] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE")
    )

    project: Mapped["Project"] = relationship(
        back_populates="issues"
    )

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000))
    status: Mapped[str] = mapped_column(String(20))
    priority: Mapped[str] = mapped_column(String(20))

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )
    updated_at: Mapped[datetime | None] = mapped_column(DateTime)
