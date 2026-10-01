import { Link } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { countByStatus, useHelpRequests } from '../help/useHelpRequests';
import { helpArrivalText, NewArrivalNotice } from './NewArrivalNotice';
import { RequestTime } from './RequestTime';
import { STATUS_ICONS, STATUS_ORDER, StatusBadge } from './StatusBadge';
import type { StaffStrings } from './staffStrings';
import { useNow } from './time';
import './staff.css';

/** Counts by status and the 3 newest requests. Uses the same hook as the Help Requests page. */
export function StaffRequestSummary({ strings }: { strings: StaffStrings }) {
  const t = strings.home;
  const now = useNow();
  const { items, phase, refreshError, newArrivals, retry } = useHelpRequests();
  const counts = countByStatus(items);
  const recent = items.slice(0, 3);

  return (
    <div className="staff-summary">
      <NewArrivalNotice text={helpArrivalText(newArrivals, strings)} />

      {phase === 'loading' && (
        <p className="staff-state" role="status">
          {strings.list.loading}
        </p>
      )}

      {(phase === 'error' || (phase === 'ready' && refreshError)) && (
        <div className="staff-alert staff-alert--error" role="alert">
          <p>
            <span aria-hidden="true">⚠ </span>
            {phase === 'error'
              ? `${strings.list.loadFailed} ${refreshError ? strings.serviceErrors[refreshError] : ''}`
              : strings.list.refreshFailed(refreshError ? strings.serviceErrors[refreshError] : '')}
          </p>
          <button type="button" className="btn staff-btn" onClick={retry}>
            {strings.list.retry}
          </button>
        </div>
      )}

      {phase === 'ready' && (
        <>
          <ul className="staff-counts" aria-label={t.countsLabel}>
            {STATUS_ORDER.map((status) => (
              <li key={status} className={`staff-count staff-count--${status}`}>
                <span className="staff-count__number">{counts[status]}</span>
                <span className="staff-count__label">
                  <span aria-hidden="true">{STATUS_ICONS[status]} </span>
                  {strings.status[status]}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="staff-summary__heading">{t.recentHeading}</h3>
          {recent.length === 0 ? (
            <p className="staff-state">{t.noRecent}</p>
          ) : (
            <ul className="staff-recent">
              {recent.map((request) => (
                <li key={request.id} className="staff-recent__item">
                  <div className="staff-recent__top">
                    <strong>{strings.list.requestLabel(request.id)}</strong>
                    <StatusBadge status={request.status} label={strings.status[request.status]} />
                  </div>
                  <p className="staff-recent__area">
                    <span className="staff-muted">{strings.list.areaLabel}: </span>
                    {request.area}
                  </p>
                  <p className="staff-recent__message">{request.description}</p>
                  <RequestTime iso={request.createdAt} now={now} strings={strings} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Link to={paths.helpRequests} className="home-card__link staff-link">
        {t.viewAll}
      </Link>
    </div>
  );
}
