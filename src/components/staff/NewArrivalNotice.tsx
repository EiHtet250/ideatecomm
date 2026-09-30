import type { HelpRequest } from '../../types';
import type { StaffStrings } from './staffStrings';
import './staff.css';

/**
 * Polite live region announcing requests that arrived since the last check.
 * Always rendered (even when empty) so screen readers pick up changes.
 */
export function NewArrivalNotice({ arrivals, strings }: { arrivals: HelpRequest[]; strings: StaffStrings }) {
  const text =
    arrivals.length === 0
      ? ''
      : arrivals.length === 1
        ? strings.list.newArrival(arrivals[0].id, arrivals[0].area)
        : `${strings.list.newArrivals(arrivals.length)} ${arrivals
            .map((a) => strings.list.newArrival(a.id, a.area))
            .join(' ')}`;

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
