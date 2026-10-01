import { Route, Routes } from 'react-router-dom';
import { paths } from './routes/paths';
import { PublicLayout } from './layouts/PublicLayout';
import { VisitorLayout } from './layouts/VisitorLayout';
import { StaffLayout } from './layouts/StaffLayout';
import { DevPreviewPage } from './pages/dev/DevPreviewPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { WelcomePage } from './pages/auth/WelcomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { VisitorHomePage } from './pages/visitor/VisitorHomePage';
import { MuseumMapPage } from './pages/visitor/MuseumMapPage';
import { DiscoveryTrailPlaceholderPage } from './pages/visitor/DiscoveryTrailPlaceholderPage';
import { DiscoveryTrailPage } from './pages/visitor/DiscoveryTrailPage';
import { ChatbotPage } from './pages/visitor/ChatbotPage';
import { ContactPage } from './pages/visitor/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ProfilePage } from './pages/visitor/ProfilePage';
import { RewardsPage } from './pages/visitor/RewardsPage';
import { SettingsPage } from './pages/visitor/SettingsPage';
import { HelpPage } from './pages/visitor/HelpPage';
import { StaffHomePage } from './pages/staff/StaffHomePage';
import { HelpRequestsPage } from './pages/staff/HelpRequestsPage';
import { VisitorFeedbackPage } from './pages/staff/VisitorFeedbackPage';
import { StaffSettingsPage } from './pages/staff/StaffSettingsPage';

export default function App() {
  return (
    <Routes>
      {/* Temporary development entry page - not access control. */}
      <Route path={paths.devPreview} element={<DevPreviewPage />} />

      <Route element={<PublicLayout />}>
        <Route path={paths.welcome} element={<WelcomePage />} />
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.signUp} element={<SignUpPage />} />
      </Route>

      <Route element={<VisitorLayout />}>
        <Route path={paths.privacyPolicy} element={<PrivacyPolicyPage />} />
        <Route path={paths.terms} element={<TermsPage />} />
        <Route path={paths.visitorHome} element={<VisitorHomePage />} />
        <Route path={paths.museumMap} element={<MuseumMapPage />} />
        <Route path={paths.discoveryTrail} element={<DiscoveryTrailPlaceholderPage />} />
        <Route path={paths.toyGame} element={<DiscoveryTrailPage />} />
        <Route path={paths.rewards} element={<RewardsPage />} />
        <Route path={paths.chatbot} element={<ChatbotPage />} />
        <Route path={paths.contact} element={<ContactPage />} />
        <Route path={paths.profile} element={<ProfilePage />} />
        <Route path={paths.settings} element={<SettingsPage />} />
        <Route path={paths.help} element={<HelpPage />} />
      </Route>

      {/* Staff routes are NOT protected yet. Add a role guard once login exists. */}
      <Route element={<StaffLayout />}>
        <Route path={paths.staffHome} element={<StaffHomePage />} />
        <Route path={paths.helpRequests} element={<HelpRequestsPage />} />
        <Route path={paths.visitorFeedback} element={<VisitorFeedbackPage />} />
        <Route path={paths.staffSettings} element={<StaffSettingsPage />} />
      </Route>

      <Route path={paths.notFound} element={<NotFoundPage />} />
    </Routes>
  );
}
