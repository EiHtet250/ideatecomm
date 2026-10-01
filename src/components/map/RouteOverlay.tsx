import type { FloorId, MapPlace, MapPoint, Route } from '../../types/map';

interface RouteOverlayProps {
  floorId: FloorId;
  /** The visitor's chosen or last scanned location. Shown even before a route exists. */
  start?: MapPlace;
  route?: Route;
}

const toPath = (points: MapPoint[]) => points.map(([x, y]) => `${x},${y}`).join(' ');

/** Map units the preview dot covers per second, and the shortest time one trip may take. */
const PREVIEW_SPEED = 90;
const PREVIEW_MIN_SECONDS = 2.5;

const lengthOf = (points: MapPoint[]) =>
  points.slice(1).reduce((total, [x, y], index) => total + Math.hypot(x - points[index][0], y - points[index][1]), 0);

function Tag({ at, text, below }: { at: MapPoint; text: string; below?: boolean }) {
  return (
    <text className="map-route__tag" x={at[0]} y={at[1] + (below ? 17 : -11)} textAnchor="middle" fontSize={8}>
      {text}
    </text>
  );
}

/**
 * Route line and start / destination markers for one floor, in map units.
 * Pass it to <MuseumMap renderOverlay>. Nothing here tracks the visitor:
 * the start marker is the place they selected or scanned.
 */
export function RouteOverlay({ floorId, start, route }: RouteOverlayProps) {
  const legIndex = route ? route.legs.findIndex((leg) => leg.floorId === floorId) : -1;
  const leg = route && legIndex >= 0 ? route.legs[legIndex] : undefined;
  const origin = route?.from ?? start;
  const destination = route?.to;

  return (
    <g className="map-route" pointerEvents="none">
      {leg && leg.points.length > 1 && (
        <>
          <polyline className="map-route__casing" points={toPath(leg.points)} />
          <polyline className="map-route__line" points={toPath(leg.points)} />
          {/* Dashes that travel from start to destination, to show the direction to walk. */}
          <polyline className="map-route__flow" points={toPath(leg.points)} />
          {/* Preview of the walk. It is NOT the visitor's position: the Start marker never moves. */}
          <circle key={toPath(leg.points)} className="map-route__walker" r={4.5}>
            <animateMotion
              dur={`${Math.max(PREVIEW_MIN_SECONDS, lengthOf(leg.points) / PREVIEW_SPEED).toFixed(1)}s`}
              repeatCount="indefinite"
              path={`M${toPath(leg.points).replace(/ /g, ' L')}`}
            />
          </circle>
        </>
      )}

      {/* Where the route leaves or joins this floor. */}
      {route && leg && legIndex > 0 && (
        <g>
          <circle className="map-route__pulse map-route__pulse--change" cx={leg.points[0][0]} cy={leg.points[0][1]} r={5} />
          <circle className="map-route__change" cx={leg.points[0][0]} cy={leg.points[0][1]} r={5} />
          <Tag at={leg.points[0]} text="Arrive here" below />
        </g>
      )}
      {route && leg && legIndex < route.legs.length - 1 && (
        <g>
          <circle className="map-route__pulse map-route__pulse--change" cx={leg.points[leg.points.length - 1][0]} cy={leg.points[leg.points.length - 1][1]} r={5} />
          <circle className="map-route__change" cx={leg.points[leg.points.length - 1][0]} cy={leg.points[leg.points.length - 1][1]} r={5} />
          <Tag at={leg.points[leg.points.length - 1]} text="Change floor" below />
        </g>
      )}

      {origin && origin.floorId === floorId && (
        <g>
          <circle className="map-route__pulse" cx={origin.access[0]} cy={origin.access[1]} r={7} />
          <circle className="map-route__start" cx={origin.access[0]} cy={origin.access[1]} r={7} />
          <circle className="map-route__start-dot" cx={origin.access[0]} cy={origin.access[1]} r={2.5} />
          <Tag at={origin.access} text="Start" />
        </g>
      )}

      {destination && destination.floorId === floorId && (
        <g transform={`translate(${destination.access[0]} ${destination.access[1]})`}>
          <ellipse className="map-route__shadow" rx={5} ry={1.8} />
          <g className="map-route__pin">
            <path className="map-route__end" d="M0 0 C-7 -8 -8 -11 -8 -14 A8 8 0 1 1 8 -14 C8 -11 7 -8 0 0 Z" />
            <circle className="map-route__end-dot" cy={-14} r={3} />
          </g>
          <text className="map-route__tag" y={-26} textAnchor="middle" fontSize={8}>
            Destination
          </text>
        </g>
      )}
    </g>
  );
}
