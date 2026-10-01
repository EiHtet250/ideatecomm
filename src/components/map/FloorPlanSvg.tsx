import type { KeyboardEvent, ReactNode } from 'react';
import type { FloorPlan, MapArea, MapPoint } from '../../types/map';
import { FacilityIcon } from './FacilityIcon';

/** Invisible tap target around each pin, in map units. */
const TAP_RADIUS = 13;
const PIN_RADIUS = 9;
/** Keeps pins on wall-mounted displays inside the building outline. */
const PIN_MIN_Y = 16;
const PIN_MAX_Y = 207;

const toPath = (points: MapPoint[]) => points.map(([x, y]) => `${x},${y}`).join(' ');

function Panes({ area }: { area: MapArea }) {
  if (!area.panes) return null;
  const xs = area.points.map(([x]) => x);
  const ys = area.points.map(([, y]) => y);
  const [left, right, top, bottom] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const lines: ReactNode[] = [];
  for (let col = 1; col < area.panes.cols; col++) {
    const x = left + ((right - left) * col) / area.panes.cols;
    lines.push(<line key={`c${col}`} x1={x} y1={top} x2={x} y2={bottom} />);
  }
  for (let rowIndex = 1; rowIndex < area.panes.rows; rowIndex++) {
    const y = top + ((bottom - top) * rowIndex) / area.panes.rows;
    lines.push(<line key={`r${rowIndex}`} x1={left} y1={y} x2={right} y2={y} />);
  }
  return <g className="map-panes">{lines}</g>;
}

interface FloorPlanSvgProps {
  floor: FloorPlan;
  /** IDs of places that can be opened (see services/mapRouting). Others are drawn but not clickable. */
  placeIds: ReadonlySet<string>;
  selectedPlaceId?: string | null;
  highlightedPlaceIds?: readonly string[];
  onSelectPlace: (placeId: string) => void;
}

/** Draws one floor in map units. The parent decides zoom and position. */
export function FloorPlanSvg({ floor, placeIds, selectedPlaceId, highlightedPlaceIds, onSelectPlace }: FloorPlanSvgProps) {
  const onKey = (event: KeyboardEvent, placeId: string) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelectPlace(placeId);
  };

  /** Props that turn an SVG group into a button for a place. */
  const placeButton = (placeId: string, label: string) => ({
    role: 'button',
    tabIndex: 0,
    'aria-label': `${label}, ${floor.name}`,
    'aria-pressed': placeId === selectedPlaceId,
    'data-place-id': placeId,
    onClick: () => onSelectPlace(placeId),
    onKeyDown: (event: KeyboardEvent) => onKey(event, placeId),
  });

  const stateClass = (placeId: string) =>
    [placeId === selectedPlaceId && 'is-selected', highlightedPlaceIds?.includes(placeId) && 'is-highlighted']
      .filter(Boolean)
      .join(' ');

  return (
    <g className="map-floor">
      {floor.areas.map((area) => {
        const access = area.access ?? 'public';
        return (
          <g key={area.id}>
            <polygon className={`map-area map-area--${area.tone} map-area--${access}`} points={toPath(area.points)} />
            {access !== 'public' && area.tone !== 'glass' && <polygon className="map-area__hatch" points={toPath(area.points)} />}
            <Panes area={area} />
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

      {/* Display cases: the shape from the plan, with a numbered pin on top. */}
      {floor.exhibits.map((exhibit) => (
        <rect
          key={exhibit.id}
          className="map-case"
          x={exhibit.rect.x}
          y={exhibit.rect.y}
          width={exhibit.rect.w}
          height={exhibit.rect.h}
          rx={1}
        />
      ))}

      {floor.areas.flatMap((area) =>
        (area.labels ?? []).map((label) => (
          <text
            key={`${area.id}-${label.text}`}
            className={`map-label${(area.access ?? 'public') === 'public' ? '' : ' map-label--muted'}`}
            x={label.at[0]}
            y={label.at[1]}
            fontSize={label.size ?? 11}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={label.rotate ? `rotate(${label.rotate} ${label.at[0]} ${label.at[1]})` : undefined}
          >
            {label.text}
          </text>
        )),
      )}

      {floor.facilities.map((facility) => {
        const clickable = placeIds.has(facility.id);
        return (
          <g
            key={facility.id}
            className={`map-facility ${clickable ? `map-facility--place ${stateClass(facility.id)}` : ''}`}
            transform={`translate(${facility.at[0]} ${facility.at[1]})`}
            {...(clickable ? placeButton(facility.id, facility.name) : { role: 'img', 'aria-label': facility.name })}
          >
            <title>{facility.name}</title>
            {clickable && <circle className="map-pin__tap" r={TAP_RADIUS + 2} />}
            <g transform="scale(1.25)">
              <FacilityIcon kind={facility.kind} />
            </g>
          </g>
        );
      })}

      {floor.exhibits.map((exhibit) => {
        const cx = exhibit.rect.x + exhibit.rect.w / 2;
        const cy = Math.min(PIN_MAX_Y, Math.max(PIN_MIN_Y, exhibit.rect.y + exhibit.rect.h / 2));
        if (!placeIds.has(exhibit.id)) return null;
        return (
          <g
            key={exhibit.id}
            className={`map-pin ${stateClass(exhibit.id)}`}
            transform={`translate(${cx} ${cy})`}
            {...placeButton(exhibit.id, exhibit.name)}
          >
            <title>{exhibit.name}</title>
            <circle className="map-pin__tap" r={TAP_RADIUS} />
            <circle className="map-pin__dot" r={PIN_RADIUS} />
            <text className="map-pin__number" textAnchor="middle" dominantBaseline="central" fontSize={exhibit.number > 9 ? 9.5 : 11}>
              {exhibit.number}
            </text>
          </g>
        );
      })}
    </g>
  );
}
