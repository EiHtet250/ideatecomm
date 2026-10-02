import { NavLink, Outlet } from 'react-router-dom';
import { ProfileBadge, SiteFooter } from '../components';
import { paths, visitorNavLinks } from '../routes/paths';
import { demoVisitor } from '../services/demoVisitor';
import { useAuthUser } from '../components/auth/useAuthUser';
import { LogoutButton } from '../components/auth/LogoutButton';
import { useSettings } from '../components/settings/SettingsProvider';
import { translateVisitorText } from '../components/settings/visitorStrings';

/**
 * Visitor shell. Desktop: links in the header.
 * Phone: the same links move to a bottom tab bar.
 */
export function VisitorLayout() {
  const { currentLanguage } = useSettings();
  const t = (text: string) => translateVisitorText(text, currentLanguage);
  // The signed-in visitor's name (or the name they chose on the Profile page);
  // "Demo Visitor" when nobody is logged in (e.g. the team preview link).
  const { user, guestName } = useAuthUser();
  const visitorName = user?.name ?? guestName ?? demoVisitor.name;
  return (
    <div className="shell shell--visitor">
      <header className="topbar">
        <div className="visitor-header__brand">
          <NavLink className="header-logo" to={paths.visitorHome} aria-label={t("MINTH home")}>
            <img src="/MINTH%20logo.jpg" alt="" />
          </NavLink>
          <NavLink to={paths.visitorHome} className="topbar__brand">
            {t("MINTH Adventure Guide")}
          </NavLink>
        </div>

        <nav className="visitor-nav" aria-label={t("Visitor")}>
          {visitorNavLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end className="visitor-nav__link">
              {t(link.label)}
            </NavLink>
          ))}
        </nav>

        <div className="topbar__actions">
          <NavLink to={paths.chatbot} className="help-link" aria-label={t("Chatbot")}>
            <span aria-hidden="true">💬</span> <span className="help-link__text">{t("Chatbot")}</span>
          </NavLink>
          <NavLink to={paths.help} className="help-link" aria-label={t("Help")}>
            ? <span className="help-link__text">{t("Help")}</span>
          </NavLink>
          <NavLink to={paths.settings} className="help-link" aria-label={t("Settings")}>
            <span aria-hidden="true">⚙</span> <span className="help-link__text">{t("Settings")}</span>
          </NavLink>
          <ProfileBadge name={visitorName} to={paths.profile} ariaLabel={t("Profile: {name}").replace("{name}", visitorName)} />
          {/* Hidden on phones, where the Profile page has the same button. */}
          <LogoutButton className="logout--desktop-only" />
        </div>
      </header>

      <main className="shell__main">
        <Outlet />
      </main>
      <SiteFooter language={currentLanguage} />
    </div>
  );
}
