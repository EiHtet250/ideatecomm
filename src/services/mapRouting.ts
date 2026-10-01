/**
 * Places and directions for the shared museum map.
 *
 * - `places`: everything a visitor can pick as a start or destination.
 * - `findRoute`: shortest walk along the network in src/data/map/navigation.ts.
 *
 * Routes only use the hand-checked links plus one short straight leg from a walkway to a
 * place. `isClearWalk` guards every such leg: it must stay in public areas and must not
 * cross a wall or a display. There is no live positioning: the start is always a place
 * the visitor chose or scanned.
 */
import { floorPlans, getFloorPlan } from '../data/map/floorPlans';
import { AREA_PLACES, FLOOR_CONNECTIONS, navEdges, navNodes, nodeId } from '../data/map/navigation';
import type {
  FacilityKind,
  FloorChange,
  FloorId,
  FloorPlan,
  MapArea,
  MapExhibit,
  MapPlace,
  MapPoint,
  NavNode,
  Route,
  RouteLeg,
  RouteStep,
} from '../types/map';

// ---------- geometry ----------

const distance = (a: MapPoint, b: MapPoint) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const samePoint = (a: MapPoint, b: MapPoint) => distance(a, b) < 0.01;

function pointInPolygon([x, y]: MapPoint, polygon: MapPoint[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** The area drawn on top at this point (areas are painted in list order). */
export function areaAt(floor: FloorPlan, point: MapPoint): MapArea | undefined {
  for (let index = floor.areas.length - 1; index >= 0; index--) {
    if (pointInPolygon(point, floor.areas[index].points)) return floor.areas[index];
  }
  return undefined;
}

const cross = (o: MapPoint, a: MapPoint, b: MapPoint) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

/** True when the two segments properly cross or touch (within a small tolerance). */
function segmentsIntersect(p1: MapPoint, p2: MapPoint, q1: MapPoint, q2: MapPoint): boolean {
  const EPS = 1e-6;
  const d1 = cross(q1, q2, p1);
  const d2 = cross(q1, q2, p2);
  const d3 = cross(p1, p2, q1);
  const d4 = cross(p1, p2, q2);
  if (((d1 > EPS && d2 < -EPS) || (d1 < -EPS && d2 > EPS)) && ((d3 > EPS && d4 < -EPS) || (d3 < -EPS && d4 > EPS))) return true;
  const onSegment = (a: MapPoint, b: MapPoint, c: MapPoint) =>
    Math.min(a[0], b[0]) - EPS <= c[0] && c[0] <= Math.max(a[0], b[0]) + EPS && Math.min(a[1], b[1]) - EPS <= c[1] && c[1] <= Math.max(a[1], b[1]) + EPS;
  if (Math.abs(d1) <= EPS && onSegment(q1, q2, p1)) return true;
  if (Math.abs(d2) <= EPS && onSegment(q1, q2, p2)) return true;
  if (Math.abs(d3) <= EPS && onSegment(p1, p2, q1)) return true;
  if (Math.abs(d4) <= EPS && onSegment(p1, p2, q2)) return true;
  return false;
}

function wallSegments(floor: FloorPlan): [MapPoint, MapPoint][] {
  return floor.walls.flatMap((wall) => {
    const points = wall.closed ? [...wall.points, wall.points[0]] : wall.points;
    return points.slice(1).map((point, index) => [points[index], point] as [MapPoint, MapPoint]);
  });
}

function segmentHitsExhibit(a: MapPoint, b: MapPoint, exhibit: MapExhibit): boolean {
  const { x, y, w, h } = exhibit.rect;
  const corners: MapPoint[] = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  if (pointInPolygon(a, corners) || pointInPolygon(b, corners)) return true;
  return corners.some((corner, index) => segmentsIntersect(a, b, corner, corners[(index + 1) % 4]));
}

const SAMPLE_STEP = 2;

/**
 * True when a visitor can walk straight from a to b: public floor all the way,
 * no wall crossed and no display in the way.
 */
export function isClearWalk(floor: FloorPlan, a: MapPoint, b: MapPoint): boolean {
  if (wallSegments(floor).some(([p, q]) => segmentsIntersect(a, b, p, q))) return false;
  if (floor.exhibits.some((exhibit) => segmentHitsExhibit(a, b, exhibit))) return false;
  const steps = Math.max(1, Math.ceil(distance(a, b) / SAMPLE_STEP));
  for (let step = 0; step <= steps; step++) {
    const t = step / steps;
    const area = areaAt(floor, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    if (!area || (area.access ?? 'public') !== 'public') return false;
  }
  return true;
}

// ---------- network ----------

const nodesById = new Map<string, NavNode>(navNodes.map((node) => [node.id, node]));

interface Attachment {
  /** Point on the walkway. */
  point: MapPoint;
  /** The walkway link it sits on. */
  edge: readonly [string, string];
}

function projectOnto(point: MapPoint, a: MapPoint, b: MapPoint): MapPoint {
  const lengthSquared = (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2;
  if (lengthSquared === 0) return a;
  const t = Math.max(0, Math.min(1, ((point[0] - a[0]) * (b[0] - a[0]) + (point[1] - a[1]) * (b[1] - a[1])) / lengthSquared));
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/** Closest walkway point that can be reached from `access` in a clear straight line. */
function attach(floor: FloorPlan, access: MapPoint): Attachment | undefined {
  let best: (Attachment & { length: number }) | undefined;
  for (const edge of navEdges) {
    const a = nodesById.get(edge[0]);
    const b = nodesById.get(edge[1]);
    if (!a || !b || a.floorId !== floor.id) continue;
    const point = projectOnto(access, a.at, b.at);
    const length = distance(access, point);
    if (best && length >= best.length) continue;
    if (!samePoint(access, point) && !isClearWalk(floor, access, point)) continue;
    best = { point, edge, length };
  }
  return best;
}

// ---------- places ----------

const FACILITY_NODES: Partial<Record<FacilityKind, string>> = {
  lift: 'lift',
  stairs: 'stairs',
  toilet: 'toilet',
  'accessible-toilet': 'toilet',
};

/** How far in front of a display a visitor stands. */
const VIEWING_DISTANCE = 7;

interface ResolvedPlace extends MapPlace {
  attachment?: Attachment;
}

function displayPlace(floor: FloorPlan, exhibit: MapExhibit): ResolvedPlace | undefined {
  const { x, y, w, h } = exhibit.rect;
  const centre: MapPoint = [x + w / 2, y + h / 2];
  const base = { id: exhibit.id, floorId: floor.id, kind: 'display' as const, name: exhibit.name, at: centre };

  // Displays inside the staircase are seen from the staircase landing.
  const stairs = nodesById.get(nodeId(floor.id, 'stairs'));
  if (stairs && areaAt(floor, centre)?.id === `${floor.id}-stair-core`) {
    return { ...base, access: stairs.at, nodeId: stairs.id };
  }

  // Otherwise stand on whichever side has the shortest clear walk to a walkway.
  const sides: MapPoint[] = [
    [centre[0], y - VIEWING_DISTANCE],
    [centre[0], y + h + VIEWING_DISTANCE],
    [x - VIEWING_DISTANCE, centre[1]],
    [x + w + VIEWING_DISTANCE, centre[1]],
  ];
  let best: ResolvedPlace | undefined;
  let bestLength = Infinity;
  for (const access of sides) {
    const area = areaAt(floor, access);
    if (!area || (area.access ?? 'public') !== 'public') continue;
    if (floor.exhibits.some((other) => segmentHitsExhibit(access, access, other))) continue;
    const attachment = attach(floor, access);
    if (!attachment) continue;
    const length = distance(access, attachment.point);
    if (length < bestLength) {
      best = { ...base, access, attachment };
      bestLength = length;
    }
  }
  return best;
}

function buildPlaces(): ResolvedPlace[] {
  const result: ResolvedPlace[] = [];
  for (const floor of floorPlans) {
    for (const facility of floor.facilities) {
      const name = FACILITY_NODES[facility.kind];
      const node = name ? nodesById.get(nodeId(floor.id, name)) : undefined;
      if (!node) continue;
      result.push({ id: facility.id, floorId: floor.id, kind: 'facility', name: facility.name, at: facility.at, access: node.at, nodeId: node.id });
    }
    for (const area of AREA_PLACES.filter((place) => place.floorId === floor.id)) {
      const attachment = attach(floor, area.access);
      if (attachment) result.push({ ...area, kind: 'area', attachment });
      else if (import.meta.env?.DEV) console.warn(`[map] No clear walk to area "${area.id}".`);
    }
    for (const exhibit of floor.exhibits) {
      const place = displayPlace(floor, exhibit);
      if (place) result.push(place);
      else if (import.meta.env?.DEV) console.warn(`[map] No clear walk to display "${exhibit.id}".`);
    }
  }
  return result;
}

const resolvedPlaces = buildPlaces();
const placesById = new Map(resolvedPlaces.map((place) => [place.id, place]));

/** Every start / destination, in floor order. */
export const places: MapPlace[] = resolvedPlaces;

export function getPlace(id: string | null | undefined): MapPlace | undefined {
  return id ? placesById.get(id) : undefined;
}

export const floorName = (floorId: FloorId) => getFloorPlan(floorId).name;

/** Start of the text inside a location QR code, followed by the place ID in capitals. */
export const LOCATION_CODE_PREFIX = 'MINT-LOC-';

/** The text to put inside the location QR code for a place, e.g. "MINT-LOC-LEVEL-2-LIFT". */
export const locationCode = (placeId: string) => `${LOCATION_CODE_PREFIX}${placeId.toUpperCase()}`;

/**
 * The place a scanned location QR code stands for, or undefined when it is not a location code.
 * Accepts the short code (MINT-LOC-LEVEL-2-LIFT), which works on any web address, and the older
 * link form (.../visitor/map?from=level-2-lift).
 */
export function placeFromLocationCode(scanned: string): MapPlace | undefined {
  const text = scanned.trim();
  try {
    const fromLink = getPlace(new URL(text).searchParams.get('from'));
    if (fromLink) return fromLink;
  } catch {
    // Not a link: fall through to the short code.
  }
  if (!text.toUpperCase().startsWith(LOCATION_CODE_PREFIX)) return undefined;
  return getPlace(text.slice(LOCATION_CODE_PREFIX.length).toLowerCase());
}

/** Case-insensitive search over place name and floor. Every word must match. */
export function searchPlaces(query: string, limit = 8): MapPlace[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return places
    .filter((place) => {
      const text = `${place.name} ${floorName(place.floorId)}`.toLowerCase();
      return words.every((word) => text.includes(word));
    })
    .slice(0, limit);
}

// ---------- routing ----------

/** Extra cost (in map units) of changing floor, so same-floor walks are always preferred. */
const FLOOR_CHANGE_COST = 60;

type Graph = Map<string, Map<string, number>>;

function link(graph: Graph, a: string, b: string, cost: number) {
  if (!graph.has(a)) graph.set(a, new Map());
  if (!graph.has(b)) graph.set(b, new Map());
  graph.get(a)!.set(b, cost);
  graph.get(b)!.set(a, cost);
}

/** Adds a place to the graph and returns the id of its node. */
function addPlace(graph: Graph, points: Map<string, NavNode>, place: ResolvedPlace, key: string): string {
  if (place.nodeId) return place.nodeId;
  const { point, edge } = place.attachment!;
  const joinId = `${key}:join`;
  points.set(joinId, { id: joinId, floorId: place.floorId, at: point });
  for (const end of edge) link(graph, joinId, end, distance(point, points.get(end)!.at));
  if (samePoint(point, place.access)) return joinId;
  points.set(key, { id: key, floorId: place.floorId, at: place.access });
  link(graph, key, joinId, distance(place.access, point));
  return key;
}

function shortestPath(graph: Graph, start: string, goal: string): string[] | undefined {
  const best = new Map<string, number>([[start, 0]]);
  const previous = new Map<string, string>();
  const open = new Set([start]);
  while (open.size > 0) {
    let current = '';
    for (const id of open) if (!current || best.get(id)! < best.get(current)!) current = id;
    if (current === goal) break;
    open.delete(current);
    for (const [next, cost] of graph.get(current) ?? []) {
      const total = best.get(current)! + cost;
      if (total < (best.get(next) ?? Infinity)) {
        best.set(next, total);
        previous.set(next, current);
        open.add(next);
      }
    }
  }
  if (!best.has(goal)) return undefined;
  const path = [goal];
  while (path[0] !== start) path.unshift(previous.get(path[0])!);
  return path;
}

/** How a place reads inside a sentence: "the toilet", "Toy Collection display 4". */
const inSentence = (place: MapPlace) => (place.kind === 'facility' ? `the ${place.name.toLowerCase()}` : place.name);

const listOf = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/** Names of the areas a leg passes through, in order, without repeats. */
function zonesAlong(leg: RouteLeg): string[] {
  const floor = getFloorPlan(leg.floorId);
  const zones: string[] = [];
  leg.points.forEach((point, index) => {
    const next = leg.points[index + 1];
    const samples: MapPoint[] = next ? [point, [(point[0] + next[0]) / 2, (point[1] + next[1]) / 2]] : [point];
    for (const sample of samples) {
      const zone = areaAt(floor, sample)?.zone;
      if (zone && zones[zones.length - 1] !== zone) zones.push(zone);
    }
  });
  return zones;
}

/**
 * Directions between two places, or undefined when no confirmed walk connects them.
 * `floorChange` picks the lift or the staircase when the places are on different floors.
 */
export function findRoute(fromId: string, toId: string, floorChange: FloorChange): Route | undefined {
  const from = placesById.get(fromId);
  const to = placesById.get(toId);
  if (!from || !to || from.id === to.id) return undefined;

  const graph: Graph = new Map();
  const points = new Map(nodesById);
  for (const [a, b] of navEdges) link(graph, a, b, distance(points.get(a)!.at, points.get(b)!.at));

  if (from.floorId !== to.floorId) {
    const floors = FLOOR_CONNECTIONS[floorChange];
    if (!floors.includes(from.floorId) || !floors.includes(to.floorId)) return undefined;
    // One hop straight between the two floors, so the route never wanders onto a third floor.
    link(graph, nodeId(from.floorId, floorChange), nodeId(to.floorId, floorChange), FLOOR_CHANGE_COST);
  }

  const path = shortestPath(graph, addPlace(graph, points, from, '@from'), addPlace(graph, points, to, '@to'));
  if (!path) return undefined;

  const legs: RouteLeg[] = [];
  for (const id of path) {
    const node = points.get(id)!;
    const leg = legs[legs.length - 1];
    if (!leg || leg.floorId !== node.floorId) legs.push({ floorId: node.floorId, points: [node.at] });
    else if (!samePoint(leg.points[leg.points.length - 1], node.at)) leg.points.push(node.at);
  }

  const connector = floorChange === 'lift' ? 'the lift' : 'the staircase';
  const steps: RouteStep[] = [{ floorId: from.floorId, text: `Start at ${inSentence(from)} on ${floorName(from.floorId)}.` }];
  legs.forEach((leg, index) => {
    const isLast = index === legs.length - 1;
    if (leg.points.length > 1) {
      const target = isLast ? inSentence(to) : connector;
      // "through the toilet to the toilet" says nothing, so drop areas that are the target itself.
      const zones = zonesAlong(leg).filter((zone) => zone.toLowerCase() !== target.toLowerCase());
      const through = zones.length > 0 ? ` through ${listOf(zones)}` : '';
      steps.push({ floorId: leg.floorId, text: `Follow the highlighted route${through} to ${target}.` });
    }
    if (!isLast) {
      const next = legs[index + 1].floorId;
      const direction = getFloorPlan(next).order > getFloorPlan(leg.floorId).order ? 'up' : 'down';
      steps.push({ floorId: leg.floorId, text: `Take ${connector} ${direction} to ${floorName(next)}.` });
    }
  });
  steps.push({ floorId: to.floorId, text: `You have arrived at ${inSentence(to)} on ${floorName(to.floorId)}.` });

  return { from, to, legs, steps };
}

// ---------- self-check (development only) ----------

/** Lists network links that break the walking rules. Empty when the data is sound. */
export function findNetworkProblems(): string[] {
  const problems: string[] = [];
  for (const [a, b] of navEdges) {
    const from = nodesById.get(a);
    const to = nodesById.get(b);
    if (!from || !to) problems.push(`Link ${a} - ${b} names a missing node.`);
    else if (from.floorId !== to.floorId) problems.push(`Link ${a} - ${b} joins two floors.`);
    else if (!isClearWalk(getFloorPlan(from.floorId), from.at, to.at)) problems.push(`Link ${a} - ${b} is blocked.`);
  }
  const expected = floorPlans.reduce((count, floor) => count + floor.exhibits.length, 0);
  const found = resolvedPlaces.filter((place) => place.kind === 'display').length;
  if (found !== expected) problems.push(`${expected - found} display(s) have no clear walk to a walkway.`);
  return problems;
}

if (import.meta.env?.DEV) {
  for (const problem of findNetworkProblems()) console.warn(`[map] ${problem}`);
}
