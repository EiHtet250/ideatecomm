// Types for the shared museum map (used by the Museum Map and the Discovery Trail).
// All coordinates are in "map units": every floor is drawn in the same
// MAP_WIDTH x MAP_HEIGHT box, so the lift and staircase line up between floors.

export type FloorId = 'level-2' | 'level-3' | 'level-4' | 'level-5' | 'rooftop';

/** [x, y] in map units. */
export type MapPoint = readonly [number, number];

export interface MapRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Fill style of an area. Colours live in components/map/map.css. */
export type AreaTone = 'floor' | 'lobby' | 'teal' | 'purple' | 'yellow' | 'green' | 'outdoor' | 'glass' | 'plinth';

/**
 * Who can walk in an area.
 * - public: visitors can walk here; routes may cross it.
 * - restricted: staff / service rooms, or areas not confirmed as open to visitors. Drawn muted; routes never enter.
 * - void: open to the floor below (no floor). Routes never enter.
 */
export type AreaAccess = 'public' | 'restricted' | 'void';

export interface MapLabel {
  text: string;
  /** Centre of the text. */
  at: MapPoint;
  /** Font size in map units (default 11). */
  size?: number;
  /** Degrees, e.g. -90 for text reading bottom-to-top. */
  rotate?: number;
}

/** A room or zone, drawn as a filled polygon. Areas are painted in list order, so later areas sit on top. */
export interface MapArea {
  id: string;
  tone: AreaTone;
  /** Defaults to 'public'. */
  access?: AreaAccess;
  points: MapPoint[];
  /** How written directions refer to this area, e.g. "the lift lobby". */
  zone?: string;
  labels?: MapLabel[];
  /** Draws window-pane lines over the area (glass facade). */
  panes?: { cols: number; rows: number };
}

/** A thick wall line. Gaps between wall lines are door openings. */
export interface MapWall {
  points: MapPoint[];
  closed?: boolean;
}

export type FacilityKind = 'lift' | 'stairs' | 'toilet' | 'accessible-toilet' | 'exit';

export interface MapFacility {
  id: string;
  kind: FacilityKind;
  name: string;
  at: MapPoint;
}

/** Legend letter printed on the museum's floor plans. */
export type ExhibitCode = 'A' | 'B' | 'C' | 'D' | 'H' | 'I';

/**
 * A display position marked on the museum's floor plan (a case, panel or gallery wall).
 * This is a place on the map, not a single toy: link toys from src/data/exhibits.ts
 * through `exhibitIds` once their physical positions are confirmed.
 */
export interface MapExhibit {
  /** Stable, unique across all floors, e.g. "level-3-a-04". Never reuse or renumber. */
  id: string;
  floorId: FloorId;
  code: ExhibitCode;
  /** Number shown on the map pin. Unique within a floor. */
  number: number;
  /** Visitor-facing name, e.g. "Toy Collection display 4". */
  name: string;
  rect: MapRect;
  /** References Exhibit.id (src/data/exhibits.ts). Empty until positions are confirmed. */
  exhibitIds?: string[];
}

export interface FloorPlan {
  id: FloorId;
  /** e.g. "Level 2", "Rooftop". */
  name: string;
  /** Position from the lowest floor (0) upwards. */
  order: number;
  areas: MapArea[];
  walls: MapWall[];
  facilities: MapFacility[];
  exhibits: MapExhibit[];
}

// ---------- Places and directions ----------

export type PlaceKind = 'display' | 'facility' | 'area';

/** Anything a visitor can pick as a start or a destination. */
export interface MapPlace {
  /** Stable and unique. Also used in QR links: /visitor/map?from=<id> */
  id: string;
  floorId: FloorId;
  kind: PlaceKind;
  name: string;
  /** Where the marker is drawn. */
  at: MapPoint;
  /** Where a visitor stands to be "at" this place. Always inside a public area. */
  access: MapPoint;
  /** Join the walking network at this node instead of the nearest walkway. */
  nodeId?: string;
}

/** A point on the walking network. */
export interface NavNode {
  id: string;
  floorId: FloorId;
  at: MapPoint;
  /** Marks the node visitors use to change floor. */
  connector?: 'lift' | 'stairs';
}

/** A straight, confirmed-walkable link between two nodes on the same floor. */
export type NavEdge = readonly [string, string];

export type FloorChange = 'lift' | 'stairs';

/** The part of a route on one floor. */
export interface RouteLeg {
  floorId: FloorId;
  points: MapPoint[];
}

export interface RouteStep {
  /** Floor to show for this step. */
  floorId: FloorId;
  text: string;
}

export interface Route {
  from: MapPlace;
  to: MapPlace;
  legs: RouteLeg[];
  steps: RouteStep[];
}
