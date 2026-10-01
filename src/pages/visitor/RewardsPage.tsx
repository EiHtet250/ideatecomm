import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDemoVisitorAccount } from '../../hooks/useDemoVisitorAccount';
import { paths } from '../../routes/paths';
import { redeemReward, REWARDS, rewardStockRemaining, type Reward } from '../../services/rewards';
import { useSettings } from '../../components/settings/SettingsProvider';
import { translateVisitorText } from '../../components/settings/visitorStrings';
import './rewards.css';

type SelectedReward = { reward: Reward; requestId: string };

const makeRequestId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function RewardsPage() {
  const { currentLanguage } = useSettings();
  const t = (text: string) => translateVisitorText(text, currentLanguage);
  const dateLabel = (date: string) => new Date(date).toLocaleString(
    currentLanguage === 'zh' ? 'zh-CN' : currentLanguage === 'ms' ? 'ms-MY' : currentLanguage === 'ta' ? 'ta-IN' : 'en',
  );
  const account = useDemoVisitorAccount();
  const [selected, setSelected] = useState<SelectedReward | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selected) dialogRef.current?.showModal();
    else if (dialogRef.current?.open) dialogRef.current.close();
  }, [selected]);

  function confirmRedemption() {
    if (!selected) return;
    setError('');
    const result = redeemReward(selected.reward.id, selected.requestId);
    if (!result.success) {
      setError(result.reason === 'insufficient'
        ? t('You need {points} more points.').replace('{points}', String(Math.max(0, selected.reward.cost - account.pointsBalance)))
        : result.reason === 'unavailable'
          ? t('Out of stock. Please choose another reward.')
          : result.reason === 'storage'
            ? t('We could not save this redemption on this browser. No points were deducted; please check your browser storage and try again.')
            : t('This reward is no longer available.'));
      return;
    }
    setSuccess(t('Reward reserved! Your demo-only reference is {id}.').replace('{id}', result.redemption.id));
    setSelected(null);
  }

  return (
    <div className="rewards-page">
      <header className="rewards-hero">
        <p className="rewards-eyebrow">{t('TOY TIME MACHINE')}</p>
        <h1>{t('Rewards')}</h1>
        <p>{t('Choose a treat for your adventure. These rewards are demo proposals only.')}</p>
        <p className="rewards-balance" aria-live="polite">
          <span>{t('Available points')}</span>
          <strong>{account.pointsBalance}</strong>
        </p>
      </header>

      <aside className="rewards-demo-note">
        {t('The Toy Time Machine offers a one-time total of 20 points after all three missions are complete. Replaying the game will not earn more points. Reward costs and stock are demo settings; real rewards require secure server validation.')}
      </aside>
      {!account.storageAvailable && (
        <p className="rewards-error" role="alert">
          {t('Browser storage is unavailable. Progress and rewards may not save; redemptions are disabled until storage is available.')}
        </p>
      )}

      {success && <p className="rewards-success" role="status">{success}</p>}

      <section aria-labelledby="catalogue-title">
        <h2 id="catalogue-title">{t('Choose a reward')}</h2>
        <div className="rewards-catalogue">
          {REWARDS.map(reward => {
            const stock = rewardStockRemaining(account, reward);
            const remaining = Math.max(0, reward.cost - account.pointsBalance);
            const unavailable = stock <= 0;
            return (
              <article className="reward-card" key={reward.id}>
                <span className="reward-card__icon" aria-hidden="true">{reward.icon}</span>
                <h3>{t(reward.name)}</h3>
                <p>{t(reward.description)}</p>
                <p className="reward-card__cost"><strong>{reward.cost}</strong> {t('points')}</p>
                <p className="reward-card__availability">
                  {unavailable ? t('Out of stock') : t('{stock} available (demo stock)').replace('{stock}', String(stock))}
                </p>
                {reward.demoOnly && <p className="reward-card__demo">{t('Demo only · no voucher code issued')}</p>}
                <button
                  className="btn"
                  type="button"
                  disabled={!account.storageAvailable || unavailable || remaining > 0}
                  onClick={() => {
                    setSuccess('');
                    setError('');
                    setSelected({ reward, requestId: makeRequestId() });
                  }}
                >
                  {unavailable ? t('Out of stock') : remaining > 0 ? t('You need {points} more points').replace('{points}', String(remaining)) : t('Redeem')}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="my-rewards" aria-labelledby="my-rewards-title">
        <h2 id="my-rewards-title">{t('My rewards')}</h2>
        {account.redemptions.length === 0 ? (
          <p>{t('No rewards yet. Choose one above when you’re ready!')}</p>
        ) : (
          <ul>
            {account.redemptions.map(redemption => (
              <li key={redemption.id}>
                <div>
                  <strong>{t(REWARDS.find(reward => reward.id === redemption.rewardId)?.name ?? redemption.rewardName)}</strong>
                  <span>{redemption.pointsSpent} {t('points')} · {dateLabel(redemption.createdAt)}</span>
                  <code>{t('Demo-only reference: {id}').replace('{id}', redemption.id)}</code>
                </div>
                <span className={`reward-status reward-status--${redemption.status}`}>
                  {t(redemption.status === 'ready' ? 'Ready to use' : 'Used')}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="rewards-staff-note">
          {t('In a live service, only authorised staff can mark a reward as used. No visitor-side status controls are available in this demo.')}
        </p>
      </section>

      <section className="points-history" aria-labelledby="points-history-title">
        <h2 id="points-history-title">{t('Points activity')}</h2>
        {account.pointsActivity.length === 0 ? (
          <p>{t('Complete all three Toy Time Machine missions to earn 20 points.')}</p>
        ) : (
          <ul>
            {account.pointsActivity.map(activity => (
              <li key={activity.id}>
                <span>{activity.description}</span>
                <time dateTime={activity.createdAt}>{dateLabel(activity.createdAt)}</time>
                <strong className={activity.type === 'earned' ? 'points-earned' : 'points-spent'}>
                  {activity.type === 'earned' ? '+' : '−'}{activity.points}
                </strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="rewards-backlinks">
        <Link className="home-card__link" to={paths.profile}>{t('Back to Profile')}</Link>
        <Link className="home-card__link" to={paths.toyGame}>{t('View Toy Time Machine')}</Link>
      </div>

      <dialog
        className="reward-dialog"
        ref={dialogRef}
        aria-labelledby="redeem-title"
        onCancel={event => {
          event.preventDefault();
          dialogRef.current?.close();
          setSelected(null);
          setError('');
        }}
        onKeyDown={event => {
          if (event.key === 'Escape' && dialogRef.current?.open) {
            event.preventDefault();
            dialogRef.current.close();
            setSelected(null);
            setError('');
          }
        }}
        onClose={() => {
          if (selected) setSelected(null);
        }}
      >
        {selected && (
          <form method="dialog" onSubmit={event => event.preventDefault()}>
            <p className="rewards-eyebrow">{t('CONFIRM REDEMPTION · DEMO')}</p>
            <h2 id="redeem-title">{t(selected.reward.name)}</h2>
            <p>{t(selected.reward.description)}</p>
            <p><strong>{t('Cost:')}</strong> {selected.reward.cost} {t('points')}</p>
            <p><strong>{t('After redemption:')}</strong> {account.pointsBalance - selected.reward.cost} {t('points remaining')}</p>
            <p><strong>{t('Terms:')}</strong> {t(selected.reward.terms)}</p>
            {selected.reward.demoOnly && (
              <p className="rewards-demo-note">{t('This is a demo proposal, not a real voucher or an official FairPrice partnership. No voucher code will be created.')}</p>
            )}
            {error && <p className="rewards-error" role="alert">{error}</p>}
            <div className="reward-dialog__actions">
              <button className="btn btn--secondary" type="button" onClick={() => {
                setSelected(null);
                setError('');
              }}>{t('Cancel')}</button>
              <button className="btn" type="button" disabled={!account.storageAvailable || rewardStockRemaining(account, selected.reward) <= 0 || account.pointsBalance < selected.reward.cost} onClick={confirmRedemption}>
                {t('Confirm redemption')}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}
