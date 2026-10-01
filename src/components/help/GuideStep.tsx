import { CheckIcon, GuideStepIcon } from './GuideIcons';
import type { GuideStep as GuideStepData, UserGuideStrings } from './userGuideContent';

interface GuideStepProps {
  step: GuideStepData;
  /** 1-based position of this step. */
  index: number;
  total: number;
  /** 'map' badges look like pins, 'trail' badges look like passport stamps. */
  theme: 'map' | 'trail';
  done: boolean;
  onToggle: () => void;
  strings: UserGuideStrings;
}

/**
 * One step on the guide path: a numbered badge joined to the next by a line, a decorative
 * icon, the step title and detail, an optional tip callout, and a "Got it" toggle.
 * The badge number and the "Step X of Y" label are plain text, so progress never relies
 * on colour alone.
 */
export function GuideStep({ step, index, total, theme, done, onToggle, strings }: GuideStepProps) {
  return (
    <li className={`guide-step${done ? ' guide-step--done' : ''}`}>
      <div className="guide-step__rail">
        <span className={`guide-badge guide-badge--${theme}`} aria-hidden="true">
          {done ? <CheckIcon className="guide-badge__check" /> : <span className="guide-badge__num">{index}</span>}
        </span>
      </div>

      <div className="guide-step__card">
        <p className="guide-step__count">{strings.stepLabel(index, total)}</p>

        <h4 className="guide-step__title">
          <span className="guide-step__icon" aria-hidden="true">
            <GuideStepIcon name={step.icon} />
          </span>
          {step.title}
        </h4>

        <p className="guide-step__detail">{step.detail}</p>

        {step.tip && (
          <p className="guide-tip">
            <span className="guide-tip__label">{strings.tipLabel}</span>
            <span>{step.tip}</span>
          </p>
        )}

        <button type="button" className="guide-done-btn" aria-pressed={done} onClick={onToggle}>
          <span className="guide-done-btn__icon" aria-hidden="true">
            {done ? <CheckIcon /> : null}
          </span>
          {done ? strings.markedDoneLabel : strings.markDoneLabel}
        </button>
      </div>
    </li>
  );
}
