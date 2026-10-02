import type { UserProfile } from '../../types/user';

/** The signed-in user, kept in this browser so a page refresh does not log them out. */
export interface AuthSession {
  user: UserProfile;
  token?: string;
  /** ISO date-time string. */
  signedInAt: string;
}

const SESSION_KEY = 'mint-auth-session';
const NAME_PREFIX = 'mint-display-name:';
/** Storage key for the name of someone who is not logged in. */
const GUEST = 'guest';

/** Fired on this window whenever the session or a display name changes, so headers can update. */
export const AUTH_CHANGED = 'mint-auth-changed';

export const DISPLAY_NAME_MAX = 40;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function notifyChanged(): void {
  window.dispatchEvent(new Event(AUTH_CHANGED));
}

// ---------- display name ----------

/** Trims, removes control characters and collapses spaces. Empty when nothing usable is left. */
export function cleanDisplayName(value: string): string {
  const text = value
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return [...text].slice(0, DISPLAY_NAME_MAX).join('');
}

/**
 * The name this person chose on the Profile page, if any.
 * It is kept in this browser per account (by email), or under "guest" when not logged in,
 * and replaces the name from the login. It is not sent to the server.
 */
export function readDisplayName(email?: string): string | undefined {
  try {
    const saved = localStorage.getItem(NAME_PREFIX + (email?.toLowerCase() ?? GUEST));
    return saved ? cleanDisplayName(saved) || undefined : undefined;
  } catch {
    return undefined;
  }
}

/** Saves the chosen name. Returns false when browser storage is unavailable. */
export function saveDisplayName(name: string, email?: string): boolean {
  const clean = cleanDisplayName(name);
  if (!clean) return false;
  try {
    localStorage.setItem(NAME_PREFIX + (email?.toLowerCase() ?? GUEST), clean);
    notifyChanged();
    return true;
  } catch {
    return false;
  }
}

// ---------- session ----------

export function readAuthSession(): AuthSession | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null');
    if (!isRecord(parsed) || !isRecord(parsed.user)) return null;
    const { id, name, email, role } = parsed.user;
    if (typeof id !== 'string' || typeof name !== 'string' || typeof email !== 'string') return null;
    return {
      // A name chosen on the Profile page wins over the name the login returned.
      user: { id, name: readDisplayName(email) ?? name, email, role: role === 'staff' ? 'staff' : 'visitor' },
      token: typeof parsed.token === 'string' ? parsed.token : undefined,
      signedInAt: typeof parsed.signedInAt === 'string' ? parsed.signedInAt : '',
    };
  } catch {
    return null;
  }
}

/** Returns false when browser storage is unavailable (e.g. private mode). */
export function saveAuthSession(session: Omit<AuthSession, 'signedInAt'>): boolean {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, signedInAt: new Date().toISOString() }));
    notifyChanged();
    return true;
  } catch {
    return false;
  }
}

export function clearAuthSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    notifyChanged();
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
