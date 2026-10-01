import { AuthForm } from '../../components/auth/AuthForm';
import '../../components/auth/auth.css';

/** Creates a visitor account, confirmed with a one-time passcode sent by email. */
export function SignUpPage() {
  return <AuthForm purpose="signup" />;
}
