import { Link } from 'react-router-dom';
import { PagePlaceholder, PlaceholderBox } from '../../components';
import { paths } from '../../routes/paths';

export function WelcomePage() {
  return (
    <PagePlaceholder
      title="Welcome to MINT"
      description="First screen a visitor sees when they open the guide."
      planned={[
        'MINT Museum of Toys branding and a short welcome message',
        'Entry points to log in or sign up',
        'Optional: continue as guest (team to decide)',
      ]}
    >
      <PlaceholderBox label="Welcome artwork / hero image" size="md" />
      <p className="link-row">
        <Link to={paths.login}>Go to Login</Link>
        <Link to={paths.signUp}>Go to Sign up</Link>
      </p>
    </PagePlaceholder>
  );
}
