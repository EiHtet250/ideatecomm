import { NavLink, Outlet } from 'react-router-dom';
import { DevPreviewBanner, ProfileBadge } from '../components';
import { paths, staffNavLinks } from '../routes/paths';

// Placeholder until login provides the real staff member's name.
const STAFF_NAME = 'Staff Name';

/**
 * Staff shell: header plus a side menu (stacks on top on phones).
 * NOTE: this area is not protected. Real staff access must come from authentication.
 */
export function StaffLayout() {
  return (
    <div className="shell shell--staff">
      <DevPreviewBanner />

      <header className="topbar topbar--staff">
        <NavLink to={paths.staffHome} className="topbar__brand">
          MINT Staff
        </NavLink>
        <ProfileBadge name={STAFF_NAME} to={paths.staffHome} />
      </header>

      <div className="staff-body">
        <aside className="staff-sidebar">
          <nav className="staff-nav" aria-label="Staff">
            {staffNavLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end className="staff-nav__link">
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
