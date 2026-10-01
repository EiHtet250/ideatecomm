import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFloorPlan } from '../../data/map/floorPlans';
import { DISCOVERY_TRAIL, spotsOnFloor, trailFloors, trailSpots } from '../../data/trail/discoveryTrail';
import { paths } from '../../routes/paths';
import {
  activeSpot,
  currentFloorId,
  floorStatus,
  isComplete,
  loadPlayerState,
  mergeCompleted,
  saveTrailState,
  submitScan,
  trailPlayer,
  type ScanResult,
  type TrailState,
} from '../../services/discoveryTrail';
import { fetchCompletedSpots, isTrailSyncConfigured, saveCompletedSpot } from '../../services/trailSync';
import type { FloorId } from '../../types/map';
import { QrScanner, type ScanFeedback } from './QrScanner';
import { StampBadge } from './StampArt';
import { TrailMap } from './TrailMap';
import './trail.css';

type Success = Extract<ScanResult, { status: 'success' }>;

const floorLabel = (floorId: FloorId) => getFloorPlan(floorId).name;

/** The Discovery Trail game: find a spot, scan its QR code, collect its stamp, unlock the next. */
export function DiscoveryTrail() {
  const [player] = useState(trailPlayer);
  const [state, setState] = useState<TrailState>(() => loadPlayerState(player));
  const [viewFloorId, setViewFloorId] = useState<FloorId>(() => currentFloorId(state));
  const [scanning, setScanning] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [celebration, setCelebration] = useState<Success>();

  const savesToAccount = Boolean(player.email) && isTrailSyncConfigured();
  const active = activeSpot(state);
  const total = trailSpots.length;
  const collected = state.completedSpotIds.length;
  const finished = !active;

  // Bring in stamps this visitor collected on another device.
  useEffect(() => {
    if (!player.email) return;
    let cancelled = false;
    void fetchCompletedSpots(player.email).then((spotIds) => {
      if (cancelled || !spotIds) return;
      setState((current) => {
        const merged = mergeCompleted(current, spotIds);
        if (merged.completedSpotIds.length === current.completedSpotIds.length) return current;
        saveTrailState(player.key, merged);
        return merged;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [player]);

  /** The single check for every code, whether it came from the camera or was typed. */
  const handleCode = (code: string): ScanFeedback => {
    const { state: next, result } = submitScan(state, code);
    if (result.status !== 'success') return { done: false, message: result.message };

    setState(next);
    saveTrailState(player.key, next);
    if (player.email) void saveCompletedSpot(player.email, result.spot.id, result.spot.qrCode);
    setScanning(false);
    setHintShown(false);
    setCelebration(result);
    return { done: true };
  };

  const closeScanner = useCallback(() => setScanning(false), []);

  const closeCelebration = () => {
    setCelebration(undefined);
    setViewFloorId(currentFloorId(state));
  };

  const restartDemo = () => {
    const fresh: TrailState = { completedSpotIds: [] };
    setState(fresh);
    saveTrailState(player.key, fresh);
    setViewFloorId(currentFloorId(fresh));
    setHintShown(false);
  };

  const viewingActiveFloor = active?.floorId === viewFloorId;
  const floorSpots = spotsOnFloor(viewFloorId);
  const floorDone = floorSpots.filter((spot) => isComplete(state, spot.id)).length;

  return (
    <section className="page dt">
      <header className="dt-hero">
        <div>
          <p className="dt-hero__eyebrow">
            Discovery Trail
            {DISCOVERY_TRAIL.isDemo && <span className="dt-demo">Demo trail</span>}
          </p>
          <h1 className="dt-hero__title">{DISCOVERY_TRAIL.name}</h1>
          <p className="dt-hero__text">Follow the clues, find each spot in the museum and scan its QR code to collect a toy stamp.</p>
        </div>
        <div className="dt-progress" role="group" aria-label="Overall progress">
          <strong>
            {collected} of {total} stamps
          </strong>
          <div className="dt-progress__bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={collected} aria-label="Stamps collected">
            <span style={{ width: `${(collected / total) * 100}%` }} />
          </div>
          <span className="dt-progress__note">
            {savesToAccount
              ? `Saved to your account (${player.email}).`
              : player.email
                ? 'Saved on this device.'
                : 'Playing as a guest: stamps are saved on this device only.'}
          </span>
        </div>
      </header>

      {finished && (
        <div className="dt-card dt-finished">
          <h2>Adventure complete!</h2>
          <p>
            You found every spot and collected all {total} stamps. You earned {total * DISCOVERY_TRAIL.pointsPerStamp} reward
            points on this trail.
          </p>
          <div className="dt-actions">
            <Link to={paths.rewards} className="dt-btn">
              See my rewards
            </Link>
            {DISCOVERY_TRAIL.isDemo && !savesToAccount && (
              <button type="button" className="dt-btn dt-btn--ghost" onClick={restartDemo}>
                Restart demo trail
              </button>
            )}
          </div>
        </div>
      )}

      <nav className="dt-floors" aria-label="Trail floors">
        {trailFloors.map((floorId) => {
          const status = floorStatus(state, floorId);
          return (
            <button
              key={floorId}
              type="button"
              className={`dt-floor dt-floor--${status}`}
              aria-pressed={floorId === viewFloorId}
              disabled={status === 'locked'}
              onClick={() => setViewFloorId(floorId)}
            >
              <span className="dt-floor__icon" aria-hidden="true">
                {status === 'completed' ? '✓' : status === 'locked' ? '🔒' : '★'}
              </span>
              {floorLabel(floorId)}
              <span className="dt-floor__state">
                {status === 'completed' ? 'Complete' : status === 'locked' ? 'Locked' : 'Now playing'}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="dt-card dt-clue">
        <p className="dt-clue__where">
          {floorLabel(viewFloorId)} · {floorDone} of {floorSpots.length} {floorSpots.length === 1 ? 'spot' : 'spots'} found
        </p>
        {active && viewingActiveFloor && (
          <>
            <h2 className="dt-clue__title">
              <span className="dt-clue__number">{trailSpots.indexOf(active) + 1}</span>
              {active.title}
            </h2>
            <p className="dt-clue__text">{active.clue}</p>
            {hintShown && (
              <p className="dt-clue__hint" role="status">
                <strong>Hint:</strong> {active.hint}
              </p>
            )}
            <div className="dt-actions">
              <button type="button" className="dt-btn dt-btn--big" onClick={() => setScanning(true)}>
                Scan QR code
              </button>
              <button type="button" className="dt-btn dt-btn--ghost" onClick={() => setHintShown(true)} disabled={hintShown}>
                Need a hint?
              </button>
              <Link to={`${paths.museumMap}?to=${active.placeId}`} className="dt-btn dt-btn--ghost">
                Show me the way
              </Link>
            </div>
          </>
        )}
        {active && !viewingActiveFloor && (
          <>
            <h2 className="dt-clue__title">You finished this floor!</h2>
            <p className="dt-clue__text">Your next clue is waiting on {floorLabel(active.floorId)}.</p>
            <div className="dt-actions">
              <button type="button" className="dt-btn" onClick={() => setViewFloorId(active.floorId)}>
                Go to {floorLabel(active.floorId)}
              </button>
            </div>
          </>
        )}
        {finished && <p className="dt-clue__text">Every spot on this floor has been found. Tap a floor above to look back at your trail.</p>}
      </div>

      <TrailMap floorId={viewFloorId} state={state} />

      <section className="dt-card" aria-labelledby="dt-album-title">
        <h2 id="dt-album-title" className="dt-album__title">
          Stamp album
        </h2>
        <ul className="dt-album">
          {trailSpots.map((spot) => {
            const got = isComplete(state, spot.id);
            return (
              <li key={spot.id} className={got ? 'is-collected' : 'is-locked'}>
                <StampBadge stamp={spot.stamp} collected={got} />
                <strong>{got ? spot.stamp.name : '???'}</strong>
                <span>{got ? `${floorLabel(spot.floorId)} · ${spot.title}` : 'Not found yet'}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {scanning && active && <QrScanner target={active.title} onCode={handleCode} onClose={closeScanner} />}

      {celebration && (
        <div className="dt-celebrate" role="dialog" aria-modal="true" aria-labelledby="dt-celebrate-title">
          <div className="dt-celebrate__panel">
            <div className="dt-celebrate__burst" aria-hidden="true">
              {Array.from({ length: 10 }, (_, index) => (
                <i key={index} style={{ ['--i' as string]: index }} />
              ))}
            </div>
            <StampBadge stamp={celebration.spot.stamp} collected className="dt-celebrate__stamp" />
            <h2 id="dt-celebrate-title">Stamp collected!</h2>
            <p className="dt-celebrate__name">{celebration.spot.stamp.name}</p>
            <p>
              +{DISCOVERY_TRAIL.pointsPerStamp} reward point{DISCOVERY_TRAIL.pointsPerStamp === 1 ? '' : 's'}
            </p>
            {celebration.finished ? (
              <p className="dt-celebrate__next">You finished the whole adventure!</p>
            ) : celebration.floorCompleted && celebration.nextFloorId ? (
              <p className="dt-celebrate__next">
                {floorLabel(celebration.spot.floorId)} complete! {floorLabel(celebration.nextFloorId)} is now unlocked.
              </p>
            ) : (
              <p className="dt-celebrate__next">Your next clue is ready.</p>
            )}
            <button type="button" className="dt-btn dt-btn--big" onClick={closeCelebration} autoFocus>
              {celebration.finished
                ? 'See my stamps'
                : celebration.floorCompleted && celebration.nextFloorId
                  ? `Go to ${floorLabel(celebration.nextFloorId)}`
                  : 'Next clue'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
