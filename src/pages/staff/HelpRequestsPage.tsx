import { useEffect, useMemo, useState } from 'react';
import { PagePlaceholder } from '../../components';
import { countByStatus, useHelpRequests } from '../../components/help/useHelpRequests';
import { HelpRequestCard } from '../../components/staff/HelpRequestCard';
import { helpArrivalText, NewArrivalNotice } from '../../components/staff/NewArrivalNotice';
import { STATUS_ICONS, STATUS_ORDER } from '../../components/staff/StatusBadge';
import { getStaffStrings } from '../../components/staff/staffStrings';
import { formatClock, useNow } from '../../components/staff/time';
import { useSettings } from '../../components/settings/SettingsProvider';
import type { HelpRequestStatus } from '../../types';
import type { HelpStatusFilter } from '../../types/help';

export function HelpRequestsPage() {
  const { currentLanguage } = useSettings();
  const strings = getStaffStrings(currentLanguage);
  const t = strings.list;
  const now = useNow();
  const { items, phase, refreshError, lastUpdated, newArrivals, updatingIds, actionError, retry, updateStatus, dismissActionError } =
    useHelpRequests();

  const [filter, setFilter] = useState<HelpStatusFilter>('all');
  // Requests changed while a filter is on stay visible until the filter changes,
  // so the card (and keyboard focus) does not vanish mid-action.
  const [stickyIds, setStickyIds] = useState<ReadonlySet<string>>(new Set());
  useEffect(() => setStickyIds(new Set()), [filter]);

  const [hidden, setHidden] = useState(() => document.hidden);
  useEffect(() => {
    const onChange = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  const counts = useMemo(() => countByStatus(items), [items]);
  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((item) => item.status === filter || stickyIds.has(item.id))),
    [items, filter, stickyIds],
  );
  const freshIds = useMemo(() => new Set(newArrivals.map((a) => a.id)), [newArrivals]);

  function changeStatus(id: string, status: HelpRequestStatus) {
    if (filter !== 'all') setStickyIds((ids) => new Set(ids).add(id));
    void updateStatus(id, status);
  }

  const filters: { value: HelpStatusFilter; label: string; icon?: string; count: number }[] = [
    { value: 'all', label: t.filterAll, count: items.length },
    ...STATUS_ORDER.map((status) => ({
      value: status,
      label: strings.status[status],
      icon: STATUS_ICONS[status],
      count: counts[status],
    })),
  ];

  return (
    <PagePlaceholder title={t.title} description={t.description}>
      <p className="staff-note">
        <span aria-hidden="true">ℹ </span>
        {t.areaNote}
      </p>

      <div className="staff-filter" role="group" aria-label={t.filterLabel}>
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            className="staff-filter__btn"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
          >
            {f.icon && <span aria-hidden="true">{f.icon} </span>}
            {f.label} <span className="staff-filter__count">({f.count})</span>
          </button>
        ))}
      </div>

      <NewArrivalNotice text={helpArrivalText(newArrivals, strings)} />

      {phase === 'ready' && (
        <p className="staff-muted staff-updated">
          {refreshError ? null : lastUpdated && t.lastUpdated(formatClock(lastUpdated, strings.locale))}{' '}
          {hidden && t.paused}
        </p>
      )}

      {phase === 'ready' && refreshError && (
        <div className="staff-alert staff-alert--error" role="alert">
          <p>
            <span aria-hidden="true">⚠ </span>
            {t.refreshFailed(strings.serviceErrors[refreshError])}
          </p>
          <button type="button" className="btn staff-btn" onClick={retry}>
            {t.retry}
          </button>
        </div>
      )}

      {phase === 'loading' && (
        <p className="staff-state" role="status">
          {t.loading}
        </p>
      )}

      {phase === 'error' && (
        <div className="staff-alert staff-alert--error" role="alert">
          <p>
            <span aria-hidden="true">⚠ </span>
            {t.loadFailed} {refreshError && strings.serviceErrors[refreshError]}
          </p>
          <button type="button" className="btn staff-btn" onClick={retry}>
            {t.retry}
          </button>
        </div>
      )}

      {phase === 'ready' && visible.length === 0 && (
        <p className="staff-state" role="status">
          {filter === 'all' ? t.empty : t.emptyFiltered}
        </p>
      )}

      {phase === 'ready' && visible.length > 0 && (
        <ul className="staff-cards">
          {visible.map((request) => (
            <li key={request.id}>
              <HelpRequestCard
                request={request}
                strings={strings}
                now={now}
                saving={updatingIds.has(request.id)}
                fresh={freshIds.has(request.id)}
                actionError={actionError?.id === request.id ? actionError : null}
                onChangeStatus={changeStatus}
                onDismissError={dismissActionError}
              />
            </li>
          ))}
        </ul>
      )}
    </PagePlaceholder>
  );
}
