import type { HelpRequestStatus } from '../../types';
import './staff.css';

/** Shape + text for each status, so status never depends on colour alone. */
export const STATUS_ICONS: Record<HelpRequestStatus, string> = {
  new: '●',
  'in-progress': '◐',
  resolved: '✓',
  cancelled: '✕',
  'not-found': '?',
};

/** The main flow, used for the count tiles. */
export const STATUS_ORDER: HelpRequestStatus[] = ['new', 'in-progress', 'resolved'];

/** Statuses staff can set on a request. "cancelled" is set by the visitor only. */
export const STAFF_STATUS_ACTIONS: HelpRequestStatus[] = [...STATUS_ORDER, 'not-found'];

/** Every status, for the filter buttons. */
export const ALL_STATUSES: HelpRequestStatus[] = [...STAFF_STATUS_ACTIONS, 'cancelled'];

/** Uses the existing .status / .status--* classes from global.css. */
export function StatusBadge({ status, label }: { status: HelpRequestStatus; label: string }) {
  return (
    <span className={`status status--${status} staff-status`}>
      <span className="staff-status__icon" aria-hidden="true">
        {STATUS_ICONS[status]}
      </span>
      {label}
    </span>
  );
}
