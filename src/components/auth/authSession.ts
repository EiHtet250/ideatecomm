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

const nameKey = (email?: string) => NAME_PREFIX + (email?.toLowerCase() ?? GUEST);

/** A chosen name, and whether the account on the server already has it. */
interface SavedName {
  name: string;
  synced: boolean;
}

function readSavedName(email?: string): SavedName | undefined {
  try {
    const raw = localStorage.getItem(nameKey(email));
    if (!raw) return undefined;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = raw; // Saved as plain text by an earlier version.
    }
    const name = cleanDisplayName(isRecord(parsed) ? String(parsed.name ?? '') : String(parsed));
    return name ? { name, synced: isRecord(parsed) && parsed.synced === true } : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The name this person chose on the Profile page, if any.
 * It is kept in this browser per account (by email), or under "guest" when not logged in,
 * and replaces the name from the login. For logged-in users it is also sent to the server
 * (see updateAccountName in services/authClient.ts).
 */
export function readDisplayName(email?: string): string | undefined {
  return readSavedName(email)?.name;
}

/** Saves the chosen name in this browser. Returns false when browser storage is unavailable. */
export function saveDisplayName(name: string, email?: string): boolean {
  const clean = cleanDisplayName(name);
  if (!clean) return false;
  try {
    localStorage.setItem(nameKey(email), JSON.stringify({ name: clean, synced: false }));
    notifyChanged();
    return true;
  } catch {
    return false;
  }
}

/** Records that the server now has this name, so the next login can trust the server's copy. */
export function markDisplayNameSynced(name: string, email: string): void {
  const saved = readSavedName(email);
  if (!saved || saved.name !== cleanDisplayName(name)) return;
  try {
    localStorage.setItem(nameKey(email), JSON.stringify({ name: saved.name, synced: true }));
  } catch {
    // Storage unavailable: the name simply stays marked as not yet saved to the account.
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
    // A fresh login brings the account's current name. Drop this browser's copy when the server
    // already had it, so a rename made on another device shows here too. A name that never
    // reached the server is kept.
    if (readSavedName(session.user.email)?.synced) localStorage.removeItem(nameKey(session.user.email));
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
