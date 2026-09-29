import { Link } from 'react-router-dom';
import { FormField, PagePlaceholder, PlaceholderBox } from '../../components';
import { paths } from '../../routes/paths';

/**
 * Visual structure only. No authentication, OTP or role check is implemented.
 * Later: visitor accounts go to Visitor Home, staff accounts go to Staff Home.
 */
export function LoginPage() {
  return (
    <PagePlaceholder
      title="Log in"
      description="Layout only - the form does not submit anywhere yet."
      planned={[
        'Email login with a one-time passcode (OTP) sent by email',
        'Role check after login: visitor → Visitor Home, staff → Staff Home',
        'Error and loading states',
      ]}
    >
      <form className="form" onSubmit={(e) => e.preventDefault()} noValidate>
        <FormField id="login-email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" />
        <PlaceholderBox label="Email OTP step" note="Future: enter the code sent to your email" size="sm" />
        <button type="submit" className="btn" disabled>
          Log in (not connected yet)
        </button>
      </form>
      <p className="form__switch">
        No account? <Link to={paths.signUp}>Sign up</Link>
      </p>
    </PagePlaceholder>
  );
}
