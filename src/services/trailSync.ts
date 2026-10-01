/**
 * Saves Discovery Trail stamps to n8n so they are kept for every logged-in visitor.
 * Workflow: n8n/workflows/mint-trail-progress.json (stores rows in the "mint_trail_stamps" Data Table).
 *
 *   POST {VITE_TRAIL_BASE_URL}/progress
 *     { action: 'list', email }                      -> { success: true, spotIds: string[] }
 *     { action: 'complete', email, spotId, qrCode }  -> { success: true, awarded: boolean, spotIds: string[] }
 *     any failure                                    -> { success: false, message }
 *
 * The workflow re-checks the QR code and the spot order, and never stores the same stamp twice.
 * Saving is best-effort: if n8n cannot be reached the trail keeps working from this browser's copy.
 *
 * NOTE: the email is taken from the browser, so this is prototype-level protection only.
 * Real protection needs the login to issue a session token that n8n verifies.
 */

const TIMEOUT_MS = 10_000;

function baseUrl(): string {
  return (import.meta.env.VITE_TRAIL_BASE_URL as string | undefined)?.trim().replace(/\/+$/, '') ?? '';
}

export const isTrailSyncConfigured = () => Boolean(baseUrl());

async function post(body: Record<string, string>): Promise<string[] | undefined> {
  const url = baseUrl();
  if (!url) return undefined;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${url}/progress`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'omit',
    });
    const json: unknown = await response.json();
    if (!response.ok || typeof json !== 'object' || json === null) return undefined;
    const { success, spotIds } = json as { success?: unknown; spotIds?: unknown };
    if (success !== true || !Array.isArray(spotIds)) return undefined;
    return spotIds.filter((id): id is string => typeof id === 'string');
  } catch {
    // Offline, blocked, timed out or not our reply shape: the caller carries on locally.
    return undefined;
  } finally {
    window.clearTimeout(timer);
  }
}

/** Spots this visitor has completed according to the server, or undefined when unavailable. */
export const fetchCompletedSpots = (email: string) => post({ action: 'list', email });

/** Records one completion. Resolves with the server's full list, or undefined when unavailable. */
export const saveCompletedSpot = (email: string, spotId: string, qrCode: string) =>
  post({ action: 'complete', email, spotId, qrCode });
