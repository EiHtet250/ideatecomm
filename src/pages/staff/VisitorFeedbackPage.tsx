import { useEffect, useMemo, useState } from 'react';
import { PagePlaceholder } from '../../components';
import { FeedbackCard } from '../../components/staff/FeedbackCard';
import { feedbackRatingOptions, FeedbackStats } from '../../components/staff/FeedbackStats';
import { feedbackArrivalText, NewArrivalNotice } from '../../components/staff/NewArrivalNotice';
import { getStaffStrings } from '../../components/staff/staffStrings';
import { formatClock, useNow } from '../../components/staff/time';
import { countByRating, useFeedback } from '../../components/staff/useFeedback';

type RatingFilter = 'all' | 1 | 2 | 3 | 4 | 5;

/** Staff view of all visitor feedback. Mirrors the Help Requests page: summary, filter, cards, live updates. */
export function VisitorFeedbackPage() {
  const strings = getStaffStrings();
  const t = strings.feedbackPage;
  const f = strings.feedback;
  const now = useNow();
  const { items, phase, refreshError, lastUpdated, newArrivals, retry } = useFeedback();
  const [filter, setFilter] = useState<RatingFilter>('all');

  const [hidden, setHidden] = useState(() => document.hidden);
  useEffect(() => {
    const onChange = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  const counts = useMemo(() => countByRating(items), [items]);
  const visible = useMemo(() => (filter === 'all' ? items : items.filter((item) => item.rating === filter)), [items, filter]);
  const freshIds = useMemo(() => new Set(newArrivals.map((a) => a.id)), [newArrivals]);

  const filters: { value: RatingFilter; label: string; icon?: string; count: number }[] = [
    { value: 'all', label: t.filterAll, count: items.length },
    ...[...feedbackRatingOptions()].reverse().map((option) => ({
      value: option.value as RatingFilter,
      label: option.label,
      icon: option.icon,
      count: counts[option.value] ?? 0,
    })),
  ];

  return (
    <PagePlaceholder title={t.title} description={t.description}>
      <p className="staff-note">
        <span aria-hidden="true">ℹ </span>
        {t.privacyNote}
      </p>

      <NewArrivalNotice text={feedbackArrivalText(newArrivals, strings)} />

      {phase === 'ready' && (
        <p className="staff-muted staff-updated">
          {refreshError ? null : lastUpdated && t.lastUpdated(formatClock(lastUpdated, strings.locale))}{' '}
          {hidden && strings.list.paused}
        </p>
      )}

      {phase === 'ready' && refreshError && (
        <div className="staff-alert staff-alert--error" role="alert">
          <p>
            <span aria-hidden="true">⚠ </span>
            {f.refreshFailed(strings.serviceErrors[refreshError])}
          </p>
          <button type="button" className="btn staff-btn" onClick={retry}>
            {f.retry}
          </button>
        </div>
      )}

      {phase === 'loading' && (
        <p className="staff-state" role="status">
          {f.loading}
        </p>
      )}

      {phase === 'error' && (
        <div className="staff-alert staff-alert--error" role="alert">
          <p>
            <span aria-hidden="true">⚠ </span>
            {f.loadFailed} {refreshError && strings.serviceErrors[refreshError]}
          </p>
          <button type="button" className="btn staff-btn" onClick={retry}>
            {f.retry}
          </button>
        </div>
      )}

      {phase === 'ready' && items.length === 0 && (
        <p className="staff-state" role="status">
          {t.empty}
        </p>
      )}

      {phase === 'ready' && items.length > 0 && (
        <>
          <section className="staff-card staff-feedback__summary" aria-labelledby="visitor-feedback-summary">
            <h2 id="visitor-feedback-summary" className="staff-card__title">
              {t.summaryHeading}
            </h2>
            <FeedbackStats items={items} strings={strings} />
          </section>

          <div className="staff-filter" role="group" aria-label={t.filterLabel}>
            {filters.map((option) => (
              <button
                key={option.value}
                type="button"
                className="staff-filter__btn"
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.icon && <span aria-hidden="true">{option.icon} </span>}
                {option.label} <span className="staff-filter__count">({option.count})</span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="staff-state" role="status">
              {t.emptyFiltered}
            </p>
          ) : (
            <ul className="staff-cards">
              {visible.map((entry) => (
                <li key={entry.id}>
                  <FeedbackCard entry={entry} strings={strings} now={now} fresh={freshIds.has(entry.id)} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </PagePlaceholder>
  );
}
