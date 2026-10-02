import type { HelpRequest, HelpRequestStatus } from '../../types';

/**
 * The help request this visitor sent last, kept in this browser so the Help page can keep
 * showing its status after a refresh. Only what the visitor typed is stored.
 */
const KEY = 'mint-help-active-request';
/** A museum visit is over by then, so an older request is not shown again. */
const MAX_AGE_MS = 12 * 60 * 60 * 1000;

const STATUSES: HelpRequestStatus[] = ['new', 'in-progress', 'resolved', 'cancelled', 'not-found'];

export function readActiveHelpRequest(): HelpRequest | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (typeof parsed !== 'object' || parsed === null) return null;
    const row = parsed as Partial<HelpRequest>;
    if (typeof row.id !== 'string' || typeof row.createdAt !== 'string' || !STATUSES.includes(row.status as HelpRequestStatus)) {
      return null;
    }
    const age = Date.now() - Date.parse(row.createdAt);
    if (!Number.isFinite(age) || age > MAX_AGE_MS) return null;
    return {
      id: row.id,
      area: typeof row.area === 'string' ? row.area : '',
      areaSource: row.areaSource === 'lastScanned' ? 'lastScanned' : 'manual',
      description: typeof row.description === 'string' ? row.description : '',
      visitorNote: typeof row.visitorNote === 'string' ? row.visitorNote : '',
      status: row.status as HelpRequestStatus,
      createdAt: row.createdAt,
      updatedAt: typeof row.updatedAt === 'string' ? row.updatedAt : undefined,
    };
  } catch {
    return null;
  }
}

export function saveActiveHelpRequest(request: HelpRequest): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(request));
  } catch {
    // Storage unavailable: the status is still shown until the page is refreshed.
  }
}

export function clearActiveHelpRequest(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
