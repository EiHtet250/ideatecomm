/**
 * Discovery Trail configuration: floors, discovery spots, clues, QR codes and stamps.
 *
 * !! DEMO CONTENT !!
 * These spots, clues and stamps are placeholders made for the project demo. They are NOT
 * the museum's real trail: the clues only describe where a display stands on the map and
 * say nothing about which toys are inside. Replace them with the museum's real spots.
 *
 * To change the trail, edit only this file:
 * - `floors` sets the floor order. A floor unlocks when the floor before it is complete.
 * - Spots are played in list order within their floor. A floor may have any number of spots.
 * - `placeId` must be a display ID from the Museum Map (src/data/map/floorPlans.ts).
 * - `qrCode` is the text inside the spot's QR code. It must be unique. Keep it in step with
 *   the n8n workflow (n8n/workflows/mint-trail-progress.json), which checks the same codes.
 */
import type { FloorId } from '../../types/map';

export type StampArt = 'rocket' | 'robot' | 'spinning-top' | 'teddy' | 'rocking-horse';

export interface TrailStamp {
  /** Stable and unique. */
  id: string;
  name: string;
  art: StampArt;
}

export interface DiscoverySpot {
  /** Stable and unique. */
  id: string;
  floorId: FloorId;
  /** Display on the Museum Map where the QR code is placed. */
  placeId: string;
  title: string;
  clue: string;
  hint: string;
  /** Text inside this spot's QR code. */
  qrCode: string;
  stamp: TrailStamp;
}

export const DISCOVERY_TRAIL = {
  /** Shown on the page so nobody mistakes this for the museum's real trail. */
  isDemo: true,
  name: 'Toy Explorer Trail',
  /** Points added to the visitor's Rewards balance for each stamp. */
  pointsPerStamp: 1,
  /** Floors in the order they unlock. Floors without spots are skipped. */
  floors: ['level-2', 'level-3'] as FloorId[],
  spots: [
    {
      id: 'spot-rocket',
      floorId: 'level-2',
      placeId: 'level-2-a-05',
      title: 'Rocket Launch Pad',
      clue: 'Blast off! Leave the lift lobby and walk into the big gallery. Look for the largest display case standing on its own in the middle of the room.',
      hint: 'It is display 5 on the map: the wide case on the left side of the gallery, away from the walls.',
      qrCode: 'MINT-TRAIL-ROCKET',
      stamp: { id: 'stamp-rocket', name: 'Rocket Stamp', art: 'rocket' },
    },
    {
      id: 'spot-robot',
      floorId: 'level-2',
      placeId: 'level-2-a-18',
      title: 'Robot Parade',
      clue: 'Beep boop! March along the long row of displays on the bottom wall of the gallery. Your next stamp waits near the middle of the row.',
      hint: 'It is display 18 on the map. From the lift lobby opening, walk straight to the far wall and turn right.',
      qrCode: 'MINT-TRAIL-ROBOT',
      stamp: { id: 'stamp-robot', name: 'Robot Stamp', art: 'robot' },
    },
    {
      id: 'spot-spinning-top',
      floorId: 'level-3',
      placeId: 'level-3-a-04',
      title: 'Spinning Top Corner',
      clue: 'Round and round! On Level 3, leave the lift lobby and find the short row of displays along the bottom wall of the gallery.',
      hint: 'It is display 4 on the map, the third case in the row counting from the left.',
      qrCode: 'MINT-TRAIL-TOP',
      stamp: { id: 'stamp-spinning-top', name: 'Spinning Top Stamp', art: 'spinning-top' },
    },
  ] as DiscoverySpot[],
};

/** Floors that actually have spots, in unlock order. */
export const trailFloors: FloorId[] = DISCOVERY_TRAIL.floors.filter((floorId) =>
  DISCOVERY_TRAIL.spots.some((spot) => spot.floorId === floorId),
);

/** Every spot in play order: floor order first, then list order. */
export const trailSpots: DiscoverySpot[] = trailFloors.flatMap((floorId) =>
  DISCOVERY_TRAIL.spots.filter((spot) => spot.floorId === floorId),
);

export const spotsOnFloor = (floorId: FloorId) => trailSpots.filter((spot) => spot.floorId === floorId);
