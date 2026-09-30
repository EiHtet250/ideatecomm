import { useId } from 'react';
import type { HelpRequest, HelpRequestStatus } from '../../types';
import type { HelpRequestActionError } from '../help/useHelpRequests';
import { RequestTime } from './RequestTime';
import { STATUS_ICONS, STATUS_ORDER, StatusBadge } from './StatusBadge';
import type { StaffStrings } from './staffStrings';
import './staff.css';

interface HelpRequestCardProps {
  request: HelpRequest;
  strings: StaffStrings;
  now: number;
  saving: boolean;
  fresh: boolean;
  actionError: HelpRequestActionError | null;
  onChangeStatus: (id: string, status: HelpRequestStatus) => void;
  onDismissError: () => void;
}

export function HelpRequestCard({
  request,
  strings,
  now,
  saving,
  fresh,
  actionError,
  onChangeStatus,
  onDismissError,
}: HelpRequestCardProps) {
  const t = strings.list;
  const uid = useId();
  const titleId = `${uid}-title`;
  const groupId = `${uid}-group`;

  return (
    <article className={`staff-card${fresh ? ' staff-card--fresh' : ''}`} aria-labelledby={titleId}>
      <header className="staff-card__header">
        <h3 id={titleId} className="staff-card__title">
          {t.requestLabel(request.id)}
        </h3>
        <StatusBadge status={request.status} label={strings.status[request.status]} />
      </header>

      <dl className="staff-card__details">
        <div>
          <dt>{t.areaLabel}</dt>
          <dd className="staff-card__area">
            {request.area}
            {request.areaSource === 'lastScanned' && <span className="staff-muted"> {t.fromQrScan}</span>}
          </dd>
        </div>
        <div>
          <dt>{t.messageLabel}</dt>
          <dd className="staff-card__message">{request.description}</dd>
        </div>
        <div>
          <dt>{t.sentLabel}</dt>
          <dd>
            <RequestTime iso={request.createdAt} now={now} strings={strings} />
          </dd>
        </div>
      </dl>

      <div className="staff-card__actions" role="group" aria-labelledby={groupId}>
        <span id={groupId} className="staff-card__actions-label">
          {t.setStatusLabel}
          <span className="staff-visually-hidden"> ({t.requestLabel(request.id)})</span>
        </span>
        <div className="staff-segmented">
          {STATUS_ORDER.map((status) => {
            const current = request.status === status;
            return (
              <button
                key={status}
                type="button"
                className="staff-segmented__btn"
                aria-pressed={current}
                aria-disabled={saving || undefined}
                onClick={() => {
                  if (!current && !saving) onChangeStatus(request.id, status);
                }}
              >
                <span aria-hidden="true">{STATUS_ICONS[status]} </span>
                {strings.status[status]}
              </button>
            );
          })}
        </div>
        <p className="staff-card__saving" role="status">
          {saving ? t.saving : ''}
        </p>
      </div>

      {actionError && (
        <div className="staff-alert staff-alert--error" role="alert">
          <p>
            <span aria-hidden="true">⚠ </span>
            {t.actionFailed(strings.status[actionError.revertedTo])}{' '}
            {actionError.message ?? strings.serviceErrors[actionError.code]}
          </p>
          <button type="button" className="btn staff-btn staff-btn--secondary" onClick={onDismissError}>
            {t.dismiss}
          </button>
        </div>
      )}
    </article>
  );
}
