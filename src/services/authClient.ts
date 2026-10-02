/**
 * authClient: talks to the MINT auth n8n workflows (email + one-time passcode).
 * Kept separate from n8nClient.ts because the auth webhooks live under a different base URL.
 *
 * Endpoints (relative to VITE_AUTH_BASE_URL, e.g. https://<host>/webhook/mint-auth):
 *
 *   POST /request-otp   { email, purpose: 'login' | 'signup', name? }
 *     200 { success: true, message, challengeId, expiresAt }
 *     400 invalid input (Gmail addresses only) · 403 account disabled
 *     404 { signupRequired: true } · 409 { loginRequired: true } · 429 { retryAfter }
 *
 *   POST /verify-otp    { email, challengeId, otp }
 *     200 { success: true, user: { id, name, email, role }, token? }
 *
 *   POST /update-name   { email, name }        (n8n/workflows/mint-auth-update-name.json)
 *     200 { success: true, user: { email, name } }
 *     Optional: when this workflow is not installed, a rename stays in the browser only.
 *
 * Every failure reply is { success: false, message }.
 */
import type { UserProfile, UserRole } from '../types/user';

export type AuthPurpose = 'login' | 'signup';

export type AuthErrorCode =
  | 'VALIDATION'
  | 'SIGNUP_REQUIRED'
  | 'LOGIN_REQUIRED'
  | 'DISABLED'
  | 'RATE_LIMITED'
  | 'INVALID_OTP'
  | 'NETWORK'
  | 'TIMEOUT'
  | 'CONFIG'
  | 'SERVER';

export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  VALIDATION: 'Please check what you typed and try again.',
  SIGNUP_REQUIRED: 'We could not find an account for this email. Please sign up first.',
  LOGIN_REQUIRED: 'This email already has an account. Please log in.',
  DISABLED: 'This account is disabled. Please contact museum staff.',
  RATE_LIMITED: 'Please wait a moment before requesting another code.',
  INVALID_OTP: 'That code is not correct or has expired. Please try again or request a new code.',
  NETWORK: 'We cannot reach the museum service. Please check your internet connection and try again.',
  TIMEOUT: 'This is taking too long. Please try again.',
  CONFIG: 'Login is not set up yet. Please ask a staff member for help.',
  SERVER: 'Something went wrong on our side. Please try again in a moment.',
};

/** `message` is safe to show to visitors. */
export class AuthError extends Error {
  readonly code: AuthErrorCode;
  /** Seconds to wait before asking for another code (RATE_LIMITED only). */
  readonly retryAfter?: number;

