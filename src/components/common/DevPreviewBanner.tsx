import { Link } from 'react-router-dom';
import { paths } from '../../routes/paths';

/**
 * Strip shown on every page while the app is a development backbone.
 * Remove once real authentication and role-based routing exist.
 */
export function DevPreviewBanner() {
  return (
    <div className="dev-banner" role="note">
      <span>Development preview · no login or security yet</span>
      <Link to={paths.devPreview} className="dev-banner__link">
        Preview menu
      </Link>
    </div>
  );
}
