import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_FLOOR_ID, MAP_HEIGHT, MAP_WIDTH, floorPlans, getFloorPlan } from '../../data/map/floorPlans';
import { floorName, getPlace, places } from '../../services/mapRouting';
import type { FacilityKind, FloorId, FloorPlan, MapPlace, MapPoint } from '../../types/map';
import { FACILITY_LABELS, FacilityIcon } from './FacilityIcon';
import { FloorPlanSvg } from './FloorPlanSvg';
import { useZoomPan } from './useZoomPan';
import './map.css';

const FACILITY_ORDER: FacilityKind[] = ['lift', 'stairs', 'toilet', 'accessible-toilet', 'exit'];
const PLACE_IDS: ReadonlySet<string> = new Set(places.map((place) => place.id));

export interface MuseumMapProps {
  /** Floor to show. Leave out to let the map manage it. */
  floorId?: FloorId;
  onFloorChange?: (floorId: FloorId) => void;
  /** Selected place. Leave out to let the map manage it. */
  selectedPlaceId?: string | null;
  onSelectPlace?: (place: MapPlace | null) => void;
  /** Places to emphasise, e.g. collected stamps. */
  highlightedPlaceIds?: readonly string[];
  /** Map points the view frames when the floor or these points change, e.g. the route on this floor. */
  focusPoints?: readonly MapPoint[];
  /** Floors to flag in the floor selector, e.g. the floors a route uses. */
  markedFloorIds?: readonly FloorId[];
  /** Extra SVG drawn over the floor in map units, e.g. <RouteOverlay>. */
  renderOverlay?: (floor: FloorPlan) => ReactNode;
  /** Buttons or extra content for the name card of the selected place. */
  renderPlaceActions?: (place: MapPlace) => ReactNode;
}

/**
 * Shared museum map: floor selector, zoomable floor plan, tappable places and a name card.
 * Used by the Museum Map page and (later) the Discovery Trail. All content comes from src/data/map.
 */
export function MuseumMap({
  floorId: controlledFloorId,
  onFloorChange,
  selectedPlaceId: controlledPlaceId,
  onSelectPlace,
  highlightedPlaceIds,
  focusPoints,
  markedFloorIds,
  renderOverlay,
  renderPlaceActions,
}: MuseumMapProps) {
  const [ownFloorId, setOwnFloorId] = useState<FloorId>(DEFAULT_FLOOR_ID);
  const [ownPlaceId, setOwnPlaceId] = useState<string | null>(null);
  const zoom = useZoomPan(MAP_WIDTH, MAP_HEIGHT, focusPoints);

  const floorId = controlledFloorId ?? ownFloorId;
  const selectedPlaceId = controlledPlaceId === undefined ? ownPlaceId : controlledPlaceId;
  const floor = getFloorPlan(floorId);
  const selected = getPlace(selectedPlaceId);

  const facilityKinds = useMemo(
    () => FACILITY_ORDER.filter((kind) => floor.facilities.some((facility) => facility.kind === kind)),
    [floor],
  );

  // Return to the home view (framing the focus points) when the floor or the focus changes.
  const { reset } = zoom;
  const focusKey = focusPoints?.map(([x, y]) => `${x},${y}`).join(' ') ?? '';
  useEffect(() => reset(), [floorId, focusKey, reset]);

  const select = (place: MapPlace | null) => {
    setOwnPlaceId(place?.id ?? null);
    onSelectPlace?.(place);
  };

  const changeFloor = (id: FloorId) => {
    if (id === floorId) return;
    setOwnFloorId(id);
    onFloorChange?.(id);
  };

  return (
    <div className="museum-map">
      <div className="museum-map__floors" role="group" aria-label="Floor">
        {floorPlans.map((plan) => {
          const marked = markedFloorIds?.includes(plan.id);
          return (
            <button
              key={plan.id}
              type="button"
              className="museum-map__floor"
              aria-pressed={plan.id === floorId}
              onClick={() => changeFloor(plan.id)}
            >
              {plan.name}
              {marked && <span className="museum-map__floor-mark" aria-label="on your route" role="img" />}
            </button>
          );
        })}
      </div>

      <div className="museum-map__viewport">
        <svg ref={zoom.svgRef} className="museum-map__svg" role="group" aria-label={`Floor plan of ${floor.name}`} {...zoom.handlers}>
          <defs>
            <pattern id="map-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" />
            </pattern>
          </defs>
          <g className="museum-map__view" style={zoom.viewStyle}>
            <g key={floor.id} className="museum-map__floor-layer">
            <FloorPlanSvg
              floor={floor}
              placeIds={PLACE_IDS}
              selectedPlaceId={selectedPlaceId}
              highlightedPlaceIds={highlightedPlaceIds}
              onSelectPlace={(id) => select(getPlace(id) ?? null)}
            />
            {renderOverlay?.(floor)}
            </g>
          </g>
        </svg>
      </div>

      <div className="museum-map__toolbar">
        <p className="museum-map__hint">Drag to move. Pinch, scroll or use the buttons to zoom. Tap a numbered pin to see what it is.</p>
        <div className="museum-map__controls">
          <button type="button" onClick={zoom.zoomOut} disabled={!zoom.canZoomOut} aria-label="Zoom out">
            −
          </button>
          <button type="button" onClick={zoom.zoomIn} disabled={!zoom.canZoomIn} aria-label="Zoom in">
            +
          </button>
          <button type="button" className="museum-map__reset" onClick={() => zoom.reset()}>
            Reset view
          </button>
        </div>
      </div>

      {selected && (
        <div className="museum-map__card" aria-live="polite">
          <div className="museum-map__card-text">
            <strong>{selected.name}</strong>
            <span>{floorName(selected.floorId)}</span>
          </div>
          <button type="button" className="museum-map__clear" onClick={() => select(null)} aria-label="Close">
            ×
          </button>
          {renderPlaceActions && <div className="museum-map__card-actions">{renderPlaceActions(selected)}</div>}
        </div>
      )}

      <ul className="museum-map__legend" aria-label="Map key">
        <li>
          <span className="museum-map__key museum-map__key--pin">1</span>
          Display (tap for its name)
        </li>
        {facilityKinds.map((kind) => (
          <li key={kind}>
            <svg viewBox={kind === 'exit' ? '-13 -9 26 18' : '-9 -9 18 18'} aria-hidden="true">
              <FacilityIcon kind={kind} />
            </svg>
            {FACILITY_LABELS[kind]}
          </li>
        ))}
        <li>
          <span className="museum-map__key museum-map__key--restricted" />
          Not open to visitors
        </li>
      </ul>
    </div>
  );
}
