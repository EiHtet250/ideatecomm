import { useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, GuideHeaderIcon, InfoIcon } from './GuideIcons';
import { GuideStep } from './GuideStep';
import type { UserGuideStrings } from './userGuideContent';
import './helpContent.css';

/**
 * "How to use" guide for the Museum Map and Discovery Trail, styled as a friendly
 * toy-museum trail. A segmented control switches between the two guides and only the
 * selected guide is shown. Steps are an ordered list so assistive tech announces the count.
 * The "draft" status on each step is for the team only and never shown to visitors.
 */
export function UserGuide({ strings }: { strings: UserGuideStrings }) {
  const headingId = useId();
  const switcherName = useId();
  const [activeId, setActiveId] = useState(strings.guides[0]?.id);
  // Done steps are keyed by "<guideId>:<stepIndex>" so each guide keeps its own progress.
  const [doneKeys, setDoneKeys] = useState<ReadonlySet<string>>(() => new Set());

  const active = strings.guides.find((guide) => guide.id === activeId) ?? strings.guides[0];

  const doneCount = useMemo(() => {
    if (!active) return 0;
    return active.steps.reduce((count, _step, i) => (doneKeys.has(`${active.id}:${i}`) ? count + 1 : count), 0);
  }, [active, doneKeys]);

  if (!active) return null;

  const total = active.steps.length;
  const allDone = doneCount === total && total > 0;

  function toggleStep(stepIndex: number) {
    const key = `${active!.id}:${stepIndex}`;
    setDoneKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <section className="home-card help-section user-guide" aria-labelledby={headingId}>
      <h2 id={headingId}>{strings.heading}</h2>
      <p className="help-text">{strings.intro}</p>

      <fieldset className="guide-switcher">
        <legend className="guide-switcher__legend">{strings.switcherLegend}</legend>
        <div className="guide-switcher__options">
          {strings.guides.map((guide) => {
            const selected = guide.id === active.id;
            return (
              <label key={guide.id} className={`guide-switcher__option${selected ? ' is-selected' : ''}`}>
                <input
                  type="radio"
                  name={switcherName}
                  value={guide.id}
                  checked={selected}
                  onChange={() => setActiveId(guide.id)}
                />
                <span className="guide-switcher__check" aria-hidden="true">
                  {selected ? <CheckIcon /> : null}
                </span>
                <span>{guide.title}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="guide-notice" role="note">
        <span className="guide-notice__icon" aria-hidden="true">
          <InfoIcon />
        </span>
        <span>{strings.notice}</span>
      </p>

      <div className={`guide-body guide-body--${active.theme}`}>
        <header className="guide-header-card">
          <span className="guide-header-card__art" aria-hidden="true">
            <GuideHeaderIcon name={active.icon} />
          </span>
          <div className="guide-header-card__text">
            <h3 className="guide-header-card__title">{active.title}</h3>
            <p className="guide-header-card__overview">{active.overview}</p>
            {active.link && (
              <Link to={active.link.to} className="guide-open-link">
                {active.link.label}
              </Link>
            )}
          </div>
        </header>

        <div className="guide-path">
          <p className="guide-progress">
            <span className="guide-progress__track" aria-hidden="true">
              <span className="guide-progress__fill" style={{ inlineSize: `${(doneCount / total) * 100}%` }} />
            </span>
            <span className="guide-progress__text" role="status" aria-live="polite">
              {allDone ? strings.allDoneLabel : strings.progressLabel(doneCount, total)}
            </span>
          </p>

          <ol className="guide-steps">
            {active.steps.map((step, i) => (
              <GuideStep
                key={`${active.id}:${step.title}`}
                step={step}
                index={i + 1}
                total={total}
                theme={active.theme}
                done={doneKeys.has(`${active.id}:${i}`)}
                onToggle={() => toggleStep(i)}
                strings={strings}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
