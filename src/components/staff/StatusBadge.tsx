import type { HelpRequestStatus } from '../../types';
import './staff.css';

/** Shape + text for each status, so status never depends on colour alone. */
export const STATUS_ICONS: Record<HelpRequestStatus, string> = {
  new: '●',
  'in-progress': '◐',
  resolved: '✓',
};

export const STATUS_ORDER: HelpRequestStatus[] = ['new', 'in-progress', 'resolved'];

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
