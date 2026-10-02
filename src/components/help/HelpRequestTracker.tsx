import { useEffect, useRef, useState } from 'react';
import { getHelpRequest, isN8nServiceError, updateHelpRequestStatus } from '../../services/n8nClient';
import type { HelpRequest, HelpRequestStatus } from '../../types';
import { saveActiveHelpRequest } from './activeHelpRequest';
import { UNSURE_AREA_VALUE } from './helpAreas';
import type { HelpStrings } from './helpStrings';
import './help.css';

const POLL_MS = 10_000;

const ICONS: Record<HelpRequestStatus, string> = {
  new: '✓',
  'in-progress': '◐',
  resolved: '✓',
  cancelled: '✕',
  'not-found': '⚠',
};

const ALERT_CLASS: Record<HelpRequestStatus, string> = {
  new: 'help-alert--success',
  'in-progress': 'help-alert--success',
  resolved: 'help-alert--success',
  cancelled: 'help-alert--neutral',
  'not-found': 'help-alert--error',
};

/** Staff can still come: the visitor should wait, and may cancel. */
const isOpen = (status: HelpRequestStatus) => status === 'new' || status === 'in-progress';

interface HelpRequestTrackerProps {
  request: HelpRequest;
  strings: HelpStrings;
  /** Move keyboard focus to the heading (after the visitor has just sent the request). */
  focusOnMount: boolean;
  onSendAnother: () => void;
}

/**
 * Shown in place of the form once a help request is sent. Follows the request's status
 * (checked every 10 seconds while staff can still come) and lets the visitor cancel it.
 */
export function HelpRequestTracker({ request, strings, focusOnMount, onSendAnother }: HelpRequestTrackerProps) {
  const t = strings.request;
  const [current, setCurrent] = useState(request);
  const [checkFailed, setCheckFailed] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelFailed, setCancelFailed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const open = isOpen(current.status);

  useEffect(() => {
    if (focusOnMount) headingRef.current?.focus();
  }, [focusOnMount]);

  useEffect(() => {
    if (!open) return;
    let stopped = false;
    let inFlight = false;
    let timer: number | undefined;
    const controller = new AbortController();

    const schedule = () => {
      window.clearTimeout(timer);
      if (!stopped && !document.hidden) timer = window.setTimeout(check, POLL_MS);
    };
    const check = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const latest = await getHelpRequest(current.id, controller.signal);
        if (stopped) return;
        if (latest) {
          setCurrent(latest);
          saveActiveHelpRequest(latest);
        }
        setCheckFailed(false);
      } catch (error) {
        if (stopped || (isN8nServiceError(error) && error.code === 'ABORTED')) return;
        setCheckFailed(true);
      } finally {
        inFlight = false;
      }
      schedule();
    };
    const onVisibilityChange = () => {
      if (document.hidden) window.clearTimeout(timer);
      else void check();
    };

    void check();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      controller.abort();
    };
  }, [current.id, open]);

  async function cancel() {
    if (cancelling) return;
    setCancelling(true);
    setCancelFailed(false);
    try {
      const updated = await updateHelpRequestStatus(current.id, 'cancelled');
      setCurrent(updated);
      saveActiveHelpRequest(updated);
    } catch {
      setCancelFailed(true);
    } finally {
      setCancelling(false);
    }
  }

  const status = t.tracker.status[current.status];
  const stayNotice =
    !current.area || current.area.startsWith(UNSURE_AREA_VALUE) ? t.tracker.stayHere : t.tracker.stayNear(current.area);

  return (
    <div className={`help-alert help-tracker ${ALERT_CLASS[current.status]}`} role="status">
      <h3 className="help-alert__title" ref={headingRef} tabIndex={-1}>
        <span aria-hidden="true">{ICONS[current.status]} </span>
        {status.heading}
      </h3>
      <p>{status.text}</p>

      {open && <p className="help-tracker__stay">{stayNotice}</p>}

      <p className="help-reference">
        {t.referenceLabel}: <strong>{current.id}</strong>
      </p>

      {open && (
        <>
          <ul className="help-list">
            <li>{t.tracker.movedHint}</li>
            {t.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <p className="help-tracker__muted">{checkFailed ? t.tracker.checkFailed : t.tracker.updates}</p>
        </>
      )}

      {cancelFailed && (
        <p role="alert">
          <span aria-hidden="true">⚠ </span>
          {t.tracker.cancelFailed}
        </p>
      )}

      <div className="help-tracker__actions">
        {open && (
          <button
            type="button"
            className="btn help-btn help-btn--secondary"
            aria-disabled={cancelling || undefined}
            onClick={() => void cancel()}
          >
            {cancelling ? t.tracker.cancelling : t.tracker.cancel}
          </button>
        )}
        {!open && (
          <button type="button" className="btn help-btn help-btn--secondary" onClick={onSendAnother}>
            {t.sendAnother}
          </button>
        )}
      </div>
    </div>
  );
}
