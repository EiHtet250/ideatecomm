import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { exhibits, stamps, trailStops } from '../../data';
import { saveDemoVisitorProgress } from '../../services/demoVisitor';
import { useDemoVisitorAccount } from '../../hooks/useDemoVisitorAccount';
import { answerQuestion, checkAnswer, currentQuestion, demoQrCodes, earnedStamps, newProgress, TRAIL_POINTS } from '../../services/trailGame';
import { QrScanner, type ScanFeedback } from '../../components/trail/QrScanner';
import { paths } from '../../routes/paths';
import { useSettings } from '../../components/settings/SettingsProvider';
import { translateVisitorText } from '../../components/settings/visitorStrings';
import './discoveryTrail.css';
import './discoveryTrailChoices.css';
import './toyGameFeedback.css';

function ToyPhoto({ imageUrl, title, isDemo, t }: { imageUrl?: string; title: string; isDemo?: boolean; t: (text: string) => string }) {
  const [failed, setFailed] = useState(false);
  return <div className="trail-photo">
    {imageUrl && !failed ? <><img src={imageUrl} alt={t(title)} onError={() => setFailed(true)} /><small>{t(isDemo ? 'Demo illustration' : 'Image: MINT Museum of Toys')}</small></>
      : <><span aria-hidden="true">✦</span><strong>{t('Toy photo unavailable')}</strong><small>{t('Use the exhibit information below to continue.')}</small></>}
  </div>;
}

