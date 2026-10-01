import './legal.css';
import { useSettings } from '../components/settings/SettingsProvider';
import { translateVisitorText } from '../components/settings/visitorStrings';

export function PrivacyPolicyPage() {
  const { currentLanguage } = useSettings();
  const t = (text: string) => translateVisitorText(text, currentLanguage);
  return (
    <article className="legal-page">
      <header className="legal-page__header">
        <p className="legal-page__eyebrow">MINTH</p>
        <h1>{t("Privacy Policy")}</h1>
      </header>

      <section>
        <h2>{t("Contacting Us About Your Personal Information")}</h2>
        <p>{t("You may contact us to:")}</p>
        <ul>
          <li>
            {t("Request access to personal information we hold about you and information about how it has been used or disclosed, subject to applicable law.")}
          </li>
          <li>{t("Request correction of inaccurate or incomplete personal information.")}</li>
          <li>
            {t("Withdraw consent to future collection, use, or disclosure where processing relies on your consent.")}
          </li>
          <li>{t("Ask questions or raise a concern about our privacy practices.")}</li>
        </ul>
        <p>
          {t("We will respond in accordance with applicable legal requirements. We may need to verify your identity before acting on a request.")}
        </p>
        <p>
          {t("If withdrawing consent affects our ability to provide a particular feature, we will explain the consequences. Withdrawal does not affect processing already carried out or processing permitted or required by law.")}
        </p>
      </section>

      <section>
        <h2>{t("9. Younger Visitors")}</h2>
        <p>
          {t("We encourage younger visitors to involve a parent or guardian before submitting personal information through MINTH.")}
        </p>
        <p>[Describe any age restrictions, child-directed features, and parental consent arrangements that actually apply.]</p>
        <p>
          {t("If you believe a child has provided information that should not have been collected, please contact us so we can review and address the situation.")}
        </p>
      </section>

      <section>
        <h2>{t("10. External Websites")}</h2>
        <p>
          {t("MINTH may contain links to websites operated by museums, ticketing providers, or other organisations. This Privacy Policy applies only to MINTH.")}
        </p>
        <p>{t("Please review the privacy policy of an external website before sharing information with it.")}</p>
      </section>

      <section>
        <h2>{t("11. Changes to This Policy")}</h2>
        <p>
          {t("We may update this Privacy Policy as our website or data practices change. The latest version will be available on this page with an updated date.")}
        </p>
        <p>
          {t("Where changes involve new uses of personal information, we will provide notice and obtain further consent where required by law.")}
        </p>
      </section>

      <section>
        <h2>{t("12. Contact Us")}</h2>
        <p>
          {t("If you have questions, requests, or concerns about your personal information, please contact our privacy representative.")}
        </p>
        <address className="legal-page__contact">
          <p>
            <strong>{t("Email:")}</strong> <a href="mailto:minth@email.com">minth@email.com</a>
          </p>
          <p>
            <strong>{t("Phone:")}</strong> <a href="tel:12345678">12345678</a>
          </p>
        </address>
        <p>{t("Thank you for visiting MINTH.")}</p>
      </section>
    </article>
  );
}
