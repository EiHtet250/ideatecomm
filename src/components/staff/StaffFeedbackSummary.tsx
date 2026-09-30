import { Link } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { FeedbackRating, FeedbackStats } from './FeedbackStats';
import { feedbackArrivalText, NewArrivalNotice } from './NewArrivalNotice';
import { RequestTime } from './RequestTime';
import type { StaffStrings } from './staffStrings';
import { useNow } from './time';
import { useFeedback } from './useFeedback';
import './staff.css';

const RECENT_COMMENTS = 3;

/** Staff Home card: average, count per rating and the 3 latest comments. Same hook as the Visitor Feedback page. */
export function StaffFeedbackSummary({ strings }: { strings: StaffStrings }) {
  const t = strings.feedback;
  const now = useNow();
  const { items, phase, refreshError, newArrivals, retry } = useFeedback();
  const recent = items.filter((item) => item.comment.trim()).slice(0, RECENT_COMMENTS);

  return (
    <div className="staff-summary">
      <NewArrivalNotice text={feedbackArrivalText(newArrivals, strings)} />

      {phase === 'loading' && (
        <p className="staff-state" role="status">
          {t.loading}
        </p>
      )}

      {(phase === 'error' || (phase === 'ready' && refreshError)) && (
        <div className="staff-alert staff-alert--error" role="alert">
          <p>
            <span aria-hidden="true">⚠ </span>
            {phase === 'error'
              ? `${t.loadFailed} ${refreshError ? strings.serviceErrors[refreshError] : ''}`
              : t.refreshFailed(refreshError ? strings.serviceErrors[refreshError] : '')}
          </p>
          <button type="button" className="btn staff-btn" onClick={retry}>
            {t.retry}
          </button>
        </div>
      )}

      {phase === 'ready' && items.length === 0 && <p className="staff-state">{t.noFeedback}</p>}

      {phase === 'ready' && items.length > 0 && (
        <>
          <FeedbackStats items={items} strings={strings} />
          <h3 className="staff-summary__heading">{t.recentHeading}</h3>
          {recent.length === 0 ? (
            <p className="staff-state">{t.noComments}</p>
          ) : (
            <ul className="staff-recent">
              {recent.map((item) => (
                <li key={item.id} className="staff-recent__item">
                  <div className="staff-recent__top">
                    <FeedbackRating rating={item.rating} strings={strings} />
                  </div>
                  <p className="staff-feedback__comment staff-feedback__comment--clamp">{item.comment}</p>
                  <RequestTime iso={item.createdAt} now={now} strings={strings} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Link to={paths.visitorFeedback} className="home-card__link staff-link">
        {t.viewAll}
      </Link>
    </div>
  );
}
