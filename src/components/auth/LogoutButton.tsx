import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { clearAuthSession, readAuthSession } from './authSession';
import './logout.css';

interface LogoutButtonProps {
  /** 'header' is a compact text button for the top bar; 'page' is a full button for the Profile page. */
  variant?: 'header' | 'page';
  className?: string;
}

/**
 * Signs the user out of this browser and returns to the login page.
 * When nobody is logged in (the team preview links) it reads "Exit" and simply goes back to the login page.
 */
export function LogoutButton({ variant = 'header', className = '' }: LogoutButtonProps) {
  const navigate = useNavigate();
  const signedIn = Boolean(readAuthSession());

  const leave = () => {
    clearAuthSession();
    navigate(paths.devPreview, { replace: true });
  };

  return (
    <button type="button" className={`logout logout--${variant} ${className}`} onClick={leave}>
      <svg className="logout__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 4 H5 V20 H10 M15 8 L19 12 L15 16 M19 12 H9" />
      </svg>
      <span className="logout__text">{signedIn ? 'Log out' : 'Exit'}</span>
    </button>
  );
}
