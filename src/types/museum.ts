// Core museum types shared by the Museum Map and the Discovery Trail.
// Both views read the same floor and location data.
// These are intentionally minimal - extend them as features are built.

/** A floor (level) of the museum. */
export interface Floor {
  id: string;
  /** Floor number as displayed to visitors, e.g. 1, 2, 3. */
  level: number;
  name: string;
  description?: string;
}

/** Category of a point of interest inside the museum. */
export type LocationType =
  | 'gallery'
  | 'entrance'
  | 'lift'
  | 'stairs'
  | 'restroom'
  | 'shop'
  | 'cafe'
  | 'other';

/** A physical place in the museum (gallery, lift, restroom, etc.). */
export interface Location {
  id: string;
  name: string;
  type: LocationType;
  /** References Floor.id */
  floorId: string;
  description?: string;
  /** Future: position on the floor map (units decided by the map feature). */
  mapPosition?: { x: number; y: number };
  /** Future: identifier encoded in this location's QR code. */
  qrCodeId?: string;
}

/** A single exhibit or display on show. */
export interface Exhibit {
  id: string;
  title: string;
  description: string;
  /** References Location.id */
  locationId: string;
  imageUrl?: string;
  /** Optional era the item comes from, e.g. "1950s". */
  era?: string;
  tags?: string[];
}
