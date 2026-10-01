import { useCallback, useEffect, useRef, useState } from 'react';
import { isN8nServiceError, listFeedback } from '../../services/n8nClient';
import type { FeedbackEntry, ServiceErrorCode } from '../../types/help';

export type FeedbackPhase = 'loading' | 'ready' | 'error';

const DEFAULT_POLL_MS = 10_000;
const NEW_ARRIVAL_MS = 120_000;

export function countByRating(items: FeedbackEntry[]): Record<number, number> {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 };
  for (const item of items) counts[item.rating] = (counts[item.rating] ?? 0) + 1;
  return counts;
}

export function averageRating(items: FeedbackEntry[]): number {
  if (items.length === 0) return 0;
  return items.reduce((sum, item) => sum + item.rating, 0) / items.length;
}

/**
 * Shared data hook for the Staff Home feedback card and the Visitor Feedback page,
 * so both behave the same way as the help request views:
 * - loads the newest 100 entries, then polls every 10 s;
 * - pauses while the tab is hidden and refreshes as soon as it is visible again;
 * - never runs two list requests at once;
 * - reports feedback that arrived since the last check.
 */
export function useFeedback({ pollIntervalMs = DEFAULT_POLL_MS }: { pollIntervalMs?: number } = {}) {
  const [items, setItems] = useState<FeedbackEntry[]>([]);
  const [phase, setPhase] = useState<FeedbackPhase>('loading');
  const [refreshError, setRefreshError] = useState<ServiceErrorCode | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [newArrivals, setNewArrivals] = useState<FeedbackEntry[]>([]);

  const seenIdsRef = useRef<Set<string> | null>(null);
  const inFlightRef = useRef(false);
  const tokenRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  // The "new feedback" notice and highlight clear themselves after 2 minutes.
  useEffect(() => {
    if (newArrivals.length === 0) return;
    const timer = window.setTimeout(() => setNewArrivals([]), NEW_ARRIVAL_MS);
    return () => window.clearTimeout(timer);
  }, [newArrivals]);

  const load = useCallback(async () => {
    if (inFlightRef.current) return; // no overlapping requests
    inFlightRef.current = true;
    const token = ++tokenRef.current;
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const rows = await listFeedback(controller.signal); // already newest first
      if (token !== tokenRef.current) return;
      const seen = seenIdsRef.current;
      if (seen) {
        const fresh = rows.filter((row) => !seen.has(row.id));
        if (fresh.length > 0) setNewArrivals(fresh);
      }
      seenIdsRef.current = new Set(rows.map((row) => row.id));
      setItems(rows);
      setRefreshError(null);
      setLastUpdated(new Date());
      setPhase('ready');
    } catch (error) {
      if (token !== tokenRef.current) return;
      const code = isN8nServiceError(error) ? error.code : 'SERVER';
      if (code === 'ABORTED') return;
      setRefreshError(code);
      setPhase((current) => (current === 'loading' ? 'error' : current));
    } finally {
      if (token === tokenRef.current) inFlightRef.current = false;
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
      tokenRef.current += 1;
      inFlightRef.current = false;
      abortRef.current?.abort();
    };
  }, [load, pollIntervalMs]);

  const retry = useCallback(() => {
    setPhase((current) => (current === 'error' ? 'loading' : current));
    void load();
  }, [load]);

  return { items, phase, refreshError, lastUpdated, newArrivals, retry };
}
