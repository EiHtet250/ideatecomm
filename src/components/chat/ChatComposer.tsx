import { forwardRef, useId, useState, type FormEvent, type KeyboardEvent } from 'react';
import { CharacterCount } from '../help/CharacterCount';
import type { ChatStrings } from './chatStrings';
import './chat.css';

export const CHAT_MAX_LENGTH = 500;

interface ChatComposerProps {
  strings: ChatStrings['composer'];
  pending: boolean;
  /** Returns true when the message was accepted. */
  onSend: (text: string) => boolean;
}

/** Message box. Enter sends, Shift+Enter adds a new line. */
export const ChatComposer = forwardRef<HTMLTextAreaElement, ChatComposerProps>(function ChatComposer(
  { strings, pending, onSend },
  ref,
) {
  const uid = useId();
  const ids = { input: `${uid}-input`, hint: `${uid}-hint`, count: `${uid}-count`, error: `${uid}-error` };
  const [text, setText] = useState('');

  const length = [...text.trim()].length;
  const tooLong = length > CHAT_MAX_LENGTH;
  const cannotSend = pending || length === 0 || tooLong;

  function submit() {
    if (cannotSend) return;
    if (onSend(text)) setText('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Do not send while an input method (e.g. Chinese pinyin) is still composing.
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form className="chat-composer" onSubmit={handleSubmit} aria-busy={pending}>
      <div className="form-field">
        <label htmlFor={ids.input} className="form-field__label">
          {strings.label}
        </label>
        <span id={ids.hint} className="form-field__hint">
          {strings.hint}
        </span>
        <div className="chat-composer__row">
          <textarea
            id={ids.input}
            ref={ref}
            className="form-field__input chat-input"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-invalid={tooLong || undefined}
            aria-describedby={[ids.hint, ids.count, tooLong && ids.error].filter(Boolean).join(' ')}
          />
          <button
            type="submit"
            className="btn chat-btn chat-composer__send"
            aria-disabled={cannotSend || undefined}
          >
            {pending ? strings.sending : strings.send}
          </button>
        </div>
        <CharacterCount id={ids.count} length={length} max={CHAT_MAX_LENGTH} format={strings.charactersLeft} />
        {tooLong && (
          <p id={ids.error} className="chat-field-error">
            <span aria-hidden="true">⚠ </span>
            {strings.tooLong}
          </p>
        )}
      </div>
    </form>
  );
});
