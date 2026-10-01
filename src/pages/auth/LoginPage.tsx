import { AuthForm } from '../../components/auth/AuthForm';
import '../../components/auth/auth.css';

/** Email + one-time passcode login. Visitors go to Visitor Home, staff go to Staff Home. */
export function LoginPage() {
  return <AuthForm purpose="login" />;
}
