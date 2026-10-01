/**
 * Shared floor plans for the Museum Map and the Discovery Trail.
 *
 * Source: the museum's published floor plans (https://emint.com/floor-plan/),
 * which cover Level 2, Level 3, Level 4, Level 5 and the Rooftop. Positions were
 * traced from those images, so they are schematic, not survey-accurate.
 *
 * Only things shown on the published plans are included. Not on the plans, so not here:
 * Level 1 / the entrance, and the names of individual toys.
 *
 * Gaps between wall lines are the door openings drawn on the plans.
 * IDs are stable. Add new displays to the END of a list; never renumber or reuse an ID.
 */
import type {
  ExhibitCode,
  FloorId,
  FloorPlan,
  MapArea,
  MapExhibit,
  MapFacility,
  MapPoint,
  MapRect,
  MapWall,
} from '../../types/map';

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 224;

/** Legend from the published floor plans. */
export const EXHIBIT_CODE_NAMES: Record<ExhibitCode, string> = {
  A: 'Toy Collection',
  B: 'Introductory Monolith',
  C: 'Exhibition Narrative Panel',
  D: 'Collection Panel',
  H: 'Artwork Gallery',
  I: 'Enamel Sign Gallery',
};

// ---------- helpers ----------

const box = (x: number, y: number, w: number, h: number): MapPoint[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

const r = (x: number, y: number, w: number, h: number): MapRect => ({ x, y, w, h });

/** `count` equal boxes in a row, starting at x and repeating every `step`. */
const row = (x: number, y: number, w: number, h: number, count: number, step: number): MapRect[] =>
  Array.from({ length: count }, (_, index) => r(Math.round((x + index * step) * 10) / 10, y, w, h));

/**
 * Builds the displays of one legend letter on one floor.
 * IDs count per letter (level-3-a-01, ...); pin numbers continue from `firstNumber`.
 */
function displays(floorId: FloorId, code: ExhibitCode, rects: MapRect[], firstNumber = 1): MapExhibit[] {
  const legend = EXHIBIT_CODE_NAMES[code];
  return rects.map((rect, index) => ({
    id: `${floorId}-${code.toLowerCase()}-${String(index + 1).padStart(2, '0')}`,
    floorId,
    code,
    number: firstNumber + index,
    name: code === 'A' ? `${legend} display ${firstNumber + index}` : rects.length > 1 ? `${legend}, section ${index + 1}` : legend,
    rect,
  }));
}

// ---------- parts every floor shares (same position on each published plan) ----------

const OUTER_WALL: MapWall = { points: box(3, 3, 994, 218), closed: true };

/** Staircase, HR/DR cupboard, lift lobby and lift. */
function coreAreas(floorId: FloorId): MapArea[] {
  return [
    { id: `${floorId}-stair-core`, tone: 'lobby', zone: 'the staircase', points: box(400, 6, 290, 100) },
    { id: `${floorId}-hr-dr`, tone: 'floor', access: 'restricted', points: box(641, 56, 48, 50) },
    {
      id: `${floorId}-lift-lobby`,
      tone: 'lobby',
      zone: 'the lift lobby',
      points: box(690, 6, 125, 100),
      labels: [{ text: 'Lift Lobby', at: [752, 88], size: 10 }],
    },
    { id: `${floorId}-lift-shaft`, tone: 'floor', access: 'restricted', points: box(815, 6, 90, 100) },
  ];
}

/**
 * Walls of the staircase, lift lobby and lift.
 * The lobby opens onto the floor through the gap in its bottom wall (`exitFrom` to `exitTo`).
 */
function coreWalls(exitFrom: number, exitTo: number): MapWall[] {
  return [
    { points: [[400, 6], [400, 106], [exitFrom, 106]] },
    { points: [[exitTo, 106], [905, 106]] },
    // Staircase door into the lift lobby.
    { points: [[690, 6], [690, 14]] },
    { points: [[690, 34], [690, 56]] },
    // HR/DR cupboard.
    { points: [[641, 106], [641, 56], [690, 56], [690, 106]] },
    // Lift shaft, with its door facing the lobby.
    { points: [[815, 6], [815, 38]] },
    { points: [[815, 74], [815, 106]] },
    { points: [[905, 6], [905, 106]] },
    // Lift car.
    { points: box(830, 22, 60, 66), closed: true },
  ];
}

const CORE_WALLS = coreWalls(745, 797);

function coreFacilities(floorId: FloorId): MapFacility[] {
  return [
    { id: `${floorId}-staircase`, kind: 'stairs', name: 'Staircase', at: [590, 56] },
    { id: `${floorId}-lift`, kind: 'lift', name: 'Lift', at: [860, 55] },
  ];
}

/** The two EXIT signs shown on Levels 2 to 5. */
function exitSigns(floorId: FloorId): MapFacility[] {
  return [
    { id: `${floorId}-exit-lobby`, kind: 'exit', name: 'Exit sign', at: [716, 16] },
    { id: `${floorId}-exit-gallery`, kind: 'exit', name: 'Exit sign', at: [808, 122] },
  ];
}

/** Glass facade at the front of Levels 3 to 5. */
function glassFront(floorId: FloorId): MapArea {
  return {
    id: `${floorId}-glass-front`,
    tone: 'glass',
    access: 'restricted',
    points: box(6, 6, 116, 212),
    panes: { cols: 2, rows: 4 },
  };
}

/** Toilets and service rooms at the back of Levels 2 to 4. */
function backRooms(floorId: FloorId): MapArea[] {
  return [
    { id: `${floorId}-service-rooms`, tone: 'floor', access: 'restricted', points: box(908, 6, 88, 98) },
    { id: `${floorId}-toilet-lobby`, tone: 'lobby', zone: 'the toilet lobby', points: box(878, 106, 118, 60) },
    { id: `${floorId}-toilet-room`, tone: 'lobby', zone: 'the toilet', points: box(898, 166, 98, 52) },
    { id: `${floorId}-riser`, tone: 'floor', access: 'restricted', points: box(878, 166, 20, 52) },
  ];
}

const BACK_ROOM_WALLS: MapWall[] = [
  { points: [[908, 6], [908, 104], [996, 104]] },
  // Toilet lobby door from the gallery.
  { points: [[878, 106], [878, 128]] },
  { points: [[878, 150], [878, 218]] },
  // Toilet door from the toilet lobby.
  { points: [[878, 166], [930, 166]] },
  { points: [[952, 166], [996, 166]] },
  { points: [[898, 166], [898, 218]] },
];

/** The Toy Collection strip inside the staircase core (Levels 2 to 5). */
const CORE_DISPLAY = r(408, 12, 18, 88);

// ---------- floors ----------

const level2: FloorPlan = {
  id: 'level-2',
  name: 'Level 2',
  order: 0,
  areas: [
    // Shown on the plan, but no door from the gallery is drawn, so not treated as open to visitors.
    {
      id: 'level-2-front',
      tone: 'floor',
      access: 'restricted',
      points: box(6, 6, 118, 212),
      labels: [
        { text: 'Alfresco', at: [26, 112], size: 9, rotate: -90 },
        { text: 'Void', at: [70, 160], size: 9 },
        { text: 'External Catering', at: [110, 74], size: 8, rotate: -90 },
      ],
    },
    {
      id: 'level-2-gallery',
      tone: 'teal',
      zone: 'the gallery',
      points: [[126, 6], [400, 6], [400, 106], [878, 106], [878, 218], [126, 218]],
      labels: [{ text: 'After-Hours Networking', at: [610, 162], size: 13 }],
    },
    ...coreAreas('level-2'),
    ...backRooms('level-2'),
  ],
  walls: [OUTER_WALL, { points: [[125, 6], [125, 218]] }, ...CORE_WALLS, ...BACK_ROOM_WALLS],
  facilities: [
    ...coreFacilities('level-2'),
    ...exitSigns('level-2'),
    { id: 'level-2-toilet', kind: 'toilet', name: 'Toilet', at: [966, 192] },
  ],
  exhibits: displays('level-2', 'A', [
    // Along the top wall.
    r(136, 8, 39, 9),
    r(177, 8, 40, 9),
    r(295, 8, 39, 9),
    r(336, 8, 39, 9),
    // Free-standing in the gallery.
    r(174, 109, 77, 34),
    r(258, 118, 57, 25),
    r(399, 112, 80, 27),
    r(484, 112, 47, 27),
    // Staircase core.
    CORE_DISPLAY,
    // Along the bottom wall.
    ...row(136, 207, 39, 9, 5, 41),
    ...row(381, 207, 39, 9, 11, 41.2),
  ]),
};

const level3: FloorPlan = {
  id: 'level-3',
  name: 'Level 3',
  order: 1,
  areas: [
    glassFront('level-3'),
    {
      id: 'level-3-event-space',
      tone: 'purple',
      zone: 'the event space',
      points: [[124, 6], [400, 6], [400, 106], [536, 106], [536, 218], [124, 218]],
      labels: [{ text: 'Event Space & Pop-up Exhibitions', at: [330, 160], size: 13 }],
    },
    // Shown on the published plan without a label.
    { id: 'level-3-platform', tone: 'plinth', access: 'restricted', points: box(202, 72, 129, 40) },
    { id: 'level-3-gallery', tone: 'floor', zone: 'the gallery', points: box(536, 106, 342, 112) },
    ...coreAreas('level-3'),
    ...backRooms('level-3'),
  ],
  walls: [OUTER_WALL, { points: [[123, 6], [123, 218]] }, ...CORE_WALLS, ...BACK_ROOM_WALLS],
  facilities: [
    ...coreFacilities('level-3'),
    ...exitSigns('level-3'),
    { id: 'level-3-toilet', kind: 'toilet', name: 'Toilet', at: [966, 192] },
  ],
  exhibits: displays('level-3', 'A', [CORE_DISPLAY, ...row(629, 207, 38, 9, 6, 40.5)]),
};

const level4: FloorPlan = {
  id: 'level-4',
  name: 'Level 4',
  order: 2,
  areas: [
    glassFront('level-4'),
    {
      id: 'level-4-void',
      tone: 'floor',
      access: 'void',
      points: [[124, 6], [400, 6], [400, 169], [556, 169], [556, 218], [124, 218]],
      labels: [{ text: 'Void', at: [174, 116], size: 10 }],
    },
    {
      id: 'level-4-gallery',
      tone: 'floor',
      zone: 'the gallery',
      points: [[470, 106], [878, 106], [878, 218], [556, 218], [556, 169], [470, 169]],
    },
    {
      id: 'level-4-event-space',
      tone: 'yellow',
      zone: 'the event space',
      points: [[223, 54], [398, 54], [398, 107], [470, 107], [470, 183], [223, 183]],
      labels: [
        { text: 'Event Space', at: [312, 92], size: 11 },
        { text: '& Pop-up Exhibitions', at: [312, 105], size: 9 },
      ],
    },
    ...coreAreas('level-4'),
    ...backRooms('level-4'),
  ],
  walls: [
    OUTER_WALL,
    { points: [[123, 6], [123, 218]] },
    // Event space: walls on three sides, open to the gallery on the right.
    { points: [[223, 183], [223, 54], [398, 54]] },
    { points: [[223, 183], [470, 183], [470, 170]] },
    // Glass edge between the gallery and the void.
    { points: [[556, 170], [556, 218]] },
    ...CORE_WALLS,
    ...BACK_ROOM_WALLS,
  ],
  facilities: [
    ...coreFacilities('level-4'),
    ...exitSigns('level-4'),
    { id: 'level-4-toilet', kind: 'toilet', name: 'Toilet', at: [966, 192] },
  ],
  exhibits: displays('level-4', 'A', [
    // Inside the event space.
    r(233, 59, 25, 42),
    r(366, 74, 26, 38),
    r(233, 145, 30, 32),
    r(320, 154, 44, 23),
    r(422, 145, 28, 32),
    // Staircase core.
    CORE_DISPLAY,
    // Gallery.
    r(558, 170, 27, 46),
    ...row(628, 207, 39, 9, 6, 41),
  ]),
};

const level5: FloorPlan = {
  id: 'level-5',
  name: 'Level 5',
  order: 3,
  areas: [
    glassFront('level-5'),
    {
      id: 'level-5-void',
      tone: 'floor',
      access: 'void',
      points: [[124, 6], [400, 6], [400, 173], [556, 173], [556, 218], [124, 218]],
      labels: [{ text: 'Void', at: [174, 116], size: 10 }],
    },
    {
      id: 'level-5-gallery',
      tone: 'floor',
      zone: 'the gallery',
      points: [[472, 106], [850, 106], [850, 218], [556, 218], [556, 173], [472, 173]],
    },
    {
      id: 'level-5-event-space',
      tone: 'green',
      zone: 'the event space',
      points: [[224, 55], [399, 55], [399, 107], [472, 107], [472, 180], [224, 180]],
      labels: [
        { text: 'Event Space', at: [308, 95], size: 11 },
        { text: '& Pop-up Exhibitions', at: [308, 108], size: 9 },
      ],
    },
    ...coreAreas('level-5'),
    { id: 'level-5-back-room', tone: 'floor', access: 'restricted', points: box(908, 6, 88, 20) },
    { id: 'level-5-accessible-toilet-room', tone: 'lobby', zone: 'the accessible toilet', points: box(908, 28, 88, 78) },
    { id: 'level-5-toilet-lobby', tone: 'lobby', zone: 'the toilet lobby', points: box(850, 106, 146, 80) },
    { id: 'level-5-service-rooms', tone: 'floor', access: 'restricted', points: box(850, 186, 146, 32) },
  ],
  walls: [
    OUTER_WALL,
    { points: [[123, 6], [123, 218]] },
    { points: [[224, 180], [224, 55], [399, 55]] },
    { points: [[224, 180], [472, 180], [472, 173]] },
    { points: [[556, 174], [556, 218]] },
    ...CORE_WALLS,
    { points: [[908, 6], [908, 104], [940, 104]] },
    // Accessible toilet door from the toilet lobby.
    { points: [[964, 104], [996, 104]] },
    { points: [[908, 27], [996, 27]] },
    // Toilet lobby door from the gallery.
    { points: [[850, 106], [850, 130]] },
    { points: [[850, 152], [850, 218]] },
    { points: [[850, 186], [996, 186]] },
  ],
  facilities: [
    ...coreFacilities('level-5'),
    ...exitSigns('level-5'),
    { id: 'level-5-accessible-toilet', kind: 'accessible-toilet', name: 'Accessible toilet', at: [968, 62] },
  ],
  exhibits: displays('level-5', 'A', [
    // Inside the event space.
    r(232, 61, 21, 15),
    r(363, 61, 34, 44),
    // Staircase core.
    CORE_DISPLAY,
    // Gallery.
    r(558, 174, 27, 42),
    ...row(629, 207, 40, 9, 5, 42.5),
  ]),
};

const rooftop: FloorPlan = {
  id: 'rooftop',
  name: 'Rooftop',
  order: 4,
  areas: [
    { id: 'rooftop-glass-edge', tone: 'glass', access: 'restricted', points: box(6, 6, 5, 212) },
    {
      id: 'rooftop-public-balcony',
      tone: 'outdoor',
      zone: 'The Public Balcony',
      points: [[11, 6], [154, 6], [154, 107], [404, 107], [404, 218], [11, 218]],
      labels: [{ text: 'The Public Balcony', at: [180, 176], size: 13 }],
    },
    {
      id: 'rooftop-public-bar',
      tone: 'plinth',
      zone: 'The Public Bar',
      points: box(154, 6, 246, 101),
      labels: [{ text: 'The Public Bar', at: [276, 56], size: 13 }],
    },
    {
      id: 'rooftop-public-house',
      tone: 'outdoor',
      zone: 'The Public House',
      points: box(404, 106, 352, 112),
      labels: [{ text: 'The Public House', at: [560, 176], size: 13 }],
    },
    ...coreAreas('rooftop'),
    { id: 'rooftop-back', tone: 'floor', access: 'restricted', points: box(905, 6, 91, 101) },
    {
      id: 'rooftop-sprinkler-pump-room',
      tone: 'floor',
      access: 'restricted',
      points: box(756, 107, 240, 111),
      labels: [{ text: 'Sprinkler Pump Room', at: [876, 164], size: 10 }],
    },
  ],
  // On the rooftop the lift lobby opens straight onto The Public House.
  walls: [OUTER_WALL, ...coreWalls(700, 753), { points: [[756, 107], [756, 218]] }],
  facilities: coreFacilities('rooftop'),
  exhibits: [
    ...displays('rooftop', 'B', [r(629, 60, 9, 28)], 1),
    ...displays('rooftop', 'C', [r(770, 8, 41, 7)], 2),
    ...displays('rooftop', 'D', [r(746, 150, 8, 40)], 3),
    ...displays('rooftop', 'H', [r(404, 113, 286, 9)], 4),
    ...displays(
      'rooftop',
      'I',
      [r(361, 207, 41, 9), r(406, 207, 64, 9), r(474, 207, 73, 9), r(550, 207, 78, 9), r(632, 207, 120, 9)],
      5,
    ),
  ],
};

/** All floors, lowest first. */
export const floorPlans: FloorPlan[] = [level2, level3, level4, level5, rooftop];

export const DEFAULT_FLOOR_ID: FloorId = 'level-2';

export function getFloorPlan(id: FloorId): FloorPlan {
  return floorPlans.find((floor) => floor.id === id) ?? floorPlans[0];
}

export function isFloorId(value: unknown): value is FloorId {
  return floorPlans.some((floor) => floor.id === value);
}

/** Every display position on every floor. */
export const mapExhibits: MapExhibit[] = floorPlans.flatMap((floor) => floor.exhibits);
