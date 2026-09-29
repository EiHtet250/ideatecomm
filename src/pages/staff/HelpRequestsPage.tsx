import { PagePlaceholder, PlaceholderBox } from '../../components';
import type { HelpRequestStatus } from '../../types';

// Status labels the future request system will use (see HelpRequest in src/types/user.ts).
const STATUSES: { value: HelpRequestStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
];

export function HelpRequestsPage() {
  return (
    <PagePlaceholder
      title="Help Requests"
      description="Incoming help requests from visitors and their status."
      planned={[
        'Live list of incoming visitor requests',
        'Update a request status (New → In progress → Resolved)',
        'Show where the visitor is in the museum',
        'Alerts for new requests',
      ]}
    >
      <div className="status-legend" aria-label="Request statuses">
        {STATUSES.map((s) => (
          <span key={s.value} className={`status status--${s.value}`}>
            {s.label}
          </span>
        ))}
      </div>

      <PlaceholderBox label="Incoming requests list" note="Columns: visitor · location · message · status · time" size="lg" />
    </PagePlaceholder>
  );
}
