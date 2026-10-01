import { useCallback, useEffect, useRef, useState } from 'react';
import { isN8nServiceError, listHelpRequests, updateHelpRequestStatus } from '../../services/n8nClient';
import type { HelpRequest, HelpRequestStatus } from '../../types';
import type { ServiceErrorCode } from '../../types/help';

export interface HelpRequestActionError {
  id: string;
  code: ServiceErrorCode;
  /** Server message, only for VALIDATION errors. */
  message?: string;
  /** Status the request was rolled back to. */
  revertedTo: HelpRequestStatus;
}

export type HelpRequestsPhase = 'loading' | 'ready' | 'error';

const DEFAULT_POLL_MS = 10_000;
const NEW_ARRIVAL_MS = 120_000;

function errorCode(error: unknown): ServiceErrorCode {
  return isN8nServiceError(error) ? error.code : 'SERVER';
}

export function countByStatus(items: HelpRequest[]): Record<HelpRequestStatus, number> {
  const counts: Record<HelpRequestStatus, number> = { new: 0, 'in-progress': 0, resolved: 0 };
  for (const item of items) counts[item.status] += 1;
  return counts;
}

/**
 * Shared data hook for Staff Home and Help Requests so both behave the same.
 * - Loads the newest 100 requests, then polls every 10 s.
 * - Polling pauses while the tab is hidden and resumes (with an immediate refresh) when visible.
 * - Never runs two list requests at once.
 * - Status changes are optimistic and roll back if the server call fails.
 */
export function useHelpRequests({ pollIntervalMs = DEFAULT_POLL_MS }: { pollIntervalMs?: number } = {}) {
  const [items, setItems] = useState<HelpRequest[]>([]);
  const [phase, setPhase] = useState<HelpRequestsPhase>('loading');
  const [refreshError, setRefreshError] = useState<ServiceErrorCode | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [newArrivals, setNewArrivals] = useState<HelpRequest[]>([]);
  const [updatingIds, setUpdatingIds] = useState<ReadonlySet<string>>(new Set());
  const [actionError, setActionError] = useState<HelpRequestActionError | null>(null);

  const itemsRef = useRef<HelpRequest[]>([]);
  const seenIdsRef = useRef<Set<string> | null>(null);
  /** Statuses changed locally but not yet confirmed; applied over poll results. */
  const pendingStatusRef = useRef(new Map<string, HelpRequestStatus>());
  const inFlightRef = useRef(false);
  const requestTokenRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // The "new request" notice and highlight clear themselves after 2 minutes.
  useEffect(() => {
    if (newArrivals.length === 0) return;
    const timer = window.setTimeout(() => setNewArrivals([]), NEW_ARRIVAL_MS);
    return () => window.clearTimeout(timer);
  }, [newArrivals]);

  const load = useCallback(async () => {
    if (inFlightRef.current) return; // no overlapping requests
    inFlightRef.current = true;
    const token = ++requestTokenRef.current;
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const rows = await listHelpRequests({ signal: controller.signal });
      if (token !== requestTokenRef.current) return;

      rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // newest first
      const seen = seenIdsRef.current;
      if (seen) {
        const fresh = rows.filter((row) => !seen.has(row.id));
        if (fresh.length > 0) setNewArrivals(fresh);
      }
      seenIdsRef.current = new Set(rows.map((row) => row.id));

      const pending = pendingStatusRef.current;
      setItems(rows.map((row) => (pending.has(row.id) ? { ...row, status: pending.get(row.id)! } : row)));
      setLastUpdated(new Date());
      setRefreshError(null);
      setPhase('ready');
    } catch (error) {
      if (token !== requestTokenRef.current || errorCode(error) === 'ABORTED') return;
      setRefreshError(errorCode(error));
      setPhase((current) => (current === 'loading' ? 'error' : current));
    } finally {
      if (token === requestTokenRef.current) inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const schedule = () => {
      window.clearTimeout(timer);
      if (!cancelled && !document.hidden) timer = window.setTimeout(tick, pollIntervalMs);
    };
    const tick = async () => {
      await load();
      schedule();
    };
    const onVisibilityChange = () => {
      if (document.hidden) window.clearTimeout(timer);
      else void tick();
    };

    void tick();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      // Invalidate and cancel the current request so a remount can load straight away.
      requestTokenRef.current += 1;
      inFlightRef.current = false;
      abortRef.current?.abort();
    };
  }, [load, pollIntervalMs]);

  const retry = useCallback(() => {
    setPhase((current) => (current === 'error' ? 'loading' : current));
    void load();
  }, [load]);

  const updateStatus = useCallback(async (id: string, next: HelpRequestStatus): Promise<boolean> => {
    const current = itemsRef.current.find((row) => row.id === id);
    if (!current || current.status === next || pendingStatusRef.current.has(id)) return false;
    const previous = current.status;

    // Optimistic update.
    pendingStatusRef.current.set(id, next);
    setItems((rows) => rows.map((row) => (row.id === id ? { ...row, status: next } : row)));
    setUpdatingIds((ids) => new Set(ids).add(id));
    setActionError((err) => (err?.id === id ? null : err));

    try {
      const updated = await updateHelpRequestStatus(id, next);
      pendingStatusRef.current.delete(id);
      setItems((rows) => rows.map((row) => (row.id === id ? updated : row)));
      return true;
    } catch (error) {
      pendingStatusRef.current.delete(id);
      setItems((rows) => rows.map((row) => (row.id === id ? { ...row, status: previous } : row)));
      const code = errorCode(error);
      setActionError({
        id,
        code,
        message: code === 'VALIDATION' && isN8nServiceError(error) ? error.message : undefined,
        revertedTo: previous,
      });
      return false;
    } finally {
      setUpdatingIds((ids) => {
        const copy = new Set(ids);
        copy.delete(id);
        return copy;
      });
    }
  }, []);

  return {
    items,
    phase,
    refreshError,
    lastUpdated,
    newArrivals,
    updatingIds,
    actionError,
    retry,
    updateStatus,
    dismissActionError: () => setActionError(null),
  };
}
