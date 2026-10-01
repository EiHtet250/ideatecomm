/**
 * Discovery Trail rules and saved progress.
 *
 * - One spot is active at a time: the first spot (in play order) that is not complete.
 * - `submitScan` is the ONLY way to complete a spot. The camera scanner and the typed-code
 *   fallback both go through it, so they follow exactly the same checks.
 * - Each stamp, and its Rewards point, is given once per visitor on this device.
 * - Progress is kept in this browser per visitor. For logged-in visitors it is also saved to
 *   n8n (see trailSync.ts), which re-checks every completion and ignores repeats.
 */
import { readAuthSession } from '../components/auth/authSession';
import { DISCOVERY_TRAIL, spotsOnFloor, trailFloors, trailSpots, type DiscoverySpot } from '../data/trail/discoveryTrail';
import type { FloorId } from '../types/map';
import { readDemoVisitorAccount, saveDemoVisitorAccount } from './demoVisitor';
import { placeFromLocationCode } from './mapRouting';

const STORAGE_PREFIX = 'mint-discovery-trail:';
const STORAGE_VERSION = 1;

export interface TrailState {
  /** IDs of completed spots, in the order they were completed. */
  completedSpotIds: string[];
}

export type FloorStatus = 'completed' | 'current' | 'locked';

export type ScanResult =
  | { status: 'success'; spot: DiscoverySpot; floorCompleted: boolean; nextFloorId?: FloorId; finished: boolean }
  | { status: 'wrong-spot'; message: string }
  | { status: 'already-completed'; message: string }
  | { status: 'unrelated'; message: string }
  | { status: 'finished'; message: string };

// ---------- who is playing ----------

/** Logged-in visitors get their own saved trail; everyone else shares a guest trail on this device. */
export function trailPlayer(): { key: string; email?: string; legacyKey?: string } {
  const user = readAuthSession()?.user;
  // Keyed by email so the same person always gets the same saved trail, whatever ID the login returns.
  // `legacyKey` is where earlier versions saved a logged-in visitor's trail (by account ID).
  return user ? { key: user.email.toLowerCase(), email: user.email, legacyKey: user.id } : { key: 'guest' };
}

// ---------- storage ----------

const knownSpotIds = new Set(trailSpots.map((spot) => spot.id));

/** Keeps only real spot IDs, without repeats. */
function clean(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  return [...new Set(ids.filter((id): id is string => typeof id === 'string' && knownSpotIds.has(id)))];
}

export function loadTrailState(playerKey: string): TrailState {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_PREFIX + playerKey) ?? 'null');
    if (saved && typeof saved === 'object' && (saved as { version?: unknown }).version === STORAGE_VERSION) {
      return { completedSpotIds: clean((saved as { completedSpotIds?: unknown }).completedSpotIds) };
    }
  } catch {
    // Unreadable or blocked storage: start fresh for this visit.
  }
  return { completedSpotIds: [] };
}

export function saveTrailState(playerKey: string, state: TrailState): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + playerKey, JSON.stringify({ version: STORAGE_VERSION, ...state }));
  } catch {
    // Storage unavailable (e.g. private mode): progress lasts until the page is closed.
  }
}

const GUEST_KEY = 'guest';

/**
 * Progress for whoever is playing now.
 * Stamps collected before logging in are moved into the visitor's account the first time they
 * open the trail while logged in, so logging in never makes stamps "disappear". The reward
 * points for those stamps were already given when they were collected, so none are added again.
 */
export function loadPlayerState(player: { key: string; email?: string; legacyKey?: string }): TrailState {
  const own = loadTrailState(player.key);
  if (!player.email || player.key === GUEST_KEY) return own;

  const guest = loadTrailState(GUEST_KEY);
  const legacy = player.legacyKey && player.legacyKey !== player.key ? loadTrailState(player.legacyKey) : { completedSpotIds: [] };
  if (guest.completedSpotIds.length === 0 && legacy.completedSpotIds.length === 0) return own;

  const merged = mergeCompleted(own, [...legacy.completedSpotIds, ...guest.completedSpotIds]);
  saveTrailState(player.key, merged);
  if (guest.completedSpotIds.length > 0) saveTrailState(GUEST_KEY, { completedSpotIds: [] });
  return merged;
}

