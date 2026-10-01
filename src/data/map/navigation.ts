/**
 * Walking network for directions: straight links along public walkways and through
 * the door openings drawn on the published floor plans (see floorPlans.ts).
 *
 * Rules for editing:
 * - A link must stay inside public areas and must not cross a wall line or a display.
 *   src/services/mapRouting.ts checks every link and reports problems in the console (dev only).
 * - Displays are not listed here. Each one joins the nearest walkway automatically.
 */
import type { FloorChange, FloorId, MapPoint, NavEdge, NavNode } from '../../types/map';

/**
 * Floors each connector serves, lowest first.
 * ASSUMPTION (to confirm with the museum): the published plans draw one lift and one
 * staircase in the same position on all five floors, so both are treated as serving all five.
 */
export const FLOOR_CONNECTIONS: Record<FloorChange, FloorId[]> = {
  lift: ['level-2', 'level-3', 'level-4', 'level-5', 'rooftop'],
  stairs: ['level-2', 'level-3', 'level-4', 'level-5', 'rooftop'],
};

/**
 * Set to true only when the museum confirms the whole lift route (door widths, ramps,
 * thresholds) is step-free on every floor. While false, the site does not offer or
 * describe any route as step-free.
 */
export const STEP_FREE_CONFIRMED = false;

export const nodeId = (floorId: FloorId, name: string) => `${floorId}:${name}`;

type NodeSpec = readonly [name: string, x: number, y: number, connector?: FloorChange];
type EdgeSpec = readonly [from: string, to: string];

interface FloorNetwork {
  nodes: NodeSpec[];
  edges: EdgeSpec[];
}

// ---------- parts shared by several floors ----------

/** Staircase door -> lift lobby -> lift, and the lobby opening onto the floor. */
const CORE: FloorNetwork = {
  nodes: [
    ['stairs', 640, 24, 'stairs'],
    ['stairs-door', 690, 24],
    ['lobby', 771, 56],
    ['lift', 806, 56, 'lift'],
    ['lobby-door', 771, 106],
    ['entry', 771, 126],
  ],
  edges: [
    ['stairs', 'stairs-door'],
    ['stairs-door', 'lobby'],
    ['lobby', 'lift'],
    ['lobby', 'lobby-door'],
    ['lobby-door', 'entry'],
  ],
};

/** Gallery -> toilet lobby -> toilet (Levels 2 to 4). Joins the floor at 'walk-east'. */
const TOILETS: FloorNetwork = {
  nodes: [
    ['walk-toilets', 860, 190],
    ['toilet-turn', 771, 139],
    ['toilet-approach', 860, 139],
    ['toilet-lobby-door', 878, 139],
    ['toilet-lobby', 941, 139],
    ['toilet-door', 941, 166],
    ['toilet', 941, 188],
  ],
  edges: [
    ['walk-east', 'walk-toilets'],
    ['walk-toilets', 'toilet-approach'],
    // Straight across from the lift lobby opening.
    ['entry', 'toilet-turn'],
    ['toilet-turn', 'toilet-approach'],
    ['toilet-approach', 'toilet-lobby-door'],
    ['toilet-lobby-door', 'toilet-lobby'],
    ['toilet-lobby', 'toilet-door'],
    ['toilet-door', 'toilet'],
  ],
};

const join = (...parts: FloorNetwork[]): FloorNetwork => ({
  nodes: parts.flatMap((part) => part.nodes),
  edges: parts.flatMap((part) => part.edges),
});

// ---------- floors ----------

