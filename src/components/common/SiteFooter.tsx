import { Link } from 'react-router-dom';
import { paths } from '../../routes/paths';
import type { ChatLanguage } from '../../types/help';
import { translateVisitorText } from '../settings/visitorStrings';

export function SiteFooter({ language = 'en' }: { language?: ChatLanguage }) {
  const t = (text: string) => translateVisitorText(text, language);
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <Link className="site-footer__brand" to={paths.visitorHome} aria-label={t("Museum of Toys home")}>
          <img className="site-footer__logo" src="/MINTH%20logo.jpg" alt="MINTH" />
        </Link>

        <nav className="site-footer__links" aria-label={t("Footer")}>
          <Link to={paths.privacyPolicy}>{t("Privacy Policy")}</Link>
          <Link to={paths.terms}>{t("Terms and Conditions")}</Link>
          <span>{t("Media")}</span>
          <Link to={paths.contact}>{t("Contact")}</Link>
        </nav>
      </div>

      <div className="site-footer__copyright">
        © {new Date().getFullYear()} MINTH. {t("All Rights Reserved.")}
      </div>
    </footer>
  );
}
