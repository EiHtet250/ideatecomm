import { Link } from 'react-router-dom';
import { PagePlaceholder } from '../../components';
import { countByStatus, useHelpRequests } from '../../components/help/useHelpRequests';
import { FeedbackRating, FeedbackStats } from '../../components/staff/FeedbackStats';
import { feedbackArrivalText, helpArrivalText, NewArrivalNotice } from '../../components/staff/NewArrivalNotice';
import { RequestTime } from '../../components/staff/RequestTime';
import { STATUS_ICONS, STATUS_ORDER, StatusBadge } from '../../components/staff/StatusBadge';
import { getStaffStrings } from '../../components/staff/staffStrings';
import { useNow } from '../../components/staff/time';
import { useFeedback } from '../../components/staff/useFeedback';
import { useSettings } from '../../components/settings/SettingsProvider';
import { paths } from '../../routes/paths';
import '../../components/staff/staff.css';
import './staffHome.css';

const RECENT_REQUESTS = 4;
const RECENT_COMMENTS = 3;

/**
 * Staff dashboard.
 *   1. Summary strip: help request counts by status.
 *   2. Two columns: the newest help requests (wide) beside visitor feedback (narrow).
 * Uses the same data hooks as the Help Requests and Visitor Feedback pages.
 */
export function StaffHomePage() {
  const { currentLanguage } = useSettings();
  const strings = getStaffStrings(currentLanguage);
  const t = strings.home;
  const now = useNow();

  const requests = useHelpRequests();
  const counts = countByStatus(requests.items);
  const recentRequests = requests.items.slice(0, RECENT_REQUESTS);

  const feedback = useFeedback();
  const recentComments = feedback.items.filter((item) => item.comment.trim()).slice(0, RECENT_COMMENTS);

  const requestsFailed = requests.phase === 'error' || (requests.phase === 'ready' && requests.refreshError);
  const feedbackFailed = feedback.phase === 'error' || (feedback.phase === 'ready' && feedback.refreshError);

  return (
    <PagePlaceholder title={t.title} description={t.description}>
      <div className="sh">
        {/* 1. Summary strip */}
        <section className="home-card sh-strip" aria-labelledby="sh-requests-title">
          <header className="sh-head">
            <h2 id="sh-requests-title">{t.requestsHeading}</h2>
            <Link to={paths.helpRequests} className="home-card__link staff-link">
              {t.viewAll}
            </Link>
          </header>

          <NewArrivalNotice text={helpArrivalText(requests.newArrivals, strings)} />

          {requests.phase === 'loading' && (
            <p className="staff-state" role="status">
              {strings.list.loading}
            </p>
          )}

          {requestsFailed && (
            <div className="staff-alert staff-alert--error" role="alert">
              <p>
                <span aria-hidden="true">⚠ </span>
                {requests.phase === 'error'
                  ? `${strings.list.loadFailed} ${requests.refreshError ? strings.serviceErrors[requests.refreshError] : ''}`
                  : strings.list.refreshFailed(requests.refreshError ? strings.serviceErrors[requests.refreshError] : '')}
              </p>
              <button type="button" className="btn staff-btn" onClick={requests.retry}>
                {strings.list.retry}
              </button>
            </div>
          )}

          {requests.phase === 'ready' && (
            <ul className="staff-counts sh-counts" aria-label={t.countsLabel}>
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
          )}
        </section>

        <div className="sh-columns">
          {/* 2a. Newest help requests */}
          <section className="home-card sh-panel" aria-labelledby="sh-recent-title">
            <h2 id="sh-recent-title">{t.recentHeading}</h2>
            {requests.phase === 'ready' &&
              (recentRequests.length === 0 ? (
                <p className="staff-state">{t.noRecent}</p>
              ) : (
                <ul className="staff-recent sh-recent">
                  {recentRequests.map((request) => (
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
              ))}
            {requests.phase === 'loading' && (
              <p className="staff-state" role="status">
                {strings.list.loading}
              </p>
            )}
          </section>

          {/* 2b. Visitor feedback */}
          <section className="home-card sh-panel" aria-labelledby="sh-feedback-title">
            <header className="sh-head">
              <h2 id="sh-feedback-title">{strings.feedback.heading}</h2>
              <Link to={paths.visitorFeedback} className="home-card__link staff-link">
                {strings.feedback.viewAll}
              </Link>
            </header>

            <NewArrivalNotice text={feedbackArrivalText(feedback.newArrivals, strings)} />

            {feedback.phase === 'loading' && (
              <p className="staff-state" role="status">
                {strings.feedback.loading}
              </p>
            )}

            {feedbackFailed && (
              <div className="staff-alert staff-alert--error" role="alert">
                <p>
                  <span aria-hidden="true">⚠ </span>
                  {feedback.phase === 'error'
                    ? `${strings.feedback.loadFailed} ${feedback.refreshError ? strings.serviceErrors[feedback.refreshError] : ''}`
                    : strings.feedback.refreshFailed(feedback.refreshError ? strings.serviceErrors[feedback.refreshError] : '')}
                </p>
                <button type="button" className="btn staff-btn" onClick={feedback.retry}>
                  {strings.feedback.retry}
                </button>
              </div>
            )}

            {feedback.phase === 'ready' && feedback.items.length === 0 && <p className="staff-state">{strings.feedback.noFeedback}</p>}

            {feedback.phase === 'ready' && feedback.items.length > 0 && (
              <>
                <FeedbackStats items={feedback.items} strings={strings} />
                <h3 className="staff-summary__heading">{strings.feedback.recentHeading}</h3>
                {recentComments.length === 0 ? (
                  <p className="staff-state">{strings.feedback.noComments}</p>
                ) : (
                  <ul className="staff-recent">
                    {recentComments.map((item) => (
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
          </section>
        </div>
      </div>
    </PagePlaceholder>
  );
}
