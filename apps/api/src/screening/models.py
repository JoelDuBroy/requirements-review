"""ORM models and Pydantic schemas for jobs and requirements."""

from __future__ import annotations

import uuid
from enum import StrEnum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Kind(StrEnum):
    MUST_HAVE = "must_have"
    NICE_TO_HAVE = "nice_to_have"


class Origin(StrEnum):
    EXTRACTED = "extracted"
    EDITED = "edited"
    ADDED = "added"


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    requirements: Mapped[list[Requirement]] = relationship(
        back_populates="job",
        order_by="Requirement.position",
        cascade="all, delete-orphan",
    )


class Requirement(Base):
    __tablename__ = "requirements"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False
    )
    text: Mapped[str] = mapped_column(Text, nullable=False)
    kind: Mapped[str] = mapped_column(Text, nullable=False)
    origin: Mapped[str] = mapped_column(Text, nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)

    job: Mapped[Job] = relationship(back_populates="requirements")


# --- API shapes ----------------------------------------------------------------


class RequirementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    text: str
    kind: Kind
    origin: Origin
    position: int


class JobOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    location: str
    requirements: list[RequirementOut]


class RequirementSaveItem(BaseModel):
    """One row as the recruiter wants it after editing.

    `id` is omitted (or null) for rows the recruiter just wrote.
    Origin is computed on the server from the stored row + the new text.
    """

    id: Optional[uuid.UUID] = None
    text: str = Field(min_length=1)
    kind: Kind

    @field_validator("text")
    @classmethod
    def strip_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Requirement text cannot be blank")
        return cleaned


class RequirementsSaveIn(BaseModel):
    requirements: list[RequirementSaveItem]


class SaveResult(BaseModel):
    """What the page shows after Save — always the server's view."""

    changed: bool
    job: JobOut
