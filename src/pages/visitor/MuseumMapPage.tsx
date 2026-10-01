import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DirectionsPanel, type StartSource } from '../../components/map/DirectionsPanel';
import { MuseumMap } from '../../components/map/MuseumMap';
import { RouteOverlay } from '../../components/map/RouteOverlay';
import { QrScanner, type ScanFeedback } from '../../components/trail/QrScanner';
import '../../components/map/directions.css';
import { useSettings } from '../../components/settings/SettingsProvider';
import { translateVisitorText } from '../../components/settings/visitorStrings';
import { DEFAULT_FLOOR_ID } from '../../data/map/floorPlans';
import { findRoute, getPlace, placeFromLocationCode } from '../../services/mapRouting';
import type { FloorChange, FloorId, MapPlace, Route } from '../../types/map';

/** Remembers the last location QR code the visitor scanned, in this browser only. */
const LAST_SCANNED_KEY = 'mint-last-scanned-place';

function readLastScanned(): MapPlace | undefined {
  try {
    return getPlace(localStorage.getItem(LAST_SCANNED_KEY));
  } catch {
    return undefined;
  }
}

/**
 * Museum Map with directions.
 *
 * Location QR codes link here as /visitor/map?from=<place id> (and optionally &to=<place id>).
 * The start is always a place the visitor chose or scanned: nothing tracks their position.
 */
export function MuseumMapPage() {
  const { currentLanguage } = useSettings();
  const t = (text: string) => translateVisitorText(text, currentLanguage);

  const [params] = useSearchParams();
  const scannedNow = getPlace(params.get('from'));

  const [start, setStart] = useState<MapPlace | undefined>(() => scannedNow ?? readLastScanned());
  const [startSource, setStartSource] = useState<StartSource>(start ? 'scanned' : 'selected');
  const [destination, setDestination] = useState<MapPlace | undefined>(() => getPlace(params.get('to')));
  const [floorChange, setFloorChange] = useState<FloorChange>('lift');
  const [route, setRoute] = useState<Route>();
  const [error, setError] = useState('');
  const [floorId, setFloorId] = useState<FloorId>(start?.floorId ?? DEFAULT_FLOOR_ID);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!scannedNow) return;
    try {
      localStorage.setItem(LAST_SCANNED_KEY, scannedNow.id);
    } catch {
      // Storage unavailable (e.g. private mode): the scan still works for this visit.
    }
  }, [scannedNow]);

  const resetRoute = () => {
    setRoute(undefined);
    setError('');
  };

  const chooseStart = (place: MapPlace | undefined) => {
    setStart(place);
    setStartSource('selected');
    resetRoute();
    if (place) setFloorId(place.floorId);
  };

  /** A scanned (or typed) location code becomes the start, labelled "Last scanned location". */
  const onLocationCode = (code: string): ScanFeedback => {
    const place = placeFromLocationCode(code);
    if (!place) {
      return { done: false, message: 'That is not a museum location code. Look for the QR code marked “You are here”.' };
    }
    setStart(place);
    setStartSource('scanned');
    setFloorId(place.floorId);
    resetRoute();
    setScanning(false);
    try {
      localStorage.setItem(LAST_SCANNED_KEY, place.id);
    } catch {
      // Storage unavailable: the scan still works for this visit.
    }
    return { done: true };
  };

  const chooseDestination = (place: MapPlace | undefined) => {
    setDestination(place);
    resetRoute();
  };

  const getDirections = () => {
    if (!start || !destination) return;
    if (start.id === destination.id) {
      setRoute(undefined);
      setError('Your start and destination are the same place. Please choose a different destination.');
      return;
    }
    const found = findRoute(start.id, destination.id, floorChange);
    setRoute(found);
    setError(found ? '' : 'Sorry, we do not have a confirmed route between these two places yet. Please ask museum staff.');
    if (found) {
      setFloorId(start.floorId);
      setSelectedPlaceId(null);
    }
  };

  const clear = () => {
    setStart(undefined);
    setStartSource('selected');
    setDestination(undefined);
    setSelectedPlaceId(null);
    resetRoute();
  };

  return (
    <section className="page">
      <header className="page__header">
        <h1 className="page__title">{t('Museum Map')}</h1>
        <p className="page__description">{t("Free browsing of the museum's floors and exhibits.")}</p>
      </header>

      <DirectionsPanel
        start={start}
        startSource={startSource}
        destination={destination}
        floorChange={floorChange}
        route={route}
        error={error}
        floorId={floorId}
        onStartChange={chooseStart}
        onDestinationChange={chooseDestination}
        onFloorChangeChoice={(choice) => {
          setFloorChange(choice);
          resetRoute();
        }}
        onGetDirections={getDirections}
        onClear={clear}
        onShowFloor={setFloorId}
        onScanStart={() => setScanning(true)}
      />

      {scanning && <QrScanner target="a location QR code" onCode={onLocationCode} onClose={() => setScanning(false)} />}

      <MuseumMap
        floorId={floorId}
        onFloorChange={setFloorId}
        selectedPlaceId={selectedPlaceId}
        onSelectPlace={(place) => setSelectedPlaceId(place?.id ?? null)}
        focusPoints={route?.legs.find((leg) => leg.floorId === floorId)?.points ?? (start?.floorId === floorId ? [start.access] : undefined)}
        markedFloorIds={route?.legs.map((leg) => leg.floorId)}
        renderOverlay={(floor) => <RouteOverlay floorId={floor.id} start={start} route={route} />}
        renderPlaceActions={(place) => (
          <>
            <button
              type="button"
              className="btn"
              onClick={() => {
                chooseDestination(place);
                setSelectedPlaceId(null);
              }}
            >
              Directions to here
            </button>
            <button
              type="button"
              className="museum-map__secondary"
              onClick={() => {
                chooseStart(place);
                setSelectedPlaceId(null);
              }}
            >
              Start from here
            </button>
          </>
        )}
      />
    </section>
  );
}
