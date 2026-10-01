import { Link } from 'react-router-dom';
import { AuthForm } from '../../components/auth/AuthForm';
import '../../components/auth/auth.css';
import { paths } from '../../routes/paths';

/**
 * Entry page: log in with email + one-time passcode.
 *
 * The "Team preview" links are TEMPORARY so the team can open both sides while
 * login is still being connected. They are NOT a security boundary: anyone can
 * open any URL until the routes are guarded.
 */
export function DevPreviewPage() {
  return (
    <main className="dev-preview dev-preview--entry">
      <h1>MINTH Adventure Guide</h1>

      <div className="auth-entry">
        <AuthForm purpose="login" headingLevel="h2" />
      </div>

      <p className="auth-entry__team">
        Team preview (no login): <Link to={paths.visitorHome}>Visitor side</Link> ·{' '}
        <Link to={paths.staffHome}>Staff side</Link>
      </p>
    </main>
  );
}
