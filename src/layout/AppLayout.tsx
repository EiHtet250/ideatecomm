import { NavLink, Outlet } from 'react-router-dom';
import { navLinks, paths } from '../routes/paths';

/** Shared shell: header, navigation, page content and footer. */
export function AppLayout() {
  return (
    <div className="app">
      <header className="app__header">
        <NavLink to={paths.welcome} className="app__brand">
          MINT Adventure Guide
        </NavLink>
        <nav className="app__nav" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className="app__nav-link">
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="app__main">
        <Outlet />
      </main>

      <footer className="app__footer">MINT Museum of Toys · Adventure Guide</footer>
    </div>
  );
}
