# Technical Check-in

Thanks for the conversations so far. This is a small, scoped exercise on a slice of the
work you would actually be doing here. Not a full product, and not meant to take a big
chunk of your time.

**Time box: 1.5 hours, hard cap.** This is unpaid, so the scope below is intentionally
small. Stop at 1.5 hours wherever you land. We would rather see 1.5 hours of real work
than a rushed or over-extended version of something bigger.

The clock starts when you start building. Setup below is on us, and it should take a
couple of minutes.

## Setup

You need Docker, [uv](https://docs.astral.sh/uv/), [pnpm](https://pnpm.io/) and
[just](https://just.systems/). Then:

```bash
just setup     # start the database, install Python and Node dependencies
just dev       # run the database, the API and the web app together
```

Open [http://localhost:3000](http://localhost:3000). You should see three green dots:
web app, API, database. That page exists only to prove the stack is up. Ctrl-C stops
everything.

`just` on its own lists the other recipes. `just reset` throws the database away and
loads the seed data again. If you would rather not install `just`, open the `justfile`
and run the commands inside it directly.

## What you get

A running stack and some data. No application code.

```
apps/api/                     Python API
  src/screening/main.py         FastAPI app. GET /health, and nothing else
  src/screening/db.py           async engine, one session per request
apps/web/                     Next.js app
  app/page.tsx                  the status page
  next.config.ts                /api/* is passed through to the API
db/01-schema.sql              the tables and columns, with notes on each
db/02-seed.sql                the fake data
data/*.json                   the same data as plain JSON, to read without psql
```

| Piece    | Where                                          |
| -------- | ---------------------------------------------- |
| Web      | [http://localhost:3000](http://localhost:3000) |
| API      | [http://localhost:8000](http://localhost:8000) |
| Database | `postgres://app:app@localhost:55432/screening` |

Three jobs are seeded. Each has 9 to 11 requirements that a machine pulled out of the
job description. None of them have been looked at by a human yet.

## The stack

Python, FastAPI, SQLAlchemy and Pydantic on the API side. TypeScript, React and Next.js
on the web side. That is what you would be working in, so stay in it. Everything inside
those choices is yours: the routes, the models, the shape of the payloads, how you
fetch, how you hold state.

## The task

A recruiter reviews the extracted requirements before the job goes live.

**1. The screen**

Add a route at `apps/web/app/jobs/[jobId]/page.tsx`. It lists that job's requirements
in order. Each row shows the requirement text, whether it is a must-have or a
nice-to-have, and where it came from.

Open it at
[http://localhost:3000/jobs/11111111-1111-4111-8111-111111111111](http://localhost:3000/jobs/11111111-1111-4111-8111-111111111111),
which is one of the seeded jobs. You do not need a job list or a job picker, and you do
not need to touch the status page at `/`.

**2. The edits**

On that page the recruiter can:

- change a requirement's text
- switch it between must-have and nice-to-have
- delete it
- add a new one at the end

**3. The save**

Nothing reaches the database until the recruiter clicks **Save**. After a save, the
page shows what the server came back with, not what the browser had in memory.

**4. The origin rule**

A requirement starts as `extracted`. If the recruiter changes its text, it becomes
`edited`. A requirement the recruiter writes is `added`. Deleting removes it.

## Done means

- Reload the page and your changes are still there
- A deleted requirement is gone from the database
- Save with nothing changed does nothing
- A save that fails does not leave the page showing something that is not true

## Scope

We do not expect you to build things like authentication, multiple users, drag to
reorder, or the extraction itself. If it is not listed above, skip it.

## What to submit

1. **Your code**, as a zip.
2. **A screen recording** of the work: walk us through what you built. Put a link to
   the video in the repo, or send us the file separately - please do not commit the
   video itself. If your tool generates a transcript, attach that too.
3. **Two or three sentences:** what would you do differently with more time, or in
   production?

## Next step

We will book a call to go through the assignment together.
