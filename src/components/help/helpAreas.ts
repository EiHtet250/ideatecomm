import { floors } from '../../data';
import type { HelpStrings } from './helpStrings';

export interface AreaOption {
  /** Sent to staff. Kept in English so staff always read the same words. */
  value: string;
  /** Shown to the visitor (translatable). */
  label: string;
}

const STATIC_LEVELS = [1, 2, 3, 4, 5];
export const UNSURE_AREA_VALUE = 'Not sure';

/** Uses src/data floors when the team fills them in, otherwise Level 1 to Level 5. */
export function getAreaOptions(strings: HelpStrings['request']): AreaOption[] {
  const levels =
    floors.length > 0
      ? [...floors]
          .sort((a, b) => a.level - b.level)
          .map((floor) => ({
            value: floor.name ? `Level ${floor.level} (${floor.name})` : `Level ${floor.level}`,
            label: floor.name ? `${strings.areaLevel(floor.level)} (${floor.name})` : strings.areaLevel(floor.level),
          }))
      : STATIC_LEVELS.map((level) => ({ value: `Level ${level}`, label: strings.areaLevel(level) }));

  return [...levels, { value: UNSURE_AREA_VALUE, label: strings.areaUnsure }];
}