export function DiscoveryTrailPage() {
  const { currentLanguage } = useSettings();
  const t = (text: string) => translateVisitorText(text, currentLanguage);
  const account = useDemoVisitorAccount();
  const [progress, setProgress] = useState(() => account.progress);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [scanning, setScanning] = useState(false);
  /** Message under the answer box after a wrong answer. `shown` changes each time so the shake replays. */
  const [wrong, setWrong] = useState<{ text: string; shown: number } | null>(null);
  /** Pop-up after a correct answer. */
  const [result, setResult] = useState<{ stampName?: string; story?: string; finished: boolean; clue: number; clues: number } | null>(null);
  const active = currentQuestion(progress);
  const stampIds = earnedStamps(progress);
  const exhibit = active ? exhibits.find(item => item.id === active.question.exhibitId) : undefined;
  const stopQuestionIds = active
    ? progress.selectedQuestionIds.filter(id => active.stop.questions.some(question => question.id === id))
    : [];

  function submit(value: string) {
    const before = earnedStamps(progress).length;
    const result = answerQuestion(progress, value);
    if (!result.correct) {
      const text = t(active?.question.type === 'find' ? 'That code belongs to another toy. Keep looking.' : 'Not quite. Check the toy information and try again.');
      setFeedback(text);
      setWrong({ text, shown: Date.now() });
      return;
    }
    const after = earnedStamps(result.progress).length;
    const savedAccount = saveDemoVisitorProgress(result.progress);
    if (!savedAccount.storageAvailable) {
      setFeedback(t('We could not save your game progress in this browser. Check browser storage and try again.'));
      return;
    }
    setProgress(result.progress);
    setAnswer('');
    setWrong(null);
    setResult({
      stampName: after > before ? stamps.find(item => item.id === active?.stop.stampId)?.name : undefined,
      story: after > before ? active?.stop.storySuccess : undefined,
      finished: after === trailStops.length,
      clue: active ? stopQuestionIds.indexOf(active.question.id) + 1 : 0,
      clues: stopQuestionIds.length,
    });
    setFeedback(after > before ? `${t('Stamp collected! ')}${active?.stop.storySuccess ? t(active.stop.storySuccess) : ''}` : t('Correct! Next clue unlocked.'));
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('scan');
    if (!code) return;
    url.searchParams.delete('scan');
    window.history.replaceState(null, '', url);
    const now = currentQuestion(progress);
    if (now?.question.type === 'find') submit(code);
    else setFeedback(t('This question needs a written answer. Scanning cannot skip it.'));
    // Run once for the arrival URL; subsequent progress changes must not rescan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAnswer = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); submit(answer); };

  /** Camera scans and typed codes for "find the toy" questions. A QR may hold the code or a link with ?scan=CODE. */
  function onScan(scanned: string): ScanFeedback {
    let code = scanned.trim();
    try { code = new URL(code).searchParams.get('scan')?.trim() || code; } catch { /* not a link */ }
    code = code.toUpperCase();
    if (!active || active.question.type !== 'find' || !checkAnswer(active.question, code)) {
      return { done: false, message: t('That code belongs to another toy. Keep looking.') };
    }
    setScanning(false);
    submit(code);
    return { done: true };
  }
  const currentIndex = active ? trailStops.findIndex(stop => stop.id === active.stop.id) : trailStops.length;

  return <div className="trail-page">
    <header className="trail-hero"><p className="trail-eyebrow">{t('TOY GAME · OUTERSPACE DEMO')}</p>
      <h1>{t('The Toy Time Machine')}</h1><p>{t('Three dials have stopped working: Launch, Direction, and Home. Find the toys and solve their clues to restore them.')}</p></header>
    <section className="trail-passport" aria-label={t('Your trail progress')}>
      <div><strong>{stampIds.length} / {trailStops.length} {t('stamps')}</strong><span>{t('One stamp per finished mission')}</span></div>
      <div><strong>{account.gameBonusAwarded ? TRAIL_POINTS : 0} {t('points earned')}</strong><span>{t('One-time game completion bonus')}</span></div>
      <div><strong>{account.pointsBalance} {t('available')}</strong><span>{t('Choose rewards to spend points')}</span></div>
    </section>
    <ol className="trail-stamps" aria-label={t('Mission stamps')}>
      {trailStops.map((stop, index) => <li key={stop.id} className={stampIds.includes(stop.stampId) ? 'earned' : index === currentIndex ? 'active' : ''}>
        <span aria-hidden="true">{stampIds.includes(stop.stampId) ? '★' : index + 1}</span>
        <div><strong>{t(stamps.find(item => item.id === stop.stampId)?.name ?? '')}</strong><small>{t(stop.challenge)}</small></div>
      </li>)}
    </ol>
    {active && exhibit ? <section className="trail-question" aria-labelledby="trail-question-title">
      <p className="trail-eyebrow">{t('MISSION {mission} / 3 · CLUE {clue} / {total}').replace('{mission}', String(currentIndex + 1)).replace('{clue}', String(stopQuestionIds.indexOf(active.question.id) + 1)).replace('{total}', String(stopQuestionIds.length))}</p>
      <h2 id="trail-question-title">{t(active.stop.challenge)}</h2><p>{t(active.stop.storyIntro)}</p>
      <ToyPhoto key={exhibit.id} imageUrl={exhibit.imageUrl} title={exhibit.title} isDemo={exhibit.isDemo} t={t} />
      <h3>{t(active.question.prompt)}</h3>
      {active.question.sentence && <p className="trail-sentence">{t(active.question.sentence)}</p>}
      <form onSubmit={onAnswer} className="trail-answer">
        {active.question.type === 'multiple-choice' ? <fieldset className="trail-choice-list">
          <legend>{t('Choose one answer')}</legend>
          {(active.question.choices ?? []).map(choice => <label key={choice}>
            <input type="radio" name="trail-answer" value={choice} checked={answer === choice} onChange={() => setAnswer(choice)} required />
            <span>{t(choice)}</span>
          </label>)}
        </fieldset> : active.question.type === 'find' ? (
          <button type="button" className="btn" onClick={() => setScanning(true)}>{t('Scan QR code')}</button>
        ) : <>
          <label htmlFor="trail-answer-input">{t(active.question.type === 'name' ? 'Toy name' : 'Missing word')}</label>
          <input id="trail-answer-input" value={answer} onChange={event => setAnswer(event.target.value)} autoComplete="off" required />
        </>}
        {active.question.type !== 'find' && <button type="submit" className="btn">{t('Check answer')}</button>}
      </form>
      {wrong && <p key={wrong.shown} className="tg-wrong" role="alert">{wrong.text}</p>}
      {scanning && active.question.type === 'find' && (
        <QrScanner target={t(exhibit.title)} onCode={onScan} onClose={() => setScanning(false)} />
      )}
      {active.question.type === 'find' && <div className="trail-demo-scan"><p>{t('Demo scan controls')}</p>
        <button type="button" onClick={() => submit(demoQrCodes[active.question.exhibitId])}>{t('Scan the correct toy')}</button>
        <button type="button" onClick={() => submit('MINT-SPACE-WRONG')}>{t('Scan a different toy')}</button>
      </div>}
      <details className="trail-label"><summary>{t('View demo exhibit information')}</summary>
        <strong>{t(exhibit.title)}</strong><p>{t(exhibit.description)}</p>
        {exhibit.isDemo ? <small>{t('This is fictional demo content, not a museum exhibit.')}</small>
          : <small>{t('Facts from ')}<a href="https://emint.com/outerspace/" target="_blank" rel="noreferrer">{t('MINT’s Outerspace collection')}</a>{t('. Physical display wording has not been checked.')}</small>}
      </details>
    </section> : <section className="trail-question trail-finish"><p className="trail-eyebrow">{t('MISSION COMPLETE')}</p>
      <h2>{t('The Toy Time Machine is restored!')}</h2>
      <p>{t(account.gameBonusAwarded
        ? 'Adventure complete! Your one-time {points}-point game bonus is saved. Choose your reward.'
        : 'Adventure complete! You earned {points} points. Choose your reward.').replace('{points}', String(TRAIL_POINTS))}</p>
      <p>{t('This game offers a one-time total of {points} points. Replaying will not earn more.').replace('{points}', String(TRAIL_POINTS))}</p>
      <Link className="home-card__link" to={paths.rewards}>{t('Browse rewards →')}</Link>
    </section>}
    {result && <div className="dt-celebrate" role="dialog" aria-modal="true" aria-labelledby="tg-result-title">
      <div className="dt-celebrate__panel">
        {result.stampName ? <svg className="tg-result__icon tg-result__icon--stamp" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="tg-result__disc" cx="50" cy="50" r="44" />
          <path className="tg-result__star" d="M50 22 L58 40.5 L78 42.5 L63 56 L67.5 76 L50 65.5 L32.5 76 L37 56 L22 42.5 L42 40.5 Z" />
        </svg> : <svg className="tg-result__icon" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="tg-result__disc" cx="50" cy="50" r="44" />
          <path className="tg-result__tick" d="M29 52 L44 66 L72 36" />
        </svg>}
        <h2 id="tg-result-title">{t(result.stampName ? 'Stamp collected!' : 'Correct!')}</h2>
        {result.stampName && <p className="dt-celebrate__name">{t(result.stampName)}</p>}
        {result.story && <p>{t(result.story)}</p>}
        {!result.stampName && <>
          <p>{t('Clue {clue} of {total} solved.').replace('{clue}', String(result.clue)).replace('{total}', String(result.clues))}</p>
          <div className="tg-result__progress" aria-hidden="true">
            {Array.from({ length: result.clues }, (_, index) => <span key={index} className={index < result.clue ? 'is-done' : ''} />)}
          </div>
        </>}
        {result.finished && <p className="dt-celebrate__next">{t('The Toy Time Machine is restored!')}</p>}
        <button type="button" className="dt-btn dt-btn--big" autoFocus onClick={() => setResult(null)}>
          {t(result.finished ? 'See my result' : result.stampName ? 'Next mission' : 'Next clue')}
        </button>
      </div>
    </div>}
    <p className="trail-feedback" role="status" aria-live="polite">{feedback}</p>
    <p className="trail-footnote">{t('This prototype uses sample QR codes and browser saved progress. Museum photos, physical placements, label wording, and real reward rules still need approval.')}</p>
    <button type="button" className="trail-reset" onClick={() => {
      const empty = newProgress();
      const saved = saveDemoVisitorProgress(empty);
      if (!saved.storageAvailable) {
        setFeedback(t('We could not save the restarted game in this browser. Check browser storage and try again.'));
        return;
      }
      setProgress(empty);
      setWrong(null);
      setFeedback(t('Demo restarted. Your points and reward history stay saved, and this game bonus can only be earned once.'));
      setAnswer('');
    }}>{t('Restart demo')}</button>
  </div>;
}
