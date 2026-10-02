import type { FeedbackEntry } from '../../types/help';
import type { StaffStrings } from './staffStrings';
import { averageRating, countByRating } from './useFeedback';
import './staff.css';

/** The five star-rating options, localized for the current staff language. */
export function feedbackRatingOptions(strings: StaffStrings) {
  return strings.feedback.ratings;
}

/** Rating as star + text, e.g. "★ 4 stars (4 out of 5)". */
export function FeedbackRating({ rating, strings }: { rating: number; strings: StaffStrings }) {
  const option = feedbackRatingOptions(strings).find((o) => o.value === rating);
  return (
    <span className="staff-feedback__rating">
      <span aria-hidden="true">{option?.icon} </span>
      {option?.label ?? rating} ({strings.feedback.outOfFive(rating)})
    </span>
  );
}

/** Average rating and a count for each rating (bars are decorative; counts are text). */
export function FeedbackStats({ items, strings }: { items: FeedbackEntry[]; strings: StaffStrings }) {
  const t = strings.feedback;
  const counts = countByRating(items);
  const max = Math.max(1, ...Object.values(counts));
  const averageText = new Intl.NumberFormat(strings.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
    averageRating(items),
  );

  return (
    <div className="staff-feedback__stats">
      <p className="staff-feedback__average">
        <span className="staff-feedback__average-number" aria-hidden="true">
          {averageText}
        </span>
        <span>{t.average(averageText, items.length)}</span>
      </p>
      <p className="staff-muted staff-feedback__question">{t.question}</p>
      <ul className="staff-feedback__bars" aria-label={t.ratingsLabel}>
        {[...feedbackRatingOptions(strings)].reverse().map((option) => {
          const count = counts[option.value] ?? 0;
          return (
            <li key={option.value} className="staff-feedback__bar-row">
              <span className="staff-feedback__bar-label">
                <span aria-hidden="true">{option.icon} </span>
                {option.label}
                <span className="staff-visually-hidden">:</span>
              </span>
              <span className="staff-feedback__bar-track" aria-hidden="true">
                <span className="staff-feedback__bar-fill" style={{ width: `${(count / max) * 100}%` }} />
              </span>
              <span className="staff-feedback__bar-count">{count}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
