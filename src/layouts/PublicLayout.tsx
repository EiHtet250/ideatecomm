import { Outlet } from 'react-router-dom';
import { DevPreviewBanner } from '../components';

/** Minimal shell for Welcome, Login and Sign Up (no app navigation). */
export function PublicLayout() {
  return (
    <div className="shell shell--public">
      <DevPreviewBanner />
      <main className="shell__main shell__main--narrow">
        <Outlet />
      </main>
    </div>
  );
}
