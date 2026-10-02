import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { isN8nServiceError, submitFeedback } from '../../services/n8nClient';
import type { NewFeedback } from '../../types/help';
import { CharacterCount } from './CharacterCount';
import type { HelpStrings } from './helpStrings';
import './help.css';

const COMMENT_MAX = 500;

type Phase = 'idle' | 'submitting' | 'success' | 'error';
type Rating = NewFeedback['rating'];

/** Optional, anonymous feedback: a 1 to 5 star rating and an optional comment. */
export function FeedbackForm({ strings }: { strings: HelpStrings }) {
  const t = strings.feedback;
  const uid = useId();
  const ids = {
    legend: `${uid}-legend`,
    ratingHint: `${uid}-rating-hint`,
    ratingError: `${uid}-rating-error`,
    comment: `${uid}-comment`,
    commentHint: `${uid}-comment-hint`,
    commentCount: `${uid}-comment-count`,
    commentError: `${uid}-comment-error`,
  };

  const [rating, setRating] = useState<Rating | null>(null);
  const [comment, setComment] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [serviceMessage, setServiceMessage] = useState('');

  const submittingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const firstRadioRef = useRef<HTMLInputElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    if (phase === 'success') successRef.current?.focus();
    if (phase === 'error') errorRef.current?.focus();
  }, [phase]);

  const trimmed = comment.trim();
  const commentLength = [...trimmed].length;
  const errors = {
    rating: rating === null ? t.errors.ratingRequired : undefined,
    comment: commentLength > COMMENT_MAX ? t.errors.commentTooLong : undefined,
  };
  const visible = showErrors ? errors : { rating: undefined, comment: undefined };

  async function submit() {
    if (submittingRef.current) return;
    setShowErrors(true);
    if (errors.rating || rating === null) return firstRadioRef.current?.focus();
    if (errors.comment) return commentRef.current?.focus();

    submittingRef.current = true;
    setPhase('submitting');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await submitFeedback({ rating, comment: trimmed }, controller.signal);
      setPhase('success');
    } catch (error) {
      if (isN8nServiceError(error) && error.code === 'ABORTED') return;
      const code = isN8nServiceError(error) ? error.code : 'SERVER';
      setServiceMessage(
        code === 'VALIDATION' && isN8nServiceError(error) && error.message ? error.message : strings.serviceErrors[code],
      );
      setPhase('error');
    } finally {
      submittingRef.current = false;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit();
  }

  function reset() {
    setRating(null);
    setComment('');
    setShowErrors(false);
    setServiceMessage('');
    setPhase('idle');
    window.setTimeout(() => firstRadioRef.current?.focus(), 0);
  }

  if (phase === 'success') {
    return (
      <div className="help-alert help-alert--success" role="status">
        <h3 className="help-alert__title" ref={successRef} tabIndex={-1}>
          <span aria-hidden="true">✓ </span>
          {t.successHeading}
        </h3>
        <p>{t.successText}</p>
        <button type="button" className="btn help-btn help-btn--secondary" onClick={reset}>
          {t.sendAnother}
        </button>
      </div>
    );
  }

  const submitting = phase === 'submitting';

  return (
    <form className="help-form" onSubmit={handleSubmit} noValidate aria-busy={submitting}>
      <p className="help-text">{t.intro}</p>

      {phase === 'error' && (
        <div className="help-alert help-alert--error" role="alert" ref={errorRef} tabIndex={-1}>
          <p className="help-alert__title">
            <span aria-hidden="true">⚠ </span>
            {t.failedHeading}
          </p>
          <p>{serviceMessage}</p>
          <button type="button" className="btn help-btn" onClick={() => void submit()}>
            {t.retry}
          </button>
        </div>
      )}

      <fieldset
        className="help-rating"
        aria-describedby={[ids.ratingHint, visible.rating ? ids.ratingError : null].filter(Boolean).join(' ')}
        aria-invalid={visible.rating ? true : undefined}
      >
        <legend id={ids.legend} className="form-field__label">
          {t.ratingLegend}
        </legend>
        <span id={ids.ratingHint} className="form-field__hint">
          {t.ratingHint}
        </span>
        <div className="help-stars">
          {t.ratings.map((option, index) => {
            const filled = rating !== null && option.value <= rating;
            return (
              <label key={option.value} className="help-stars__option">
                <input
                  ref={index === 0 ? firstRadioRef : undefined}
                  type="radio"
                  name={`${uid}-rating`}
                  value={option.value}
                  checked={rating === option.value}
                  onChange={() => setRating(option.value)}
                />
                <span className="help-stars__star" aria-hidden="true">
                  {filled ? '★' : '☆'}
                </span>
                <span className="help-visually-hidden">{t.starLabel(option.value)}</span>
              </label>
            );
          })}
        </div>
        <p className="help-stars__value" aria-live="polite">
          {rating === null ? t.ratingNone : t.ratingSelected(rating)}
        </p>
        {visible.rating && (
          <p id={ids.ratingError} className="help-field-error">
            <span aria-hidden="true">⚠ </span>
            {visible.rating}
          </p>
        )}
      </fieldset>

      <div className="form-field">
        <label htmlFor={ids.comment} className="form-field__label">
          {t.commentLabel}
        </label>
        <span id={ids.commentHint} className="form-field__hint">
          {t.commentHint}
        </span>
        <textarea
          id={ids.comment}
          ref={commentRef}
          className="form-field__input help-input help-textarea"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          aria-invalid={visible.comment ? true : undefined}
          aria-describedby={[ids.commentHint, ids.commentCount, visible.comment && ids.commentError]
            .filter(Boolean)
            .join(' ')}
        />
        <CharacterCount
          id={ids.commentCount}
          length={commentLength}
          max={COMMENT_MAX}
          format={strings.request.charactersLeft}
        />
        {visible.comment && (
          <p id={ids.commentError} className="help-field-error">
            <span aria-hidden="true">⚠ </span>
            {visible.comment}
          </p>
        )}
      </div>

      <button type="submit" className="btn help-btn" aria-disabled={submitting || undefined}>
        {submitting ? t.submitting : t.submit}
      </button>
      <p className="help-visually-hidden" aria-live="polite">
        {submitting ? t.submitting : ''}
      </p>
    </form>
  );
}
