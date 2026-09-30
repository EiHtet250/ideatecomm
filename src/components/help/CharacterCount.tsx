import { useEffect, useState } from 'react';
import './help.css';

interface CharacterCountProps {
  /** Put this id in the field's aria-describedby. */
  id: string;
  length: number;
  max: number;
  /** e.g. (n) => `${n} characters left` (negative n means over the limit). */
  format: (remaining: number) => string;
}

/**
 * Visible character counter. Screen readers get a polite update about 1 second after
 * typing stops, and only when close to the limit, so it is not announced on every key.
 */
export function CharacterCount({ id, length, max, format }: CharacterCountProps) {
  const remaining = max - length;
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnnouncement(remaining <= Math.min(50, max / 5) ? format(remaining) : '');
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [remaining, max, format]);

  return (
    <>
      <p id={id} className={`help-count${remaining < 0 ? ' help-count--over' : ''}`}>
        {remaining < 0 && <span aria-hidden="true">⚠ </span>}
        {format(remaining)}
      </p>
      <p className="help-visually-hidden" aria-live="polite">
        {announcement}
      </p>
    </>
  );
}
