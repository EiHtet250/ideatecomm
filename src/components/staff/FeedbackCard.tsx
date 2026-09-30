import { useId } from 'react';
import type { FeedbackEntry } from '../../types/help';
import { FeedbackRating } from './FeedbackStats';
import { RequestTime } from './RequestTime';
import type { StaffStrings } from './staffStrings';
import './staff.css';

interface FeedbackCardProps {
  entry: FeedbackEntry;
  strings: StaffStrings;
  now: number;
  fresh: boolean;
}

/** One feedback entry, laid out like a Help Requests card (read-only: feedback has no status). */
export function FeedbackCard({ entry, strings, now, fresh }: FeedbackCardProps) {
  const t = strings.feedbackPage;
  const titleId = `${useId()}-title`;
  const comment = entry.comment.trim();

  return (
    <article className={`staff-card${fresh ? ' staff-card--fresh' : ''}`} aria-labelledby={titleId}>
      <header className="staff-card__header">
        <h3 id={titleId} className="staff-card__title">
          {t.feedbackLabel(entry.id)}
        </h3>
      </header>

      <dl className="staff-card__details">
        <div>
          <dt>{t.ratingLabel}</dt>
          <dd>
            <FeedbackRating rating={entry.rating} strings={strings} />
          </dd>
        </div>
        <div>
          <dt>{t.commentLabel}</dt>
          <dd className={comment ? 'staff-card__message' : 'staff-card__message staff-muted'}>
            {comment || t.noComment}
          </dd>
        </div>
        <div>
          <dt>{t.sentLabel}</dt>
          <dd>
            <RequestTime iso={entry.createdAt} now={now} strings={strings} />
          </dd>
        </div>
      </dl>
    </article>
  );
}
