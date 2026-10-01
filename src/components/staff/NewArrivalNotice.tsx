import type { HelpRequest } from '../../types';
import type { FeedbackEntry } from '../../types/help';
import type { StaffStrings } from './staffStrings';
import './staff.css';

/** Announcement text for help requests that arrived since the last check. */
export function helpArrivalText(arrivals: HelpRequest[], strings: StaffStrings): string {
  if (arrivals.length === 0) return '';
  const each = arrivals.map((a) => strings.list.newArrival(a.id, a.area)).join(' ');
  return arrivals.length === 1 ? each : `${strings.list.newArrivals(arrivals.length)} ${each}`;
}

/** Announcement text for feedback that arrived since the last check. */
export function feedbackArrivalText(arrivals: FeedbackEntry[], strings: StaffStrings): string {
  if (arrivals.length === 0) return '';
  const ratings = strings.feedback.ratings;
  const each = arrivals
    .map((a) => strings.feedbackPage.newArrival(a.id, ratings.find((r) => r.value === a.rating)?.label ?? String(a.rating)))
    .join(' ');
  return arrivals.length === 1 ? each : `${strings.feedbackPage.newArrivals(arrivals.length)} ${each}`;
}

/**
 * Polite live region for new arrivals. Always rendered (even when empty)
 * so screen readers pick up the first change.
 */
export function NewArrivalNotice({ text }: { text: string }) {
  return (
    <div className="staff-live" role="status" aria-live="polite">
      {text && (
        <p className="staff-alert staff-alert--new">
          <span aria-hidden="true">🔔 </span>
          {text}
        </p>
      )}
    </div>
  );
}
