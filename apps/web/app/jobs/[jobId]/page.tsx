"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { resolveJobId } from "../../../lib/jobId";

type Kind = "must_have" | "nice_to_have";
type Origin = "extracted" | "edited" | "added";

type Requirement = {
  id: string;
  text: string;
  kind: Kind;
  origin: Origin;
  position: number;
};

type Job = {
  id: string;
  title: string;
  location: string;
  requirements: Requirement[];
};

type DraftRow = {
  /** Server id, or a client-only key for rows not yet saved. */
  key: string;
  id: string | null;
  text: string;
  kind: Kind;
  /** Origin as last known from the server (null for brand-new rows). */
  savedOrigin: Origin | null;
  /** Text as last known from the server (null for brand-new rows). */
  savedText: string | null;
};

type SaveResult = {
  changed: boolean;
  job: Job;
};

function toDraft(reqs: Requirement[]): DraftRow[] {
  return reqs.map((r) => ({
    key: r.id,
    id: r.id,
    text: r.text,
    kind: r.kind,
    savedOrigin: r.origin,
    savedText: r.text,
  }));
}

function displayOrigin(row: DraftRow): Origin {
  if (row.id === null) return "added";
  if (row.savedText !== null && row.text !== row.savedText) {
    return row.savedOrigin === "added" ? "added" : "edited";
  }
  return row.savedOrigin ?? "extracted";
}

function sameAsSaved(draft: DraftRow[], saved: Requirement[]): boolean {
  if (draft.length !== saved.length) return false;
  return draft.every((row, i) => {
    const s = saved[i];
    return row.id === s.id && row.text === s.text && row.kind === s.kind;
  });
}

const originLabel: Record<Origin, string> = {
  extracted: "extracted",
  edited: "edited",
  added: "added",
};

const kindLabel: Record<Kind, string> = {
  must_have: "Must-have",
  nice_to_have: "Nice-to-have",
};

export default function JobRequirementsPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = resolveJobId(params.jobId);

  const [job, setJob] = useState<Job | null>(null);
  const [draft, setDraft] = useState<DraftRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const applyJob = useCallback((next: Job) => {
    setJob(next);
    setDraft(toDraft(next.requirements));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    fetch(`/api/jobs/${jobId}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.detail ?? `Failed to load job (${res.status})`);
        }
        return (await res.json()) as Job;
      })
      .then((data) => {
        if (!cancelled) applyJob(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setLoadError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [jobId, applyJob]);

  const dirty = useMemo(() => {
    if (!job) return false;
    return !sameAsSaved(draft, job.requirements);
  }, [draft, job]);

  function updateRow(key: string, patch: Partial<Pick<DraftRow, "text" | "kind">>) {
    setDraft((rows) =>
      rows.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    );
    setStatus(null);
    setSaveError(null);
  }

  function deleteRow(key: string) {
    setDraft((rows) => rows.filter((r) => r.key !== key));
    setStatus(null);
    setSaveError(null);
  }

  function addRow() {
    const key = `new-${crypto.randomUUID()}`;
    setDraft((rows) => [
      ...rows,
      {
        key,
        id: null,
        text: "",
        kind: "must_have",
        savedOrigin: null,
        savedText: null,
      },
    ]);
    setStatus(null);
    setSaveError(null);
  }

  async function onSave() {
    if (!job || !dirty || saving) return;

    const empty = draft.find((r) => r.text.trim() === "");
    if (empty) {
      setSaveError("Every requirement needs text before you can save.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    setStatus(null);

    // Keep the current draft on failure so the page never pretends a
    // failed save landed. Only replace local state from the response.
    try {
      const res = await fetch(`/api/jobs/${jobId}/requirements`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirements: draft.map((r) => ({
            id: r.id,
            text: r.text.trim(),
            kind: r.kind,
          })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          typeof body?.detail === "string"
            ? body.detail
            : `Save failed (${res.status})`,
        );
      }

      const result = (await res.json()) as SaveResult;
      applyJob(result.job);
      setStatus(result.changed ? "Saved." : "Nothing to save.");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="review-page">
        <p className="review-loading">Loading requirements…</p>
      </main>
    );
  }

  if (loadError || !job) {
    return (
      <main className="review-page">
        <h1 className="review-title">Could not load job</h1>
        <p className="review-error">{loadError ?? "Unknown error"}</p>
      </main>
    );
  }

  return (
    <main className="review-page">
      <section className="review-shell">
        <header>
          <p className="review-kicker">Requirements review</p>
          <h1 className="review-title">{job.title}</h1>
          <p className="review-meta">{job.location}</p>
        </header>

        <div className="review-toolbar">
          <button type="button" onClick={addRow} className="btn btn-secondary">
            Add requirement
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!dirty || saving}
            className="btn btn-primary"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        {(status || saveError) && (
          <p
            className={`review-status ${saveError ? "bad" : "ok"}`}
            role="status"
          >
            {saveError ?? status}
          </p>
        )}

        {draft.length === 0 ? (
          <p className="review-empty">No requirements. Add one, then save.</p>
        ) : (
          <ul className="req-list">
            {draft.map((row, index) => {
              const origin = displayOrigin(row);
              return (
                <li
                  key={row.key}
                  className="req-row"
                  style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
                >
                  <div className="req-row-top">
                    <span className="req-index">{index + 1}</span>
                    <select
                      aria-label="Kind"
                      value={row.kind}
                      onChange={(e) =>
                        updateRow(row.key, { kind: e.target.value as Kind })
                      }
                      className="req-select"
                    >
                      <option value="must_have">{kindLabel.must_have}</option>
                      <option value="nice_to_have">
                        {kindLabel.nice_to_have}
                      </option>
                    </select>
                    <span className={`req-origin ${origin}`}>
                      {originLabel[origin]}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteRow(row.key)}
                      className="req-delete"
                      aria-label="Delete requirement"
                    >
                      Delete
                    </button>
                  </div>
                  <textarea
                    value={row.text}
                    onChange={(e) =>
                      updateRow(row.key, { text: e.target.value })
                    }
                    rows={2}
                    className="req-textarea"
                    placeholder="Requirement text"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
