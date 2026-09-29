import { NavLink, Outlet } from 'react-router-dom';
import { DevPreviewBanner, ProfileBadge } from '../components';
import { paths, visitorNavLinks } from '../routes/paths';

// Placeholder until login provides the real visitor's name.
const VISITOR_NAME = 'Visitor Name';

/**
 * Visitor shell. Desktop: links in the header.
 * Phone: the same links move to a bottom tab bar.
 */
export function VisitorLayout() {
  return (
    <div className="shell shell--visitor">
      <DevPreviewBanner />

      <header className="topbar">
        <NavLink to={paths.visitorHome} className="topbar__brand">
          MINT Adventure Guide
        </NavLink>

        <nav className="visitor-nav" aria-label="Visitor">
          {visitorNavLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end className="visitor-nav__link">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="topbar__actions">
          <NavLink to={paths.help} className="help-link" aria-label="Help">
            ? <span className="help-link__text">Help</span>
          </NavLink>
          <ProfileBadge name={VISITOR_NAME} to={paths.profile} />
        </div>
      </header>

      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  );
}
