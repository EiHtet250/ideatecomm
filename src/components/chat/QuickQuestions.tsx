import { useId } from 'react';
import type { ChatStrings } from './chatStrings';
import './chat.css';

interface QuickQuestionsProps {
  strings: ChatStrings['quick'];
  pending: boolean;
  onAsk: (question: string) => void;
}

/** One-tap questions so visitors do not have to type. */
export function QuickQuestions({ strings, pending, onAsk }: QuickQuestionsProps) {
  const headingId = useId();

  return (
    <section className="chat-quick" aria-labelledby={headingId}>
      <h2 id={headingId} className="chat-quick__heading">
        {strings.heading}
      </h2>
      <p className="chat-quick__hint">{strings.hint}</p>
      <ul className="chat-quick__list">
        {strings.questions.map((question) => (
          <li key={question}>
            <button
              type="button"
              className="btn chat-btn chat-btn--secondary"
              aria-disabled={pending || undefined}
              onClick={() => {
                if (!pending) onAsk(question);
              }}
            >
              {question}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