const NETWORKS: Record<FloorId, FloorNetwork> = {
  'level-2': join(CORE, TOILETS, {
    nodes: [
      ['walk-east', 771, 190],
      ['walk-mid', 355, 190],
      ['walk-west', 150, 190],
      ['upper-west', 150, 60],
      ['upper-east', 355, 60],
    ],
    edges: [
      ['entry', 'walk-east'],
      ['walk-east', 'walk-mid'],
      ['walk-mid', 'walk-west'],
      ['walk-west', 'upper-west'],
      ['upper-west', 'upper-east'],
      ['upper-east', 'walk-mid'],
    ],
  }),

  'level-3': join(CORE, TOILETS, {
    nodes: [
      ['walk-east', 771, 190],
      ['walk-west', 150, 190],
    ],
    edges: [
      ['entry', 'walk-east'],
      ['walk-east', 'walk-west'],
    ],
  }),

  'level-4': join(CORE, TOILETS, {
    nodes: [
      ['cross-east', 771, 135],
      ['cross-west', 248, 135],
      ['walk-east', 771, 190],
      ['walk-west', 600, 190],
    ],
    edges: [
      ['entry', 'cross-east'],
      // Through the open side of the event space.
      ['cross-east', 'cross-west'],
      ['cross-east', 'walk-east'],
      ['walk-east', 'walk-west'],
    ],
  }),

  'level-5': join(CORE, {
    nodes: [
      ['cross-east', 771, 135],
      ['cross-west', 250, 135],
      ['walk-east', 771, 190],
      ['walk-west', 600, 190],
      ['walk-toilets', 835, 190],
      ['toilet-turn', 771, 141],
      ['toilet-approach', 835, 141],
      ['toilet-lobby-door', 850, 141],
      ['toilet-lobby', 952, 141],
      ['toilet-door', 952, 104],
      ['toilet', 952, 84],
    ],
    edges: [
      ['entry', 'cross-east'],
      ['cross-east', 'cross-west'],
      ['cross-east', 'walk-east'],
      ['walk-east', 'walk-west'],
      ['walk-east', 'walk-toilets'],
      ['walk-toilets', 'toilet-approach'],
      ['cross-east', 'toilet-turn'],
      ['toilet-turn', 'toilet-approach'],
      ['toilet-approach', 'toilet-lobby-door'],
      ['toilet-lobby-door', 'toilet-lobby'],
      ['toilet-lobby', 'toilet-door'],
      ['toilet-door', 'toilet'],
    ],
  }),

  // The rooftop lobby opens onto The Public House further left than on the other floors.
  rooftop: {
    nodes: [
      ['stairs', 640, 24, 'stairs'],
      ['stairs-door', 690, 24],
      ['lobby', 771, 56],
      ['lift', 806, 56, 'lift'],
      ['lobby-south', 726, 84],
      ['lobby-door', 726, 106],
      ['entry', 726, 130],
      ['walk-east', 726, 160],
      ['walk-west', 80, 160],
    ],
    edges: [
      ['stairs', 'stairs-door'],
      ['stairs-door', 'lobby'],
      ['lobby', 'lift'],
      ['lobby', 'lobby-south'],
      ['lobby-south', 'lobby-door'],
      ['lobby-door', 'entry'],
      ['entry', 'walk-east'],
      ['walk-east', 'walk-west'],
    ],
  },
};

export const navNodes: NavNode[] = (Object.keys(NETWORKS) as FloorId[]).flatMap((floorId) =>
  NETWORKS[floorId].nodes.map(([name, x, y, connector]) => ({
    id: nodeId(floorId, name),
    floorId,
    at: [x, y] as MapPoint,
    connector,
  })),
);

export const navEdges: NavEdge[] = (Object.keys(NETWORKS) as FloorId[]).flatMap((floorId) =>
  NETWORKS[floorId].edges.map(([from, to]) => [nodeId(floorId, from), nodeId(floorId, to)] as const),
);

/** Named areas visitors can pick as a start or destination. `access` is where they would stand. */
export const AREA_PLACES: { id: string; floorId: FloorId; name: string; at: MapPoint; access: MapPoint }[] = [
  { id: 'level-2-gallery', floorId: 'level-2', name: 'After-Hours Networking', at: [610, 162], access: [610, 190] },
  { id: 'level-3-event-space', floorId: 'level-3', name: 'Event Space & Pop-up Exhibitions', at: [330, 160], access: [330, 190] },
  { id: 'level-4-event-space', floorId: 'level-4', name: 'Event Space & Pop-up Exhibitions', at: [312, 92], access: [322, 135] },
  { id: 'level-5-event-space', floorId: 'level-5', name: 'Event Space & Pop-up Exhibitions', at: [308, 95], access: [322, 135] },
  { id: 'rooftop-public-balcony', floorId: 'rooftop', name: 'The Public Balcony', at: [180, 176], access: [180, 160] },
  { id: 'rooftop-public-bar', floorId: 'rooftop', name: 'The Public Bar', at: [276, 56], access: [276, 125] },
  { id: 'rooftop-public-house', floorId: 'rooftop', name: 'The Public House', at: [560, 176], access: [560, 160] },
];
