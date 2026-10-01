import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { AuthError, AUTH_ERROR_MESSAGES, requestOtp, verifyOtp, type AuthPurpose } from '../../services/authClient';
import { saveAuthSession } from './authSession';
import { OtpInput, OTP_LENGTH } from './OtpInput';

// Matches the n8n workflow: one code per minute, Gmail addresses only.
const RESEND_WAIT_SECONDS = 60;
const EMAIL_PATTERN = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\.com$/;
const MAX_NAME_LENGTH = 100;

const COPY: Record<AuthPurpose, { title: string; intro: string; submit: string }> = {
  login: {
    title: 'Log in',
    intro: 'Enter your email and we will send you a one-time code.',
    submit: 'Send code',
  },
  signup: {
    title: 'Sign up',
    intro: 'Create your visitor account. We will email you a one-time code to confirm it.',
    submit: 'Create account',
  },
};

function errorText(error: unknown): string {
  return error instanceof AuthError ? error.message : AUTH_ERROR_MESSAGES.SERVER;
}

/**
 * Login and sign-up share one flow:
 *   1. details - email (and name when signing up)
 *   2. code    - the one-time passcode sent to that email
 * On success the user is saved in this browser and sent to their home page by role.
 */
export function AuthForm({ purpose, headingLevel = 'h1' }: { purpose: AuthPurpose; headingLevel?: 'h1' | 'h2' }) {
  const Heading = headingLevel;
  const navigate = useNavigate();
  const copy = COPY[purpose];

  const [step, setStep] = useState<'details' | 'code'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  async function sendCode(isResend: boolean) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const challenge = await requestOtp({ email: cleanEmail, name: cleanName, purpose });
      setChallengeId(challenge.challengeId);
      setOtp('');
      setStep('code');
      setResendIn(RESEND_WAIT_SECONDS);
      if (isResend) setNotice('We sent you a new code.');
    } catch (caught) {
      setError(errorText(caught));
      if (caught instanceof AuthError && caught.code === 'RATE_LIMITED') {
        setResendIn(caught.retryAfter ?? RESEND_WAIT_SECONDS);
      }
    } finally {
      setBusy(false);
    }
  }

  function submitDetails(event: FormEvent) {
    event.preventDefault();
    if (purpose === 'signup' && !cleanName) return setError('Please enter your name.');
    if (!EMAIL_PATTERN.test(cleanEmail)) return setError('Please enter a valid @gmail.com address.');
    void sendCode(false);
  }

  async function submitCode(event: FormEvent) {
    event.preventDefault();
    if (otp.length !== OTP_LENGTH) return setError(`Please enter the ${OTP_LENGTH}-digit code.`);

    setBusy(true);
    setError('');
    setNotice('');
    try {
      const { user, token } = await verifyOtp({ email: cleanEmail, challengeId, otp });
      saveAuthSession({ user, token });
      navigate(user.role === 'staff' ? paths.staffHome : paths.visitorHome, { replace: true });
    } catch (caught) {
      setError(errorText(caught));
      setBusy(false);
    }
  }

  function changeEmail() {
    setStep('details');
    setResendIn(0);
    setOtp('');
    setError('');
    setNotice('');
  }

  return (
    <section className="page auth">
      <header className="page__header">
        <Heading className="page__title">{copy.title}</Heading>
        <p className="page__description">
          {step === 'details' ? copy.intro : `Enter the ${OTP_LENGTH}-digit code we sent to ${cleanEmail}.`}
        </p>
      </header>

      {step === 'details' ? (
        <form className="form" onSubmit={submitDetails} noValidate>
          {purpose === 'signup' && (
            <div className="form-field">
              <label htmlFor="auth-name" className="form-field__label">
                Name
              </label>
              <input
                id="auth-name"
                className="form-field__input"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                maxLength={MAX_NAME_LENGTH}
                value={name}
                disabled={busy}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          )}

          <div className="form-field">
            <label htmlFor="auth-email" className="form-field__label">
              Email
            </label>
            <input
              id="auth-email"
              className="form-field__input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@gmail.com"
              maxLength={254}
              value={email}
              disabled={busy}
              onChange={(event) => setEmail(event.target.value)}
            />
            <span className="form-field__hint">Use your Gmail address.</span>
          </div>

          {error && (
            <p className="auth__message auth__message--error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn auth__submit" disabled={busy || resendIn > 0}>
            {busy ? 'Sending…' : resendIn > 0 ? `Try again in ${resendIn}s` : copy.submit}
          </button>
        </form>
      ) : (
        <form className="form" onSubmit={submitCode} noValidate>
          <div className="form-field">
            <label htmlFor="auth-otp" className="form-field__label">
              One-time code
            </label>
            <OtpInput
              id="auth-otp"
              value={otp}
              onChange={setOtp}
              disabled={busy}
              invalid={Boolean(error)}
              describedBy="auth-otp-hint"
            />
            <span id="auth-otp-hint" className="form-field__hint">
              Check your inbox and spam folder. The code expires in 5 minutes.
            </span>
          </div>

          {notice && (
            <p className="auth__message auth__message--notice" role="status">
              {notice}
            </p>
          )}
          {error && (
            <p className="auth__message auth__message--error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn auth__submit" disabled={busy || otp.length !== OTP_LENGTH}>
            {busy ? 'Checking…' : purpose === 'signup' ? 'Confirm and continue' : 'Log in'}
          </button>

          <div className="auth__actions">
            <button type="button" className="auth__link" disabled={busy || resendIn > 0} onClick={() => void sendCode(true)}>
              {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
            </button>
            <button type="button" className="auth__link" disabled={busy} onClick={changeEmail}>
              Use a different email
            </button>
          </div>
        </form>
      )}

      <p className="form__switch">
        {purpose === 'login' ? (
          <>
            No account? <Link to={paths.signUp}>Sign up</Link>
          </>
        ) : (
          <>
            Already have an account? <Link to={paths.login}>Log in</Link>
          </>
        )}
      </p>
    </section>
  );
}
