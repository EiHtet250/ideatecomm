import { Link } from 'react-router-dom';
import { paths } from '../../routes/paths';

/**
 * TEMPORARY development entry page so the team can open both sides
 * before authentication exists. This is NOT a security boundary:
 * anyone can open any URL. Replace with the real login flow later.
 */
export function DevPreviewPage() {
  return (
    <main className="dev-preview dev-preview--entry">
      <p className="dev-preview__tag">Development preview</p>
      <h1>MINTH Adventure Guide</h1>
      <p className="dev-preview__warning">
        For the project team only. There is no login and no access control yet. These links are not
        real staff security.
      </p>

      <div className="dev-preview__choices">
        <Link to={paths.visitorHome} className="dev-preview__choice">
          Preview Visitor Side
        </Link>
        <Link to={paths.staffHome} className="dev-preview__choice dev-preview__choice--staff">
          Preview Staff Side
        </Link>
      </div>

      <p className="dev-preview__more">
        Also: <Link to={paths.welcome}>Welcome</Link> · <Link to={paths.login}>Login</Link> ·{' '}
        <Link to={paths.signUp}>Sign up</Link>
      </p>
    </main>
  );
}
