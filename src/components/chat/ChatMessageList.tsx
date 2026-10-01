import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { MINT_CONTACT } from '../help/mintContact';
import type { ChatStrings } from './chatStrings';
import type { ChatFailure, ChatMessage } from './useChat';
import './chat.css';

interface ChatMessageListProps {
  strings: ChatStrings;
  messages: ChatMessage[];
  pending: boolean;
  failure: ChatFailure | null;
  onRetry: () => void;
}

/**
 * Marks Chinese and Tamil text so screen readers use the right voice.
 * Malay and English share the Latin script, so they are left unmarked.
 */
function guessLang(text: string): string | undefined {
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
  if (/[\u0b80-\u0bff]/.test(text)) return 'ta';
  return undefined;
}

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Chat transcript. role="log" + aria-live="polite" so screen readers announce new
 * messages, the "Thinking..." indicator and errors. All text is rendered as plain text.
 */
export function ChatMessageList({ strings, messages, pending, failure, onRetry }: ChatMessageListProps) {
  const t = strings.log;
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [messages.length, pending, failure]);

  return (
    <div
      ref={listRef}
      className="chat-log"
      role="log"
      aria-live="polite"
      aria-label={t.label}
      // Scrollable region must be reachable by keyboard.
      tabIndex={0}
    >
      <ol className="chat-log__list">
        <li className="chat-msg chat-msg--bot">
          <span className="chat-msg__speaker">{t.bot}</span>
          <p className="chat-msg__text">{t.welcome}</p>
          <p className="chat-msg__text">
            {t.languagesIntro}{' '}
            {t.languages.map((language, index) => (
              <span key={language.lang}>
                <span lang={language.lang}>{language.name}</span>
                {index < t.languages.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </p>
        </li>

        {messages.map((message) =>
          message.role === 'visitor' ? (
            <li key={message.id} className="chat-msg chat-msg--visitor">
              <span className="chat-msg__speaker">{t.you}</span>
              <p className="chat-msg__text" lang={guessLang(message.text)}>
                {message.text}
              </p>
            </li>
          ) : (
            <li key={message.id} className="chat-msg chat-msg--bot">
              <span className="chat-msg__speaker">{t.bot}</span>
              <p className="chat-msg__text" lang={guessLang(message.text)}>
                {message.text}
              </p>
              {message.suggestStaff && (
                <Link to={paths.help} className="btn chat-btn chat-btn--secondary">
                  {t.askStaff}
                </Link>
              )}
            </li>
          ),
        )}

        {pending && (
          <li className="chat-msg chat-msg--bot chat-msg--thinking">
            <span className="chat-msg__speaker">{t.bot}</span>
            <p className="chat-msg__text">
              <span className="chat-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>{' '}
              {t.thinking}
            </p>
          </li>
        )}

        {failure && !pending && (
          <li className="chat-msg chat-msg--error">
            <p className="chat-msg__title">
              <span aria-hidden="true">⚠ </span>
              {strings.failure.heading}
            </p>
            <p className="chat-msg__text">
              {failure.code === 'VALIDATION' && failure.message ? failure.message : strings.failure.reasons[failure.code]}
            </p>
            <p className="chat-msg__text">{strings.failure.stillHelp}</p>
            <ul className="chat-fallback">
              <li>
                {strings.failure.call}: <a href={MINT_CONTACT.phoneHref}>{MINT_CONTACT.phoneDisplay}</a>
              </li>
              <li>
                {strings.failure.email}: <a href={MINT_CONTACT.emailHref}>{MINT_CONTACT.email}</a>
              </li>
              <li>
                <Link to={paths.help}>{strings.failure.helpPage}</Link>
              </li>
            </ul>
            {failure.code !== 'VALIDATION' && failure.code !== 'CONFIG' && (
              <button type="button" className="btn chat-btn" onClick={onRetry}>
                {strings.failure.retry}
              </button>
            )}
          </li>
        )}
      </ol>
    </div>
  );
}
