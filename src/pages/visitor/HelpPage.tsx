import { useId } from 'react';
import { PagePlaceholder } from '../../components';
import { FaqSection } from '../../components/help/FaqSection';
import { faqStrings } from '../../components/help/faqContent';
import { FeedbackForm } from '../../components/help/FeedbackForm';
import { HelpRequestForm } from '../../components/help/HelpRequestForm';
import { getHelpStrings } from '../../components/help/helpStrings';
import { SafetyInfo } from '../../components/help/SafetyInfo';
import { UserGuide } from '../../components/help/UserGuide';
import { userGuideStrings } from '../../components/help/userGuideContent';
import { useSettings } from '../../components/settings/SettingsProvider';
import { localizeVisitorTree, translateVisitorText } from '../../components/settings/visitorStrings';

interface HelpPageProps {
  /**
   * Area from the visitor's last QR scan. No shared state provides this yet;
   * when the Museum Map adds it, pass it in here.
   */
  lastScannedArea?: string;
}

export function HelpPage({ lastScannedArea }: HelpPageProps = {}) {
  const { currentLanguage } = useSettings();
  const strings = localizeVisitorTree(getHelpStrings(), currentLanguage);
  const faq = localizeVisitorTree(faqStrings, currentLanguage);
  const guide = localizeVisitorTree(userGuideStrings, currentLanguage);
  const t = (text: string) => translateVisitorText(text, currentLanguage);
  const uid = useId();

  return (
    <PagePlaceholder
      title={strings.page.title}
      description={strings.page.description}
      plannedTitle={t("Planned for this page")}
      planned={[t('MINT evacuation steps and assembly point (waiting for MINT to supply them)')]}
    >
      <section className="home-card help-section" aria-labelledby={`${uid}-request`}>
        <h2 id={`${uid}-request`}>{strings.request.heading}</h2>
        <HelpRequestForm strings={strings} lastScannedArea={lastScannedArea} />
      </section>

      <FaqSection strings={faq} />

      <UserGuide strings={guide} />

      <section className="home-card help-section" aria-labelledby={`${uid}-safety`}>
        <h2 id={`${uid}-safety`}>{strings.safety.heading}</h2>
        <SafetyInfo strings={strings.safety} />
      </section>

      <section className="home-card help-section" aria-labelledby={`${uid}-feedback`}>
        <h2 id={`${uid}-feedback`}>{strings.feedback.heading}</h2>
        <FeedbackForm strings={strings} />
      </section>
    </PagePlaceholder>
  );
}
