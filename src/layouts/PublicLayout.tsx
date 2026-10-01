import { NavLink, Outlet } from 'react-router-dom';
import { DevPreviewBanner, SiteFooter } from '../components';
import { paths } from '../routes/paths';

/** Minimal shell for Welcome, Login and Sign Up (no app navigation). */
export function PublicLayout() {
  return (
    <div className="shell shell--public">
      <DevPreviewBanner />
      <NavLink className="header-logo header-logo--public" to={paths.visitorHome} aria-label="MINTH home">
        <img src="/MINTH%20logo.jpg" alt="" />
      </NavLink>
      <main className="shell__main shell__main--narrow">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
