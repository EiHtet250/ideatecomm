import { Link } from 'react-router-dom';
import { PagePlaceholder } from '../../components';
import { useDemoVisitorAccount } from '../../hooks/useDemoVisitorAccount';
import { EditableName } from '../../components/auth/EditableName';
import { useAuthUser } from '../../components/auth/useAuthUser';
import { LogoutButton } from '../../components/auth/LogoutButton';
import { stamps, trailStops } from '../../data';
import { paths } from '../../routes/paths';
import { TRAIL_POINTS } from '../../services/trailGame';
import { useSettings } from '../../components/settings/SettingsProvider';
import { translateVisitorText } from '../../components/settings/visitorStrings';
import './profile.css';

export function ProfilePage() {
  const { currentLanguage } = useSettings();
  const t = (text: string) => translateVisitorText(text, currentLanguage);
  const account = useDemoVisitorAccount();
  // The signed-in visitor, when there is one. Points and game progress below still come from the demo account.
  const { user: signedIn, guestName } = useAuthUser();
  const displayName = signedIn?.name ?? guestName ?? account.user.name;
  const gameComplete = account.stampIds.length === trailStops.length;
  const earnedFromGame = account.gameBonusAwarded ? TRAIL_POINTS : 0;

  return (
    <PagePlaceholder title={t("Profile")} description={t("Your visitor details and game progress.")}>
      <div className="profile-summary">
        <span className="profile-summary__avatar" aria-hidden="true">{displayName.trim().charAt(0).toUpperCase() || '?'}</span>
        <div>
          <EditableName name={displayName} email={signedIn?.email} />
          <p className="muted">{signedIn ? signedIn.email : t("Demo account · Saved on this browser")}</p>
        </div>
        <LogoutButton variant="page" className="profile-summary__logout" />
      </div>
      {!account.storageAvailable && (
        <p className="profile-storage-warning" role="alert">
          {t("Browser storage is unavailable. Your demo balance and progress may not save.")}
        </p>
      )}

      <section className="profile-points-card" aria-labelledby="profile-game-title">
        <div className="profile-points-card__top">
          <div>
            <p className="profile-points-card__eyebrow">{t("TOY TIME MACHINE")}</p>
            <h2 id="profile-game-title">{t("Game progress")}</h2>
          </div>
          <span className="profile-points-card__trophy" aria-hidden="true">✦</span>
        </div>
        <p className="profile-points-card__count">
          {account.stampIds.length} / {trailStops.length} {t("stamps collected")}
        </p>
        <div className="profile-points-card__progress" role="progressbar" aria-label={t("Game missions completed")} aria-valuenow={account.stampIds.length} aria-valuemin={0} aria-valuemax={trailStops.length}>
          <span style={{ width: `${account.stampIds.length / trailStops.length * 100}%` }} />
        </div>
        <p className="profile-points-card__earned">
          {earnedFromGame} {t("points earned")}
        </p>
        {gameComplete ? (
          <p className="profile-points-card__message">
            {t("Adventure complete! You earned {points} points. Choose your reward.").replace("{points}", String(TRAIL_POINTS))}
          </p>
        ) : account.gameBonusAwarded ? (
          <p className="profile-points-card__message">
            {t("You already earned the one-time {points}-point game bonus. Restarting the game does not earn more points.").replace("{points}", String(TRAIL_POINTS))}
          </p>
        ) : (
          <p className="profile-points-card__message">
            {t("Complete all three missions to earn {points} points.").replace("{points}", String(TRAIL_POINTS))}
          </p>
        )}
        <ul className="profile-points-card__stamps" aria-label={t("Collected mission stamps")}>
          {stamps.map(stamp => (
            <li key={stamp.id} className={account.stampIds.includes(stamp.id) ? 'earned' : ''}>
              <span aria-hidden="true">{account.stampIds.includes(stamp.id) ? '★' : '○'}</span>
              {t(stamp.name)}
            </li>
          ))}
        </ul>
        <div className="profile-actions">
          <Link to={paths.toyGame} className="home-card__link">
            {t(gameComplete ? 'View completed game →' : 'Continue Toy Game →')}
          </Link>
          <Link to={paths.rewards} className="home-card__link profile-actions__secondary">
            {t("Browse rewards")}
          </Link>
        </div>
      </section>

      <section className="available-points-card" aria-labelledby="available-points-title">
        <div>
          <p className="profile-points-card__eyebrow">{t("READY FOR YOUR NEXT ADVENTURE")}</p>
          <h2 id="available-points-title">{t("Available points")}</h2>
        </div>
        <strong>{account.pointsBalance}</strong>
        <Link to={paths.rewards} className="home-card__link">{t("Browse rewards →")}</Link>
      </section>
    </PagePlaceholder>
  );
}
