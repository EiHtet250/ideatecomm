import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { paths } from './routes/paths';
import { WelcomePage } from './pages/WelcomePage';
import { HomePage } from './pages/HomePage';
import { DirectionsPage } from './pages/DirectionsPage';
import { ExhibitsPage } from './pages/ExhibitsPage';
import { DiscoveryTrailPage } from './pages/DiscoveryTrailPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={paths.welcome} element={<WelcomePage />} />
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.directions} element={<DirectionsPage />} />
        <Route path={paths.exhibits} element={<ExhibitsPage />} />
        <Route path={paths.discoveryTrail} element={<DiscoveryTrailPage />} />
        <Route path={paths.profile} element={<ProfilePage />} />
        <Route path={paths.settings} element={<SettingsPage />} />
        <Route path={paths.help} element={<HelpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
