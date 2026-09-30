import type { HelpStrings } from './helpStrings';
import { MINT_CONTACT } from './mintContact';
import './help.css';

/** Contact details, rendered from the single MINT_CONTACT object. */
export function ContactMint({ strings }: { strings: HelpStrings['contact'] }) {
  return (
    <dl className="help-contact">
      <div className="help-contact__row">
        <dt>{strings.address}</dt>
        <dd>{MINT_CONTACT.address}</dd>
      </div>
      <div className="help-contact__row">
        <dt>{strings.phone}</dt>
        <dd>
          <a href={MINT_CONTACT.phoneHref}>{MINT_CONTACT.phoneDisplay}</a>
        </dd>
      </div>
      <div className="help-contact__row">
        <dt>{strings.email}</dt>
        <dd>
          <a href={MINT_CONTACT.emailHref}>{MINT_CONTACT.email}</a>
        </dd>
      </div>
      <div className="help-contact__row">
        <dt>{strings.hours}</dt>
        <dd>
          {MINT_CONTACT.openingHours}
          <br />
          {MINT_CONTACT.lastAdmission}
        </dd>
      </div>
    </dl>
  );
}
