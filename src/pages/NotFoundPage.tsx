import { Link } from 'react-router-dom';
import { paths } from '../routes/paths';

export function NotFoundPage() {
  return (
    <main className="dev-preview">
      <h1>Page not found</h1>
      <p>
        <Link to={paths.devPreview}>Back to the preview menu</Link>
      </p>
    </main>
  );
}
