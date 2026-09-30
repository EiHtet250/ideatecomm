import type { HelpStrings } from './helpStrings';
import { EMERGENCY_NUMBERS } from './mintContact';
import './help.css';

/** General safety steps only. */
export function SafetyInfo({ strings }: { strings: HelpStrings['safety'] }) {
  return (
    <>
      <p className="help-text">{strings.intro}</p>
      <ol className="help-steps">
        {strings.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
        <li>
          <strong>
            {strings.emergencyPrefix}{' '}
            <a href={EMERGENCY_NUMBERS.ambulanceFire.href}>{EMERGENCY_NUMBERS.ambulanceFire.display}</a>{' '}
            {strings.ambulanceFire} {strings.or}{' '}
            <a href={EMERGENCY_NUMBERS.police.href}>{EMERGENCY_NUMBERS.police.display}</a> {strings.police}.
          </strong>
        </li>
      </ol>
      {/*
        TODO(MINT): MINT to supply its own evacuation procedure and assembly point.
        Do not invent MINT-specific safety steps. Add approved text here once MINT provides it.
      */}
    </>
  );
}
