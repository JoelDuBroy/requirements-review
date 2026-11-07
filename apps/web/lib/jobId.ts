/** Short URL keys for seeded jobs → real Postgres UUIDs. */
const JOB_SLUGS: Record<string, string> = {
  eng: "11111111-1111-4111-8111-111111111111",
  nurse: "22222222-2222-4222-8222-222222222222",
  warehouse: "33333333-3333-4333-8333-333333333333",
};

/** Demo path used in README / NOTES. */
export const DEMO_JOB_PATH = "/jobs/eng";

/**
 * Resolve a route param to the API job id.
 * Accepts a short slug (`eng`) or a raw UUID.
 */
export function resolveJobId(param: string): string {
  return JOB_SLUGS[param] ?? param;
}
