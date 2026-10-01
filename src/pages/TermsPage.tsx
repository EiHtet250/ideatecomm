import { Link } from 'react-router-dom';
import { paths } from '../routes/paths';
import './legal.css';
import { useSettings } from '../components/settings/SettingsProvider';
import { translateVisitorText } from '../components/settings/visitorStrings';

export function TermsPage() {
  const { currentLanguage } = useSettings();
  const t = (text: string) => translateVisitorText(text, currentLanguage);
  return (
    <article className="legal-page">
      <header className="legal-page__header">
        <p className="legal-page__eyebrow">MINTH</p>
        <h1>{t("MINTH Terms & Conditions")}</h1>
        <p><strong>{t("Last updated:")}</strong> [Date]</p>
      </header>

      <p>
        {t("Welcome to MINTH. We hope our museum guide helps you enjoy discovering the stories behind the exhibits.")}
      </p>
      <p>
        MINTH is operated by <strong>[operator’s legal name]</strong> (“we”, “us”, or “our”). Please
        take a moment to read these terms, which explain how you may use our website. By using MINTH,
        you agree to these Terms &amp; Conditions.
      </p>

      <section>
        <h2>{t("1. Using MINTH")}</h2>
        <p>
          {t("You are welcome to explore MINTH for personal and educational purposes. We kindly ask that you use the website lawfully and respect the rights of others.")}
        </p>
        <p>
          {t("Please do not attempt to gain unauthorised access, introduce harmful software, or interfere with the website’s operation.")}
        </p>
      </section>

      <section>
        <h2>{t("2. Your Museum Guide")}</h2>
        <p>
          {t("We aim to provide helpful and accurate museum information. However, exhibit details, opening hours, admission prices, and available services may change. Please check directly with the museum when planning your visit.")}
        </p>
        <p>
          {t("During your visit, please follow the museum’s rules, posted notices, and staff guidance. Information on MINTH does not replace these instructions.")}
        </p>
        <p>
          <strong>Our relationship with the museum:</strong> [State whether MINTH is an official
          museum service or an independent guide.]
        </p>
      </section>

      <section>
        <h2>{t("3. Content, Images, and Trademarks")}</h2>
        <p>
          {t("The text, illustrations, designs, and other materials on MINTH belong to us or their respective rights holders, unless otherwise stated.")}
        </p>
        <p>
          You are welcome to view this content for personal, non-commercial use. If you would like
          to copy, adapt, publish, or use it commercially, please obtain permission from the relevant
          rights holder, except where the law permits such use.
        </p>
        <p>
          Museum names, logos, trademarks, and third-party images remain the property of their
          respective owners. Their appearance on MINTH does not automatically indicate endorsement
          or grant permission to use them.
        </p>
      </section>

      <section>
        <h2>{t("4. Links to Other Websites")}</h2>
        <p>
          {t("For your convenience, MINTH may include links to museum websites, ticketing platforms, or other external services.")}
        </p>
        <p>
          These websites operate independently and have their own terms and privacy policies.
          Please review those policies before using their services or sharing personal information.
          We do not control their content or practices.
        </p>
      </section>

      <section>
        <h2>{t("5. Tickets and Bookings")}</h2>
        <p>
          Information on MINTH does not constitute a ticket, reservation, or guarantee of admission.
        </p>
        <p>
          If you purchase tickets or make bookings through an external provider, that provider’s
          terms will apply, including its payment, cancellation, and refund policies.
        </p>
      </section>

      <section>
        <h2>{t("6. Your Privacy")}</h2>
        <p>
          Please read our           <Link to={paths.privacyPolicy}>{t("Privacy Policy")}</Link> {t("to learn how personal information is handled when you use MINTH.")}
        </p>
        <p>
          Acceptance of these terms does not provide blanket consent to collect or use your personal
          information. We will provide notices and obtain consent where required by applicable law.
        </p>
      </section>

      <section>
        <h2>{t("7. Website Availability")}</h2>
        <p>
          We take reasonable care in maintaining MINTH and aim to provide a smooth browsing
          experience. However, we cannot guarantee that the website will always be available,
          error-free, or uninterrupted.
        </p>
        <p>
          To the extent permitted by law, MINTH is provided on an “as available” basis without
          guarantees about the completeness, accuracy, or suitability of its content for a
          particular purpose.
        </p>
      </section>

      <section>
        <h2>{t("8. Our Responsibility")}</h2>
        <p>
          To the extent permitted by applicable law, we will not be liable for indirect or
          consequential losses arising from your use of, or inability to use, MINTH.
        </p>
        <p>
          Nothing in these terms excludes or limits liability for fraud, death or personal injury
          caused by negligence, or any liability that cannot legally be excluded or limited. Any
          limitation applies only where lawful and subject to applicable requirements of
          reasonableness.
        </p>
      </section>

      <section>
        <h2>{t("9. Updates to MINTH and These Terms")}</h2>
        <p>
          We may occasionally update the website and these terms to reflect changes to our services
          or legal requirements.
        </p>
        <p>
          Updated terms will appear on this page with a revised date and will apply from that date
          onward. We will provide reasonable notice of significant changes affecting your rights or
          obligations, and obtain consent where legally required.
        </p>
      </section>

      <section>
        <h2>{t("10. Protecting the Website")}</h2>
        <p>
          We may temporarily restrict access where reasonably necessary for maintenance, security,
          legal compliance, or to address misuse. Where practical, we will provide notice of planned
          interruptions.
        </p>
      </section>

      <section>
        <h2>{t("11. Additional Terms")}</h2>
        <p>
          Some features may have additional terms, which will be presented before you use them. If
          there is a conflict, those specific terms will apply to the relevant feature.
        </p>
      </section>

      <section>
        <h2>{t("12. If Part of These Terms Cannot Apply")}</h2>
        <p>
          If a provision is found to be invalid or unenforceable, it will be set aside only to the
          extent necessary. The remaining terms will continue to apply.
        </p>
      </section>

      <section>
        <h2>{t("13. Governing Law")}</h2>
        <p>
          These terms are governed by the laws of the Republic of Singapore. Subject to any
          mandatory legal rights, disputes relating to these terms or the use of MINTH will be
          subject to the exclusive jurisdiction of the courts of Singapore.
        </p>
      </section>

      <section>
        <h2>{t("14. Contact Us")}</h2>
        <p>If you have questions about these terms, please contact us. We welcome the opportunity to help.</p>
        <address className="legal-page__contact">
          <p><strong>{t("Email:")}</strong> [Contact email address]</p>
          <p><strong>{t("Address:")}</strong> [Correspondence address]</p>
        </address>
      </section>
    </article>
  );
}