/** Adds spots completed elsewhere (from the server). Never removes or re-awards anything. */
export function mergeCompleted(state: TrailState, spotIds: unknown): TrailState {
  return { completedSpotIds: clean([...state.completedSpotIds, ...clean(spotIds)]) };
}

// ---------- reading progress ----------

export const isComplete = (state: TrailState, spotId: string) => state.completedSpotIds.includes(spotId);

/** The one spot the visitor is looking for now, or undefined when the adventure is finished. */
export const activeSpot = (state: TrailState): DiscoverySpot | undefined =>
  trailSpots.find((spot) => !isComplete(state, spot.id));

export function floorStatus(state: TrailState, floorId: FloorId): FloorStatus {
  if (spotsOnFloor(floorId).every((spot) => isComplete(state, spot.id))) return 'completed';
  return activeSpot(state)?.floorId === floorId ? 'current' : 'locked';
}

/** The floor the visitor should be on: the active spot's floor, or the last floor once finished. */
export const currentFloorId = (state: TrailState): FloorId =>
  activeSpot(state)?.floorId ?? trailFloors[trailFloors.length - 1];

// ---------- scanning ----------

/** Pulls the code out of whatever a QR code contains: plain text, or a link with ?trail=CODE. */
function readCode(scanned: string): string {
  const text = scanned.trim();
  try {
    const fromLink = new URL(text).searchParams.get('trail');
    if (fromLink) return fromLink.trim().toUpperCase();
  } catch {
    // Not a link: treat it as the code itself.
  }
  return text.toUpperCase();
}

const looksLikeMapCode = (scanned: string) => Boolean(placeFromLocationCode(scanned));

function awardPoint(spot: DiscoverySpot): void {
  const points = DISCOVERY_TRAIL.pointsPerStamp;
  if (points <= 0) return;
  const account = readDemoVisitorAccount();
  saveDemoVisitorAccount({
    ...account,
    pointsBalance: account.pointsBalance + points,
    pointsEarned: account.pointsEarned + points,
    pointsActivity: [
      ...account.pointsActivity,
      {
        id: `discovery-trail:${spot.id}:${Date.now()}`,
        type: 'earned',
        points,
        description: `Discovery Trail: ${spot.stamp.name}`,
        createdAt: new Date().toISOString(),
      },
    ],
  });
}

/**
 * Checks a scanned (or typed) code against the active spot.
 * Only a correct code for the active spot changes anything; every other result leaves the trail as it was.
 */
export function submitScan(state: TrailState, scanned: string): { state: TrailState; result: ScanResult } {
  const active = activeSpot(state);
  const code = readCode(scanned);
  const spot = trailSpots.find((candidate) => candidate.qrCode.toUpperCase() === code);

  if (!spot) {
    const message = looksLikeMapCode(scanned)
      ? 'That is a Museum Map location code, not a Discovery Trail code. Look for the trail QR code beside the display.'
      : 'That code is not part of the Discovery Trail. Look for the trail QR code beside the display.';
    return { state, result: { status: 'unrelated', message } };
  }

  if (isComplete(state, spot.id)) {
    const message = active
      ? `You already collected the ${spot.stamp.name}. Your next spot is “${active.title}”.`
      : `You already collected the ${spot.stamp.name}.`;
    return { state, result: { status: 'already-completed', message } };
  }

  if (!active) {
    return { state, result: { status: 'finished', message: 'You have already finished the adventure.' } };
  }

  if (spot.id !== active.id) {
    return {
      state,
      result: {
        status: 'wrong-spot',
        message: `Not this one yet! That stamp is still locked. First find “${active.title}” and scan its code.`,
      },
    };
  }

  const next: TrailState = { completedSpotIds: [...state.completedSpotIds, spot.id] };
  awardPoint(spot);
  const floorCompleted = floorStatus(next, spot.floorId) === 'completed';
  const upcoming = activeSpot(next);
  return {
    state: next,
    result: {
      status: 'success',
      spot,
      floorCompleted,
      nextFloorId: floorCompleted ? upcoming?.floorId : undefined,
      finished: !upcoming,
    },
  };
}
