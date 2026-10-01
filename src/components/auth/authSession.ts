import type { UserProfile } from '../../types/user';

/** The signed-in user, kept in this browser so a page refresh does not log them out. */
export interface AuthSession {
  user: UserProfile;
  token?: string;
  /** ISO date-time string. */
  signedInAt: string;
}

const SESSION_KEY = 'mint-auth-session';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readAuthSession(): AuthSession | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null');
    if (!isRecord(parsed) || !isRecord(parsed.user)) return null;
    const { id, name, email, role } = parsed.user;
    if (typeof id !== 'string' || typeof name !== 'string' || typeof email !== 'string') return null;
    return {
      user: { id, name, email, role: role === 'staff' ? 'staff' : 'visitor' },
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
    return true;
  } catch {
    return false;
  }
}

export function clearAuthSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
