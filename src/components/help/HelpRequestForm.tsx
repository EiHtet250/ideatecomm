import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { createHelpRequest, isN8nServiceError } from '../../services/n8nClient';
import type { HelpRequest } from '../../types';
import type { AreaSource } from '../../types/help';
import { CharacterCount } from './CharacterCount';
import { getAreaOptions } from './helpAreas';
import type { HelpStrings } from './helpStrings';
import { EMERGENCY_NUMBERS, MINT_CONTACT } from './mintContact';
import './help.css';

const DESCRIPTION_MAX = 500;
const AREA_MAX = 100;
const NOTE_MAX = 60;
const LAST_SCANNED_VALUE = '__lastScanned__';

type Phase = 'idle' | 'submitting' | 'success' | 'error';

interface FieldErrors {
  area?: string;
  note?: string;
  description?: string;
}

interface HelpRequestFormProps {
  strings: HelpStrings;
  /**
   * Area from the visitor's last QR scan, if another feature provides it.
   * When set it is preselected and sent with areaSource "lastScanned".
   */
  lastScannedArea?: string;
}

export function HelpRequestForm({ strings, lastScannedArea }: HelpRequestFormProps) {
  const t = strings.request;
  const uid = useId();
  const ids = {
    area: `${uid}-area`,
    areaHint: `${uid}-area-hint`,
    areaError: `${uid}-area-error`,
    note: `${uid}-note`,
    noteHint: `${uid}-note-hint`,
    noteError: `${uid}-note-error`,
    description: `${uid}-description`,
    descriptionHint: `${uid}-description-hint`,
    descriptionCount: `${uid}-description-count`,
    descriptionError: `${uid}-description-error`,
  };

  const scanned = lastScannedArea?.trim().slice(0, AREA_MAX) || undefined;
  const areaOptions = useMemo(() => getAreaOptions(t), [t]);

  const [areaChoice, setAreaChoice] = useState(scanned ? LAST_SCANNED_VALUE : '');
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [serviceMessage, setServiceMessage] = useState('');
  const [result, setResult] = useState<HelpRequest | null>(null);

  const submittingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const areaRef = useRef<HTMLSelectElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (phase === 'success') successHeadingRef.current?.focus();
    if (phase === 'error') errorRef.current?.focus();
  }, [phase]);

  const baseArea = areaChoice === LAST_SCANNED_VALUE ? (scanned ?? '') : areaChoice;
  const areaSource: AreaSource = areaChoice === LAST_SCANNED_VALUE ? 'lastScanned' : 'manual';
  const noteMax = Math.max(0, Math.min(NOTE_MAX, AREA_MAX - baseArea.length - 3));
  const trimmedNote = note.trim();
  const trimmedDescription = description.trim();

  const errors: FieldErrors = {};
  if (!baseArea) errors.area = t.errors.areaRequired;
  if ([...trimmedNote].length > noteMax) errors.note = t.errors.noteTooLong(noteMax);
  if (!trimmedDescription) errors.description = t.errors.descriptionRequired;
  else if ([...trimmedDescription].length > DESCRIPTION_MAX) errors.description = t.errors.descriptionTooLong;
  const visibleErrors = showErrors ? errors : {};

  const describedBy = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ') || undefined;

  async function submit() {
    if (submittingRef.current) return; // prevent double submission
    setShowErrors(true);

    if (errors.area) return areaRef.current?.focus();
    if (errors.note) return noteRef.current?.focus();
    if (errors.description) return descriptionRef.current?.focus();

    submittingRef.current = true;
    setPhase('submitting');
    setServiceMessage('');
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const created = await createHelpRequest(
        {
          area: trimmedNote ? `${baseArea} - ${trimmedNote}` : baseArea,
          areaSource,
          description: trimmedDescription,
        },
        controller.signal,
      );
      setResult(created);
      setPhase('success');
    } catch (error) {
      if (isN8nServiceError(error) && error.code === 'ABORTED') return;
      const code = isN8nServiceError(error) ? error.code : 'SERVER';
      const message =
        code === 'VALIDATION' && isN8nServiceError(error) && error.message ? error.message : strings.serviceErrors[code];
      setServiceMessage(message);
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
    setAreaChoice(scanned ? LAST_SCANNED_VALUE : '');
    setNote('');
    setDescription('');
    setShowErrors(false);
    setServiceMessage('');
    setResult(null);
    setPhase('idle');
    window.setTimeout(() => areaRef.current?.focus(), 0);
  }

  if (phase === 'success' && result) {
    return (
      <div className="help-alert help-alert--success" role="status">
        <h3 className="help-alert__title" ref={successHeadingRef} tabIndex={-1}>
          <span aria-hidden="true">✓ </span>
          {t.successHeading}
        </h3>
        <p className="help-reference">
          {t.referenceLabel}: <strong>{result.id}</strong>
        </p>
        <h4 className="help-subheading">{t.nextStepsHeading}</h4>
        <ul className="help-list">
          {t.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
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
      <p className="help-alert help-alert--info">
        <span aria-hidden="true">ℹ </span>
        {t.sharedNotice}
      </p>
      <p className="help-text help-text--strong">
        {t.emergencyNote} {t.emergencyCall}{' '}
        <a href={EMERGENCY_NUMBERS.ambulanceFire.href}>{EMERGENCY_NUMBERS.ambulanceFire.display}</a>{' '}
        {strings.safety.ambulanceFire} {strings.safety.or}{' '}
        <a href={EMERGENCY_NUMBERS.police.href}>{EMERGENCY_NUMBERS.police.display}</a> {strings.safety.police}.
      </p>

      {phase === 'error' && (
        <div className="help-alert help-alert--error" role="alert" ref={errorRef} tabIndex={-1}>
          <p className="help-alert__title">
            <span aria-hidden="true">⚠ </span>
            {t.failedHeading}
          </p>
          <p>
            {serviceMessage} {t.failedKeepText}
          </p>
          <p>
            {t.callInstead} <a href={MINT_CONTACT.phoneHref}>{MINT_CONTACT.phoneDisplay}</a>.
          </p>
          <button type="button" className="btn help-btn" onClick={() => void submit()}>
            {t.retry}
          </button>
        </div>
      )}

      <div className="form-field">
        <label htmlFor={ids.area} className="form-field__label">
          {t.areaLabel}
        </label>
        <span id={ids.areaHint} className="form-field__hint">
          {t.areaHint}
        </span>
        <select
          id={ids.area}
          ref={areaRef}
          className="form-field__input help-input"
          value={areaChoice}
          onChange={(e) => setAreaChoice(e.target.value)}
          aria-invalid={visibleErrors.area ? true : undefined}
          aria-describedby={describedBy(ids.areaHint, visibleErrors.area && ids.areaError)}
        >
          <option value="">{t.areaChoose}</option>
          {scanned && <option value={LAST_SCANNED_VALUE}>{t.areaLastScanned(scanned)}</option>}
          {areaOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {visibleErrors.area && (
          <p id={ids.areaError} className="help-field-error">
            <span aria-hidden="true">⚠ </span>
            {visibleErrors.area}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor={ids.note} className="form-field__label">
          {t.noteLabel}
        </label>
        <span id={ids.noteHint} className="form-field__hint">
          {t.noteHint}
        </span>
        <input
          id={ids.note}
          ref={noteRef}
          type="text"
          className="form-field__input help-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          autoComplete="off"
          aria-invalid={visibleErrors.note ? true : undefined}
          aria-describedby={describedBy(ids.noteHint, visibleErrors.note && ids.noteError)}
        />
        {visibleErrors.note && (
          <p id={ids.noteError} className="help-field-error">
            <span aria-hidden="true">⚠ </span>
            {visibleErrors.note}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor={ids.description} className="form-field__label">
          {t.descriptionLabel}
        </label>
        <span id={ids.descriptionHint} className="form-field__hint">
          {t.descriptionHint}
        </span>
        <textarea
          id={ids.description}
          ref={descriptionRef}
          className="form-field__input help-input help-textarea"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={visibleErrors.description ? true : undefined}
          aria-describedby={describedBy(
            ids.descriptionHint,
            ids.descriptionCount,
            visibleErrors.description && ids.descriptionError,
          )}
        />
        <CharacterCount
          id={ids.descriptionCount}
          length={[...description.trim()].length}
          max={DESCRIPTION_MAX}
          format={t.charactersLeft}
        />
        {visibleErrors.description && (
          <p id={ids.descriptionError} className="help-field-error">
            <span aria-hidden="true">⚠ </span>
            {visibleErrors.description}
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
