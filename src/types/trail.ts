// Discovery Trail types. The trail reuses museum Locations and Exhibits.

/** A collectable digital stamp. */
export interface Stamp {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
}

/** One stop on the Discovery Trail. */
export interface TrailStop {
  id: string;
  /** Order of the stop on the trail, starting at 1. */
  order: number;
  /** References Location.id */
  locationId?: string;
  /** Collection theme; physical floor placement still needs confirmation. */
  collection: string;
  /** Optional exhibit the stop focuses on. References Exhibit.id */
  exhibitId?: string;
  /** Short text describing the challenge at this stop. */
  challenge: string;
  /** Stamp earned when the challenge is completed. References Stamp.id */
  stampId: string;
  storyIntro: string;
  storySuccess: string;
  questions: TrailQuestion[];
}

export type TrailQuestion = {
  id: string;
  type: 'find' | 'name' | 'blank' | 'multiple-choice';
  exhibitId: string;
  prompt: string;
  sentence?: string;
  choices?: string[];
  answers?: string[];
};
