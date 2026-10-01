import { NavLink } from 'react-router-dom';

interface ProfileBadgeProps {
  name: string;
  to: string;
  ariaLabel?: string;
}

/** Circular avatar placeholder with the user's name. Links to the profile page. */
export function ProfileBadge({ name, to, ariaLabel }: ProfileBadgeProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <NavLink to={to} className="profile-badge" aria-label={ariaLabel ?? `Profile: ${name}`}>
      <span className="profile-badge__avatar" aria-hidden="true">
        {initial}
      </span>
      <span className="profile-badge__name">{name}</span>
    </NavLink>
  );
}
