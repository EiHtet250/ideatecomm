import { useId } from 'react';
import { PagePlaceholder, PlaceholderBox } from '../../components';
import { ContactMint } from '../../components/help/ContactMint';
import { FeedbackForm } from '../../components/help/FeedbackForm';
import { HelpRequestForm } from '../../components/help/HelpRequestForm';
import { getHelpStrings } from '../../components/help/helpStrings';
import { SafetyInfo } from '../../components/help/SafetyInfo';

interface HelpPageProps {
  /**
   * Area from the visitor's last QR scan. No shared state provides this yet;
   * when the Museum Map adds it, pass it in here.
   */
  lastScannedArea?: string;
}

export function HelpPage({ lastScannedArea }: HelpPageProps = {}) {
  // No language setting exists yet, so this is English.
  const strings = getHelpStrings();
  const uid = useId();

  return (
    <PagePlaceholder
      title={strings.page.title}
      description={strings.page.description}
      planned={[
        'MINT evacuation steps and assembly point (waiting for MINT to supply them)',
        'Frequently asked questions',
        'How to use the Museum Map and Discovery Trail',
      ]}
    >
      <section className="home-card help-section" aria-labelledby={`${uid}-request`}>
        <h2 id={`${uid}-request`}>{strings.request.heading}</h2>
        <HelpRequestForm strings={strings} lastScannedArea={lastScannedArea} />
      </section>

      <section className="home-card help-section" aria-labelledby={`${uid}-safety`}>
        <h2 id={`${uid}-safety`}>{strings.safety.heading}</h2>
        <SafetyInfo strings={strings.safety} />
      </section>

      <section className="home-card help-section" aria-labelledby={`${uid}-contact`}>
        <h2 id={`${uid}-contact`}>{strings.contact.heading}</h2>
        <ContactMint strings={strings.contact} />
      </section>

      <section className="home-card help-section" aria-labelledby={`${uid}-feedback`}>
        <h2 id={`${uid}-feedback`}>{strings.feedback.heading}</h2>
        <FeedbackForm strings={strings} />
      </section>

      <PlaceholderBox label="FAQ" size="md" />
    </PagePlaceholder>
  );
}
