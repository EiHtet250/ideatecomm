import { useEffect, useMemo } from 'react';
import { MAP_HEIGHT, MAP_WIDTH, getFloorPlan } from '../../data/map/floorPlans';
import { spotsOnFloor, trailSpots } from '../../data/trail/discoveryTrail';
import { activeSpot, isComplete, type TrailState } from '../../services/discoveryTrail';
import { findRoute, getPlace } from '../../services/mapRouting';
import type { FloorId, MapPoint } from '../../types/map';
import { useZoomPan } from '../map/useZoomPan';
import '../map/map.css';

const toPath = (points: readonly MapPoint[]) => points.map(([x, y]) => `${x},${y}`).join(' ');

/** Radius of the highlighted "look around here" area, in map units. */
const DISCOVERY_RADIUS = 40;

interface TrailMapProps {
  floorId: FloorId;
  state: TrailState;
}

/**
 * Game-style map of one floor: the museum's real layout from the shared floor data, with a
 * trail joining the checkpoints. Only completed spots and the active spot are shown, so future
 * spots stay a surprise.
 *
 * The trail line follows the Museum Map's confirmed walking routes (findRoute), starting from
 * the lift, so it never crosses a wall, a display or a restricted area.
 */
export function TrailMap({ floorId, state }: TrailMapProps) {
  const floor = getFloorPlan(floorId);
  const active = activeSpot(state);

  const { checkpoints, segments, start, focus } = useMemo(() => {
    const lift = getPlace(`${floorId}-lift`);
    const shown = spotsOnFloor(floorId).filter((spot) => isComplete(state, spot.id) || spot.id === active?.id);
    const checkpoints = shown.flatMap((spot) => {
      const place = getPlace(spot.placeId);
      if (!place) return [];
      return [{ spot, place, number: trailSpots.indexOf(spot) + 1, done: isComplete(state, spot.id) }];
    });

    const segments: { points: MapPoint[]; done: boolean }[] = [];
    let from = lift;
    for (const checkpoint of checkpoints) {
      const route = from ? findRoute(from.id, checkpoint.place.id, 'lift') : undefined;
      if (route) segments.push({ points: route.legs[0].points, done: checkpoint.done });
      from = checkpoint.place;
    }

    // Frame the part being played now; on a finished floor, frame the whole trail.
    const current = segments.find((segment) => !segment.done);
    const focus = current?.points ?? segments.flatMap((segment) => segment.points);
    return { checkpoints, segments, start: lift, focus: focus.length > 0 ? focus : undefined };
  }, [floorId, state, active?.id]);

  const zoom = useZoomPan(MAP_WIDTH, MAP_HEIGHT, focus);
  const { reset } = zoom;
  const focusKey = focus ? toPath(focus) : '';
  useEffect(() => reset(), [floorId, focusKey, reset]);

  return (
    <div className="dt-map">
      <div className="dt-map__viewport">
        <svg ref={zoom.svgRef} className="museum-map__svg" role="group" aria-label={`Trail map of ${floor.name}`} {...zoom.handlers}>
          <defs>
            <pattern id="map-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" />
            </pattern>
          </defs>
          <g className="museum-map__view" style={zoom.viewStyle}>
            <g key={floorId} className="museum-map__floor-layer">
              {floor.areas.map((area) => {
                const access = area.access ?? 'public';
                return (
                  <g key={area.id}>
                    <polygon className={`map-area map-area--${area.tone} map-area--${access}`} points={toPath(area.points)} />
                    {access !== 'public' && area.tone !== 'glass' && <polygon className="map-area__hatch" points={toPath(area.points)} />}
                  </g>
                );
              })}
              {floor.walls.map((wall, index) =>
                wall.closed ? (
                  <polygon key={index} className="map-wall" points={toPath(wall.points)} />
                ) : (
                  <polyline key={index} className="map-wall" points={toPath(wall.points)} />
                ),
              )}
              {floor.exhibits.map((exhibit) => (
                <rect key={exhibit.id} className="map-case" x={exhibit.rect.x} y={exhibit.rect.y} width={exhibit.rect.w} height={exhibit.rect.h} rx={1} />
              ))}

              {segments.map((segment, index) => (
                <g key={index} className={`dt-trail ${segment.done ? 'dt-trail--done' : 'dt-trail--active'}`}>
                  <polyline className="dt-trail__casing" points={toPath(segment.points)} />
                  <polyline className="dt-trail__line" points={toPath(segment.points)} />
                </g>
              ))}

              {start && (
                <g transform={`translate(${start.access[0]} ${start.access[1]})`}>
                  <circle className="dt-start" r={7} />
                  <text className="dt-map__tag" y={-11} textAnchor="middle" fontSize={8}>
                    Lift
                  </text>
                </g>
              )}

              {checkpoints.map(({ spot, place, number, done }) => (
                <g key={spot.id} transform={`translate(${place.at[0]} ${place.at[1]})`}>
                  <title>{done ? `${spot.title}: stamp collected` : `${spot.title}: look around here`}</title>
                  {!done && <circle className="dt-area" r={DISCOVERY_RADIUS} />}
                  {!done && <circle className="dt-area__ring" r={DISCOVERY_RADIUS} />}
                  <g className={`dt-checkpoint ${done ? 'dt-checkpoint--done' : 'dt-checkpoint--active'}`}>
                    <circle className="dt-checkpoint__dot" r={12} />
                    {done ? (
                      <path className="dt-checkpoint__tick" d="M-5 0.5 L-1.5 4 L5.5 -4" />
                    ) : (
                      <text className="dt-checkpoint__number" textAnchor="middle" dominantBaseline="central" fontSize={13}>
                        {number}
                      </text>
                    )}
                  </g>
                </g>
              ))}
            </g>
          </g>
        </svg>

        {/* Toy doodles in the corners. Decoration only: they sit on the frame, not on the floor plan. */}
        <svg className="dt-map__doodle dt-map__doodle--star" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 L14.9 8.6 L22 9.3 L16.6 14 L18.2 21 L12 17.3 L5.8 21 L7.4 14 L2 9.3 L9.1 8.6 Z" />
        </svg>
        <svg className="dt-map__doodle dt-map__doodle--block" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="9" cy="9" r="2" />
          <circle cx="15" cy="15" r="2" />
        </svg>
      </div>

      <div className="museum-map__toolbar">
        <p className="museum-map__hint">Drag to move. Pinch or use the buttons to zoom.</p>
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
    </div>
  );
}
