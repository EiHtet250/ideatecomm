import { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FaqStrings } from './faqContent';
import './help.css';

/**
 * FAQ as native <details>/<summary> accordions. Native elements give keyboard support
 * (Enter and Space), focusable summaries and the open/closed state for free.
 * Open state is shown with the ▸/▾ marker AND the native state, never colour alone.
 */
export function FaqSection({ strings }: { strings: FaqStrings }) {
  const headingId = useId();
  // Bump this to force all <details> to a new open/closed value when Expand/Collapse all is used.
  const [allKey, setAllKey] = useState(0);
  const [allOpen, setAllOpen] = useState<boolean | undefined>(undefined);
  const groupRef = useRef<HTMLDivElement>(null);

  function setAll(open: boolean) {
    setAllOpen(open);
    setAllKey((key) => key + 1);
  }

  return (
    <section className="home-card help-section" aria-labelledby={headingId}>
      <h2 id={headingId}>{strings.heading}</h2>
      <p className="help-text">{strings.intro}</p>

      <div className="faq-controls">
        <button type="button" className="btn help-btn help-btn--secondary faq-control" onClick={() => setAll(true)}>
          {strings.expandAll}
        </button>
        <button type="button" className="btn help-btn help-btn--secondary faq-control" onClick={() => setAll(false)}>
          {strings.collapseAll}
        </button>
      </div>

      <div ref={groupRef} className="faq-groups">
        {strings.groups.map((group) => {
          const groupId = `${headingId}-${group.id}`;
          return (
            <section key={group.id} className="faq-group" aria-labelledby={groupId}>
              <h3 id={groupId} className="help-subheading">
                {group.title}
              </h3>
              <ul className="faq-list">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <details
                      className="faq-item"
                      // Remount on Expand/Collapse all so the native open state updates.
                      key={`${item.id}-${allKey}`}
                      open={allOpen}
                    >
                      <summary className="faq-question">
                        <span className="faq-marker" aria-hidden="true" />
                        <span>{item.question}</span>
                      </summary>
                      <div className="faq-answer">
                        <p className="help-text">{item.answer}</p>
                        {item.link && (
                          <Link to={item.link.to} className="faq-link">
                            {item.link.label}
                          </Link>
                        )}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
