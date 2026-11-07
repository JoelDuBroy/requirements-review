# requirements-review

Recruiter-facing screen to review machine-extracted job requirements before a
posting goes live. FastAPI + Next.js + PostgreSQL.

**GitHub repo name:** `requirements-review`

**Demo job:** [http://localhost:3000/jobs/eng](http://localhost:3000/jobs/eng)

Short slugs (`eng`, `nurse`, `warehouse`) map to the seeded UUIDs; raw UUIDs still work.

---

## What was built

### Web (`apps/web/app/jobs/[jobId]/page.tsx`)

- Lists that job’s requirements in order
- Shows text, kind (`must_have` / `nice_to_have`), and origin
- Edit text, switch kind, delete, add at the end
- Local draft until **Save**; after Save the UI is replaced with the server payload
- Failed saves keep the draft (no false “saved” state)
- Save stays disabled when nothing changed

### API (`apps/api`)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Starter smoke check (unchanged) |
| `GET` | `/jobs/{job_id}` | Job + ordered requirements |
| `PUT` | `/jobs/{job_id}/requirements` | Replace the requirement list for that job |

Origin is computed on the server:

- new row → `added`
- existing row, text unchanged → keep origin
- existing `extracted` / `edited`, text changed → `edited`
- existing `added`, text changed → stays `added`

If the payload matches what is already stored, the handler returns
`{ "changed": false, "job": ... }` and writes nothing.

### Done means

- Reload keeps changes
- Deletes are removed from Postgres
- No-op Save does nothing
- Failed Save does not leave a lying UI

---

## Setup

You need Docker, [uv](https://docs.astral.sh/uv/), [pnpm](https://pnpm.io/) and
[just](https://just.systems/). Then:

```bash
just setup     # start the database, install Python and Node dependencies
just dev       # run the database, the API and the web app together
```

| Piece    | Where                                          |
|----------|------------------------------------------------|
| Web      | http://localhost:3000                          |
| API      | http://localhost:8000                          |
| Database | `postgres://app:app@localhost:55432/screening` |

`just reset` throws the database away and reloads seed data.
`/` is the stack status page (with a link into the demo); the review UI is
`/jobs/eng` (or `/jobs/[jobId]` / UUID).

---

## Project layout

```
apps/api/src/screening/
  main.py      routes (health + job read/save)
  models.py    SQLAlchemy + Pydantic shapes
  db.py        async engine / session dependency
apps/web/app/
  page.tsx                 status page
  jobs/[jobId]/page.tsx   requirements review UI
db/01-schema.sql           tables
db/02-seed.sql             seed jobs + requirements
NOTES.md                   short production follow-ups
```

---

## Original assignment brief

This exercise is intentionally small. **Time box: 1.5 hours, hard cap.** Prefer
1.5 hours of real work over an over-extended build.

A recruiter reviews extracted requirements before the job goes live:

1. **Screen** at `apps/web/app/jobs/[jobId]/page.tsx`
2. **Edits:** text, kind, delete, add
3. **Save:** nothing hits the DB until Save; then show the server result
4. **Origin:** `extracted` → `edited` on text change; recruiter-written rows are `added`

Out of scope: auth, multi-user, drag reorder, the extraction itself.

### What to submit

1. Code as a zip
2. Screen recording walkthrough (link or separate file — do not commit the video)
3. Two or three sentences on what you would do differently with more time / in production — see `NOTES.md`
