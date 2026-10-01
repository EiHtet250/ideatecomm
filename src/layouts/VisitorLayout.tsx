import { NavLink, Outlet } from 'react-router-dom';
import { DevPreviewBanner, ProfileBadge, SiteFooter } from '../components';
import { paths, visitorNavLinks } from '../routes/paths';
import { demoVisitor } from '../services/demoVisitor';
import { useSettings } from '../components/settings/SettingsProvider';
import { translateVisitorText } from '../components/settings/visitorStrings';

/**
 * Visitor shell. Desktop: links in the header.
 * Phone: the same links move to a bottom tab bar.
 */
export function VisitorLayout() {
  const { currentLanguage } = useSettings();
  const t = (text: string) => translateVisitorText(text, currentLanguage);
  return (
    <div className="shell shell--visitor">
      <DevPreviewBanner />

      <header className="topbar">
        <div className="visitor-header__brand">
          <NavLink className="header-logo" to={paths.visitorHome} aria-label={t("MINTH home")}>
            <img src={`${import.meta.env.BASE_URL}MINTH%20logo.jpg`} alt="" />
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
          <NavLink to={paths.help} className="help-link" aria-label={t("Help")}>
            ? <span className="help-link__text">{t("Help")}</span>
          </NavLink>
          <ProfileBadge name={demoVisitor.name} to={paths.profile} ariaLabel={t("Profile: {name}").replace("{name}", demoVisitor.name)} />
        </div>
      </header>

      <main className="shell__main">
        <Outlet />
      </main>
      <SiteFooter language={currentLanguage} />
    </div>
  );
}
