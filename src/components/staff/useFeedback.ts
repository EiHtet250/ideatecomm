import { useCallback, useEffect, useRef, useState } from 'react';
import { isN8nServiceError, listFeedback } from '../../services/n8nClient';
import type { FeedbackEntry, ServiceErrorCode } from '../../types/help';

export type FeedbackPhase = 'loading' | 'ready' | 'error';

/** Loads visitor feedback once, with a manual refresh. Feedback is not urgent, so there is no polling. */
export function useFeedback() {
  const [items, setItems] = useState<FeedbackEntry[]>([]);
  const [phase, setPhase] = useState<FeedbackPhase>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<ServiceErrorCode | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const inFlightRef = useRef(false);
  const tokenRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    const token = ++tokenRef.current;
    const controller = new AbortController();
    abortRef.current = controller;
    setRefreshing(true);
    try {
      const rows = await listFeedback(controller.signal);
      if (token !== tokenRef.current) return;
      setItems(rows);
      setError(null);
      setLastUpdated(new Date());
      setPhase('ready');
    } catch (e) {
      if (token !== tokenRef.current) return;
      const code = isN8nServiceError(e) ? e.code : 'SERVER';
      if (code === 'ABORTED') return;
      setError(code);
      setPhase((current) => (current === 'loading' ? 'error' : current));
    } finally {
      if (token === tokenRef.current) {
        inFlightRef.current = false;
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void load();
    return () => {
      tokenRef.current += 1;
      inFlightRef.current = false;
      abortRef.current?.abort();
    };
  }, [load]);

  const refresh = useCallback(() => {
    setPhase((current) => (current === 'error' ? 'loading' : current));
    void load();
  }, [load]);

  return { items, phase, refreshing, error, lastUpdated, refresh };
}
