import { NavLink, Outlet } from 'react-router-dom';
import { DevPreviewBanner, ProfileBadge, SiteFooter } from '../components';
import { paths, staffNavLinks } from '../routes/paths';
import { useSettings } from '../components/settings/SettingsProvider';
import { getStaffStrings } from '../components/staff/staffStrings';
import { readAuthSession } from '../components/auth/authSession';

// Shown when nobody is logged in as staff (e.g. the team preview link).
const STAFF_NAME = 'Staff Name';

/**
 * Staff shell: combined header and page navigation.
 * NOTE: this area is not protected. Real staff access must come from authentication.
 */
export function StaffLayout() {
  const { currentLanguage } = useSettings();
  const labels = getStaffStrings(currentLanguage).navigation;
  const user = readAuthSession()?.user;
  const staffName = user?.role === 'staff' ? user.name : STAFF_NAME;

  return (
    <div className="shell shell--staff">
      <DevPreviewBanner />
      <div className="staff-body">
        <header className="topbar topbar--staff staff-header">
          <div className="staff-header__brand">
            <NavLink className="header-logo" to={paths.staffHome} aria-label={labels.staffHome}>
              <img src="/MINTH%20logo.jpg" alt="" />
            </NavLink>
          </div>
          <div className="staff-header__identity">
            <NavLink to={paths.staffHome} className="topbar__brand staff-header__title">
              {labels.staffTitle}
            </NavLink>
            <ProfileBadge name={staffName} to={paths.staffHome} />
          </div>
          <nav className="staff-nav" aria-label="Staff">
            {staffNavLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end className="staff-nav__link">
                {labels[link.key]}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="shell__main">
          <Outlet />
        </main>
      </div>
      <SiteFooter language={currentLanguage} />
    </div>
  );
}