  constructor(code: AuthErrorCode, message?: string, retryAfter?: number) {
    super(message || AUTH_ERROR_MESSAGES[code]);
    this.name = 'AuthError';
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export interface OtpChallenge {
  /** Identifies this code request; sent back when verifying. */
  challengeId: string;
  /** ISO date-time string, when the workflow provides it. */
  expiresAt?: string;
}

export interface VerifiedLogin {
  user: UserProfile;
  /** Session token, when the workflow returns one. */
  token?: string;
}

const TIMEOUT_MS = 20_000;
const MAX_SERVER_MESSAGE_LENGTH = 200;

function getBaseUrl(): string {
  const baseUrl = (import.meta.env.VITE_AUTH_BASE_URL as string | undefined)?.trim().replace(/\/+$/, '') ?? '';
  if (!baseUrl) {
    console.error('[authClient] Missing VITE_AUTH_BASE_URL. Add it to .env.local, then restart "npm run dev".');
    throw new AuthError('CONFIG');
  }
  return baseUrl;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function serverMessage(json: Record<string, unknown>): string | undefined {
  const text = json.message;
  if (typeof text !== 'string' || !text.trim() || text.length > MAX_SERVER_MESSAGE_LENGTH) return undefined;
  return text.trim();
}

function failure(status: number, json: Record<string, unknown>, fallback: AuthErrorCode): AuthError {
  const message = serverMessage(json);
  if (json.signupRequired === true) return new AuthError('SIGNUP_REQUIRED', message);
  if (json.loginRequired === true) return new AuthError('LOGIN_REQUIRED', message);
  if (status === 403) return new AuthError('DISABLED', message);
  if (status === 429) {
    const retryAfter = Number(json.retryAfter);
    return new AuthError('RATE_LIMITED', message, Number.isFinite(retryAfter) && retryAfter > 0 ? Math.ceil(retryAfter) : undefined);
  }
  return new AuthError(fallback, message);
}

/** POSTs JSON and returns the parsed reply. Throws AuthError when the request or the workflow fails. */
async function post(path: string, body: unknown, fallback: AuthErrorCode): Promise<Record<string, unknown>> {
  const url = `${getBaseUrl()}${path}`;
  const controller = new AbortController();
  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);

  let response: Response;
  let text: string;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'omit',
    });
    text = await response.text();
  } catch {
    // fetch rejects on network failure, DNS errors and CORS blocks.
    throw new AuthError(timedOut ? 'TIMEOUT' : 'NETWORK');
  } finally {
    window.clearTimeout(timer);
  }

  let parsed: unknown;
  try {
    parsed = text ? JSON.parse(text) : undefined;
  } catch {
    parsed = undefined;
  }
  const json = isRecord(parsed) ? parsed : {};

  if (json.success === false || (response.status >= 400 && response.status < 500)) {
    throw failure(response.status, json, fallback);
  }
  // Not our reply shape: an n8n error page or an inactive workflow.
  if (!response.ok || json.success !== true) throw new AuthError('SERVER');
  return json;
}

function toRole(value: unknown): UserRole {
  return value === 'staff' ? 'staff' : 'visitor';
}

/** Asks n8n to email a one-time passcode. `name` is only sent when signing up. */
export async function requestOtp(input: { email: string; name?: string; purpose: AuthPurpose }): Promise<OtpChallenge> {
  const body: Record<string, string> = { email: input.email, purpose: input.purpose };
  if (input.purpose === 'signup' && input.name) body.name = input.name;

  const json = await post('/request-otp', body, 'VALIDATION');
  if (typeof json.challengeId !== 'string' || !json.challengeId) throw new AuthError('SERVER');
  return {
    challengeId: json.challengeId,
    expiresAt: typeof json.expiresAt === 'string' ? json.expiresAt : undefined,
  };
}

/** Checks the passcode. Resolves with the signed-in user, or throws AuthError('INVALID_OTP'). */
export async function verifyOtp(input: { email: string; challengeId: string; otp: string }): Promise<VerifiedLogin> {
  const json = await post(
    '/verify-otp',
    { email: input.email, challengeId: input.challengeId, otp: input.otp },
    'INVALID_OTP',
  );

  const user = isRecord(json.user) ? json.user : {};
  const email = typeof user.email === 'string' && user.email ? user.email : input.email;

  return {
    user: {
      id: typeof user.id === 'string' || typeof user.id === 'number' ? String(user.id) : email,
      name: typeof user.name === 'string' && user.name.trim() ? user.name.trim() : email.split('@')[0],
      email,
      role: toRole(user.role),
    },
    token: typeof json.token === 'string' ? json.token : undefined,
  };
}

/**
 * Saves a renamed user's name to their account, so it follows them to other devices.
 * Resolves false when it could not be saved (offline, or the workflow is not installed);
 * the caller keeps the name in the browser either way.
 *
 * NOTE: the request is identified only by the email the browser sends. That is prototype-level
 * protection; a real deployment needs the login to issue a token that n8n verifies.
 */
export async function updateAccountName(input: { email: string; name: string }): Promise<boolean> {
  try {
    await post('/update-name', { email: input.email, name: input.name }, 'VALIDATION');
    return true;
  } catch {
    return false;
  }
}
