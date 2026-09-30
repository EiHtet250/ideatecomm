import { useMemo, useState } from 'react';
import { getHelpStrings } from '../help/helpStrings';
import { RequestTime } from './RequestTime';
import type { StaffStrings } from './staffStrings';
import { formatClock, useNow } from './time';
import { useFeedback } from './useFeedback';
import './staff.css';

const COMMENTS_PREVIEW = 3;

/**
 * Staff view of visitor feedback: average, count per rating and the latest comments.
 * Rating labels come from the visitor Help page strings so both sides use the same words.
 */
export function StaffFeedbackSummary({ strings }: { strings: StaffStrings }) {
  const t = strings.feedback;
  const ratingOptions = getHelpStrings().feedback.ratings;
  const now = useNow();
  const { items, phase, refreshing, error, lastUpdated, refresh } = useFeedback();
  const [showAll, setShowAll] = useState(false);

  const stats = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    for (const item of items) {
      counts[item.rating] += 1;
      total += item.rating;
    }
    const average = items.length ? total / items.length : 0;
    const max = Math.max(1, ...Object.values(counts));
    return { counts, average, max };
  }, [items]);

  const comments = useMemo(() => items.filter((item) => item.comment.trim()), [items]);
  const visibleComments = showAll ? comments : comments.slice(0, COMMENTS_PREVIEW);
  const averageText = new Intl.NumberFormat(strings.locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(
    stats.average,
  );
  const ratingFor = (value: number) => ratingOptions.find((option) => option.value === value);

  return (
    <div className="staff-summary">
      <p className="staff-feedback__intro">{t.intro}</p>

      <div className="staff-feedback__toolbar">
        <button
          type="button"
          className="btn staff-btn staff-btn--secondary"
          onClick={refresh}
          aria-disabled={refreshing || undefined}
        >
          {refreshing && phase !== 'loading' ? t.refreshing : t.refresh}
        </button>
        <p className="staff-muted staff-updated" role="status">
          {phase === 'ready' && lastUpdated && !refreshing ? t.updated(formatClock(lastUpdated, strings.locale)) : ''}
        </p>
      </div>

      {phase === 'loading' && (
        <p className="staff-state" role="status">
          {t.loading}
        </p>
      )}

      {(phase === 'error' || (phase === 'ready' && error)) && (
        <div className="staff-alert staff-alert--error" role="alert">
          <p>
            <span aria-hidden="true">⚠ </span>
            {phase === 'error'
              ? `${t.loadFailed} ${error ? strings.serviceErrors[error] : ''}`
              : t.refreshFailed(error ? strings.serviceErrors[error] : '')}
          </p>
          <button type="button" className="btn staff-btn" onClick={refresh}>
            {t.retry}
          </button>
        </div>
      )}

      {phase === 'ready' && items.length === 0 && <p className="staff-state">{t.noFeedback}</p>}

      {phase === 'ready' && items.length > 0 && (
        <>
          <p className="staff-feedback__average">
            <span className="staff-feedback__average-number" aria-hidden="true">
              {averageText}
            </span>
            <span>{t.average(averageText, items.length)}</span>
          </p>
          <p className="staff-muted staff-feedback__question">{t.question}</p>

          <ul className="staff-feedback__bars" aria-label={t.ratingsLabel}>
            {[5, 4, 3, 2, 1].map((value) => {
              const option = ratingFor(value);
              const count = stats.counts[value];
              return (
                <li key={value} className="staff-feedback__bar-row">
                  <span className="staff-feedback__bar-label">
                    <span aria-hidden="true">{option?.icon} </span>
                    {option?.label}
                    <span className="staff-visually-hidden">:</span>
                  </span>
                  <span className="staff-feedback__bar-track" aria-hidden="true">
                    <span className="staff-feedback__bar-fill" style={{ width: `${(count / stats.max) * 100}%` }} />
                  </span>
                  <span className="staff-feedback__bar-count">{t.ratingCount(count)}</span>
                </li>
              );
            })}
          </ul>

          <h3 className="staff-summary__heading">{t.commentsHeading}</h3>
          {comments.length === 0 ? (
            <p className="staff-state">{t.noComments}</p>
          ) : (
            <>
              <ul className="staff-recent" id="staff-feedback-comments">
                {visibleComments.map((item) => {
                  const option = ratingFor(item.rating);
                  return (
                    <li key={item.id} className="staff-recent__item">
                      <div className="staff-recent__top">
                        <span className="staff-feedback__rating">
                          <span aria-hidden="true">{option?.icon} </span>
                          {option?.label} ({t.outOfFive(item.rating)})
                        </span>
                      </div>
                      <p className="staff-feedback__comment">{item.comment}</p>
                      <RequestTime iso={item.createdAt} now={now} strings={strings} />
                    </li>
                  );
                })}
              </ul>
              {comments.length > COMMENTS_PREVIEW && (
                <button
                  type="button"
                  className="btn staff-btn staff-btn--secondary"
                  aria-expanded={showAll}
                  aria-controls="staff-feedback-comments"
                  onClick={() => setShowAll((value) => !value)}
                >
                  {showAll ? t.showFewer : t.showAll(comments.length)}
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
