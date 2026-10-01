import type { FacilityKind } from '../../types/map';

export const FACILITY_LABELS: Record<FacilityKind, string> = {
  lift: 'Lift',
  stairs: 'Staircase',
  toilet: 'Toilet',
  'accessible-toilet': 'Accessible toilet',
  exit: 'Exit',
};

/** SVG symbol centred on (0, 0), about 16 map units tall. Wrap it in a <g transform> or an <svg>. */
export function FacilityIcon({ kind }: { kind: FacilityKind }) {
  if (kind === 'exit') {
    return (
      <g className="map-icon map-icon--exit">
        <rect x={-12} y={-6} width={24} height={12} rx={2} />
        <text y={2.6} textAnchor="middle" fontSize={7} fontWeight={700}>
          EXIT
        </text>
      </g>
    );
  }

  return (
    <g className="map-icon">
      <rect x={-8} y={-8} width={16} height={16} rx={3} />
      {kind === 'lift' && (
        <g className="map-icon__glyph">
          <rect x={-4.5} y={-5} width={9} height={10} rx={1} fill="none" />
          <path d="M-2.2 -0.8 L0 -3.2 L2.2 -0.8 Z M-2.2 0.8 L0 3.2 L2.2 0.8 Z" className="map-icon__solid" />
        </g>
      )}
      {kind === 'stairs' && (
        <path className="map-icon__glyph" fill="none" d="M-5 4.5 H-1.7 V1.5 H1.7 V-1.5 H5 V-4.5" />
      )}
      {kind === 'toilet' && (
        <g className="map-icon__solid">
          <circle cx={-3} cy={-4} r={1.5} />
          <rect x={-4.4} y={-2} width={2.8} height={7} rx={0.8} />
          <circle cx={3} cy={-4} r={1.5} />
          <path d="M3 -2 L5.4 3 H0.6 Z M2.2 3 H3.8 V5 H2.2 Z" />
        </g>
      )}
      {kind === 'accessible-toilet' && (
        <g className="map-icon__glyph" fill="none">
          <circle cx={-1.5} cy={-4.6} r={1.3} className="map-icon__solid" />
          <path d="M-1.5 -2.8 V1 H2.2 L4 4.6" />
          <path d="M-1.5 -1 H1.6" />
          <path d="M-3.4 -0.4 A3.4 3.4 0 1 0 1.6 4.2" />
        </g>
      )}
    </g>
  );
}
