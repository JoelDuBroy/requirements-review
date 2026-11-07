# Notes for reviewers

## What I would do differently with more time / in production

I would add optimistic concurrency (for example an `updated_at` / version check) so two recruiters cannot silently overwrite each other, and I would cover the save path with a few API tests for origin transitions, deletes, and the no-op save. I would also keep unsaved draft state in `sessionStorage` so a mid-edit refresh does not throw away work, and tighten empty-state / keyboard flows once this screen is used every day.

## Design choices (brief)

- **Save is explicit.** Edits stay in client draft until Save. On success the UI is replaced with the server payload; on failure the draft is kept so the page never pretends a write landed.
- **Origin is authoritative on the server.** The UI shows a provisional origin while editing; the PUT handler recomputes `extracted` → `edited`, keeps `added`, and assigns `added` for new rows.
- **No-op saves are cheap.** The client disables Save when nothing changed; the API also short-circuits when the payload matches the stored rows.

## Demo path

1. `just setup` then `just dev`
2. Open http://localhost:3000/jobs/eng
3. Edit text, flip kind, delete a row, add a row, Save, reload
