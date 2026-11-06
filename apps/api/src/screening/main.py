from __future__ import annotations

import uuid

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from screening.db import get_session
from screening.models import (
    Job,
    JobOut,
    Origin,
    Requirement,
    RequirementOut,
    RequirementsSaveIn,
    SaveResult,
)

app = FastAPI(title="Requirements review")

# Wide open, so the web app on any port can talk to this.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health(session: AsyncSession = Depends(get_session)) -> dict[str, object]:
    """Smoke test for the status page.

    This is also the only example in here of getting a database session. It
    deliberately uses neither an ORM model nor a response model - how you do
    that is one of the things we are interested in.
    """
    try:
        jobs = await session.scalar(text("select count(*) from jobs"))
    except Exception:  # a health check is the one place a bare except earns its keep
        return {"api": "ok", "database": "unreachable", "jobs": 0}
    return {"api": "ok", "database": "ok", "jobs": jobs}


def _job_out(job: Job) -> JobOut:
    reqs = sorted(job.requirements, key=lambda r: r.position)
    return JobOut(
        id=job.id,
        title=job.title,
        location=job.location,
        requirements=[RequirementOut.model_validate(r) for r in reqs],
    )


async def _load_job(session: AsyncSession, job_id: uuid.UUID) -> Job:
    try:
        result = await session.execute(
            select(Job)
            .where(Job.id == job_id)
            .options(selectinload(Job.requirements))
        )
    except Exception as exc:  # connection refused, etc.
        raise HTTPException(
            status_code=503, detail=f"Database unavailable: {exc}"
        ) from exc
    job = result.scalar_one_or_none()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


def _resolve_origin(existing: Requirement | None, new_text: str) -> Origin:
    """Apply the origin rule on save.

    extracted → edited when the text changes.
    added stays added even if the recruiter tweaks it before/after save.
    edited stays edited.
    """
    if existing is None:
        return Origin.ADDED
    if existing.text == new_text:
        return Origin(existing.origin)
    if existing.origin == Origin.ADDED:
        return Origin.ADDED
    return Origin.EDITED


def _payload_unchanged(
    existing: list[Requirement], payload: RequirementsSaveIn
) -> bool:
    """True when a save would write the same rows the database already has."""
    ordered = sorted(existing, key=lambda r: r.position)
    if len(ordered) != len(payload.requirements):
        return False
    for row, item in zip(ordered, payload.requirements):
        if item.id != row.id:
            return False
        if item.text != row.text:
            return False
        if item.kind != row.kind:
            return False
    return True


@app.get("/jobs/{job_id}", response_model=JobOut)
async def get_job(
    job_id: uuid.UUID, session: AsyncSession = Depends(get_session)
) -> JobOut:
    job = await _load_job(session, job_id)
    return _job_out(job)


@app.put("/jobs/{job_id}/requirements", response_model=SaveResult)
async def save_requirements(
    job_id: uuid.UUID,
    body: RequirementsSaveIn,
    session: AsyncSession = Depends(get_session),
) -> SaveResult:
    """Replace this job's requirements with the recruiter's edited list.

    Nothing is written when the payload matches what is already stored.
    On success the response is always the database view, so the page can
    discard its draft and show the truth.
    """
    job = await _load_job(session, job_id)
    by_id = {r.id: r for r in job.requirements}

    # Reject unknown ids early — a stale tab must not invent rows.
    for item in body.requirements:
        if item.id is not None and item.id not in by_id:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown requirement id: {item.id}",
            )

    if _payload_unchanged(job.requirements, body):
        return SaveResult(changed=False, job=_job_out(job))

    keep_ids = {item.id for item in body.requirements if item.id is not None}

    for row in list(job.requirements):
        if row.id not in keep_ids:
            await session.delete(row)

    # Flush deletes before we reuse positions / insert, so the session is clean.
    await session.flush()

    for position, item in enumerate(body.requirements, start=1):
        existing = by_id.get(item.id) if item.id is not None else None
        origin = _resolve_origin(existing, item.text)

        if existing is not None:
            existing.text = item.text
            existing.kind = item.kind.value
            existing.origin = origin.value
            existing.position = position
        else:
            session.add(
                Requirement(
                    job_id=job.id,
                    text=item.text,
                    kind=item.kind.value,
                    origin=origin.value,
                    position=position,
                )
            )

    await session.commit()
    # expire_on_commit=False keeps the identity map warm; expire so the
    # response is loaded from the database, not from half-updated objects.
    session.expire_all()
    job = await _load_job(session, job_id)
    return SaveResult(changed=True, job=_job_out(job))
