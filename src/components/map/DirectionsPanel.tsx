import { STEP_FREE_CONFIRMED } from '../../data/map/navigation';
import { floorName } from '../../services/mapRouting';
import type { FloorChange, FloorId, MapPlace, Route } from '../../types/map';
import { PlaceSearch } from './PlaceSearch';

/** How the visitor's start was set. There is no live tracking. */
export type StartSource = 'selected' | 'scanned';

interface DirectionsPanelProps {
  start?: MapPlace;
  startSource: StartSource;
  destination?: MapPlace;
  floorChange: FloorChange;
  route?: Route;
  error?: string;
  /** Floor currently shown on the map. */
  floorId: FloorId;
  onStartChange: (place: MapPlace | undefined) => void;
  onDestinationChange: (place: MapPlace | undefined) => void;
  onFloorChangeChoice: (choice: FloorChange) => void;
  onGetDirections: () => void;
  onClear: () => void;
  onShowFloor: (floorId: FloorId) => void;
  /** Opens the camera to scan a location QR code as the start. */
  onScanStart: () => void;
}

/** Start / destination pickers, the "Get directions" button and the written steps. */
export function DirectionsPanel({
  start,
  startSource,
  destination,
  floorChange,
  route,
  error,
  floorId,
  onStartChange,
  onDestinationChange,
  onFloorChangeChoice,
  onGetDirections,
  onClear,
  onShowFloor,
  onScanStart,
}: DirectionsPanelProps) {
  const betweenFloors = Boolean(start && destination && start.floorId !== destination.floorId);

  return (
    <section className="directions" aria-labelledby="directions-title">
      <h2 id="directions-title" className="directions__title">
        Get directions
      </h2>

      <div className="directions__fields">
        <PlaceSearch
          id="directions-start"
          label="Start"
          placeholder="Search, e.g. “lift level 2”"
          value={start}
          valueNote={startSource === 'scanned' ? 'Last scanned location' : 'Your selected location'}
          onChange={onStartChange}
        />
        <PlaceSearch
          id="directions-destination"
          label="Destination"
          placeholder="Search, e.g. “toilet” or “display 7”"
          value={destination}
          onChange={onDestinationChange}
        />
      </div>

      <div className="directions__scan">
        <button type="button" className="directions__clear" onClick={onScanStart}>
          Scan location QR
        </button>
        <span className="directions__note">Scan the QR code near you to set your start.</span>
      </div>

      <p className="directions__note">
        You can also search above, or tap a place on the map. This guide does not track where you are: your start is
        the place you choose or the last location QR code you scanned.
      </p>

      {betweenFloors && (
        <fieldset className="directions__choice">
          <legend>Change floor by</legend>
          {(['lift', 'stairs'] as const).map((choice) => (
            <label key={choice}>
              <input
                type="radio"
                name="floor-change"
                checked={floorChange === choice}
                onChange={() => onFloorChangeChoice(choice)}
              />
              {choice === 'lift' ? 'Lift' : 'Stairs'}
            </label>
          ))}
          {!STEP_FREE_CONFIRMED && (
            <p className="directions__note">
              Step-free access has not been confirmed for this map yet. If you need a step-free route, please ask museum
              staff.
            </p>
          )}
        </fieldset>
      )}

      <div className="directions__buttons">
        <button type="button" className="btn directions__go" disabled={!start || !destination} onClick={onGetDirections}>
          Get directions
        </button>
        {(start || destination || route) && (
          <button type="button" className="directions__clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      {error && (
        <p className="directions__error" role="alert">
          {error}
        </p>
      )}

      {route && (
        <div className="directions__result" aria-live="polite">
          <h3 className="directions__subtitle">
            {`${route.from.name} → ${route.to.name}`}
          </h3>
          <ol className="directions__steps">
            {route.steps.map((step, index) => (
              <li key={index} className={step.floorId === floorId ? 'is-current-floor' : undefined}>
                <span>{step.text}</span>
                {step.floorId !== floorId && (
                  <button type="button" className="directions__show" onClick={() => onShowFloor(step.floorId)}>
                    {`Show ${floorName(step.floorId)}`}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
