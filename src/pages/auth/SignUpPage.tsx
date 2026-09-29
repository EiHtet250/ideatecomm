import { Link } from 'react-router-dom';
import { FormField, PagePlaceholder, PlaceholderBox } from '../../components';
import { paths } from '../../routes/paths';

/** Visual structure only. No accounts are created or stored. */
export function SignUpPage() {
  return (
    <PagePlaceholder
      title="Sign up"
      description="Layout only - the form does not submit anywhere yet."
      planned={[
        'Create a visitor account (staff accounts are set up by the museum)',
        'Verify the email address with a one-time passcode (OTP)',
        'Validation messages for each field',
      ]}
    >
      <form className="form" onSubmit={(e) => e.preventDefault()} noValidate>
        <FormField id="signup-name" label="Name" placeholder="Your name" autoComplete="name" />
        <FormField id="signup-email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" />
        <PlaceholderBox label="Email OTP verification step" note="Future: confirm the code sent to your email" size="sm" />
        <button type="submit" className="btn" disabled>
          Create account (not connected yet)
        </button>
      </form>
      <p className="form__switch">
        Already have an account? <Link to={paths.login}>Log in</Link>
      </p>
    </PagePlaceholder>
  );
}
