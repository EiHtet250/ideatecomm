import { useEffect, useState } from 'react';
import type { UserProfile } from '../../types/user';
import { AUTH_CHANGED, readAuthSession, readDisplayName } from './authSession';

interface AuthUser {
  /** The signed-in user, or undefined for a guest. Their name already includes any rename. */
  user?: UserProfile;
  /** The name a guest chose for themselves, if any. */
  guestName?: string;
}

const read = (): AuthUser => {
  const user = readAuthSession()?.user;
  return user ? { user } : { guestName: readDisplayName() };
};

/** Who is using the site, kept up to date after a login, logout or rename (also from another tab). */
export function useAuthUser(): AuthUser {
  const [value, setValue] = useState(read);

  useEffect(() => {
    const refresh = () => setValue(read());
    window.addEventListener(AUTH_CHANGED, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(AUTH_CHANGED, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return value;
}
