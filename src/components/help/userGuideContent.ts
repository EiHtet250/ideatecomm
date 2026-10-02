// User guide for the Museum Map and Discovery Trail on the Help page.
// These two features are owned by other team members. Every step is marked status "draft".
//
// TODO: confirm with the owner of this feature before final submission.
//
// Source checked on branch "final":
//   - MuseumMapPage "Planned for this page": floor selector (floors.ts), floor map with
//     locations and exhibits, exhibit details when a location is selected, optional
//     directions after scanning a location QR code.
//   - The Discovery Trail is further along: DiscoveryTrailPage is a "Toy Time Machine" game
//     where visitors scan a toy's QR code to check in, answer a question/clue, and collect a
//     stamp per completed mission, then view progress towards a reward.
// Steps below are written only from those two sources. See the summary note returned to the
// user for the wording that was softened or removed.
//
// All visitor-facing text lives in this file (not in the components) so other languages can be
// added through the shared visitor translation dictionary later.
import { paths } from '../../routes/paths';

/** Names of the inline SVG icons drawn in GuideIcons.tsx. Icons are decorative (aria-hidden). */
export type GuideIconName =
  | 'tap'
  | 'floors'
  | 'map'
  | 'pin'
  | 'directions'
  | 'trail'
  | 'qr'
  | 'quiz'
  | 'stamp'
  | 'reward';

export interface GuideStep {
  title: string;
  detail: string;
  /** Decorative icon that matches the step. Text carries the meaning. */
  icon: GuideIconName;
  /** Optional short, generic, always-true tip shown as a small callout. */
  tip?: string;
  /** Always "draft" until the feature owner confirms. Never shown to visitors. */
  status: 'draft';
}

export interface UserGuide {
  id: 'museum-map' | 'discovery-trail';
  title: string;
  overview: string;
  /** Decorative header illustration name. */
  icon: 'map' | 'trail';
  /** Badge style along the path: map pins or passport stamps. */
  theme: 'map' | 'trail';
  link?: { label: string; to: string };
  steps: GuideStep[];
}

export interface UserGuideStrings {
  heading: string;
  intro: string;
  /** Segmented guide switcher. */
  switcherLegend: string;
  /** "Still being built" information banner. */
  notice: string;
  /** Small text label on each step, e.g. "Step 2 of 5". */
  stepLabel: (current: number, total: number) => string;
  /** Progress line above the path, e.g. "2 of 5 steps done". */
  progressLabel: (done: number, total: number) => string;
  /** Message when every step is marked done. */
  allDoneLabel: string;
  /** "Got it" toggle button, not yet pressed. */
  markDoneLabel: string;
  /** Toggle button once pressed. */
  markedDoneLabel: string;
  /** Short word shown next to the check mark on a done step. */
  doneTag: string;
  /** Label before a tip callout. */
  tipLabel: string;
  guides: UserGuide[];
}

const draft = (step: Omit<GuideStep, 'status'>): GuideStep => ({ ...step, status: 'draft' });

export const userGuideStrings: UserGuideStrings = {
  heading: 'How to use the Museum Map and Discovery Trail',
  intro: 'Pick a guide, then follow the steps one by one.',
  switcherLegend: 'Choose a guide',
  notice: 'These two features are still being built, so these steps may change.',
  stepLabel: (current, total) => `Step ${current} of ${total}`,
  progressLabel: (done, total) => `${done} of ${total} steps done`,
  allDoneLabel: 'You are ready to explore!',
  markDoneLabel: 'Got it',
  markedDoneLabel: 'Done',
  doneTag: 'Done',
  tipLabel: 'Tip',
  guides: [
    {
      id: 'museum-map',
      title: 'Museum Map',
      overview: 'Use the map to find your way around the floors of the museum.',
      icon: 'map',
      theme: 'map',
      link: { label: 'Open the Museum Map', to: paths.museumMap },
      steps: [
        draft({
          title: 'Open the Museum Map',
          detail: 'Open the Museum Map from the card on the Home page.',
          icon: 'tap',
        }),
        draft({ title: 'Choose a floor', detail: 'Use the floor selector to pick a floor.', icon: 'floors' }),
        draft({
          title: 'Look at the floor map',
          detail: 'The map shows the locations and exhibits on that floor.',
          icon: 'map',
        }),
        draft({
          title: 'Select an exhibit',
          detail: 'Select a location on the map to read its exhibit details.',
          icon: 'pin',
        }),
        draft({
          title: 'Get directions after a QR scan',
          detail: 'If you scan a location QR code, the map can show directions. This step is optional.',
          icon: 'directions',
        }),
      ],
    },
    {
      id: 'discovery-trail',
      title: 'Discovery Trail',
      overview: 'Follow the trail to find toys around the museum, answer clues and collect stamps.',
      icon: 'trail',
      theme: 'trail',
      link: { label: 'Open the Discovery Trail', to: paths.discoveryTrail },
      steps: [
        draft({
          title: 'Open the Discovery Trail',
          detail: 'Open the Discovery Trail from the navigation or from the card on the Home page.',
          icon: 'trail',
        }),
        draft({ title: 'See your missions', detail: 'Look at the list of missions and stamps to see what to do.', icon: 'quiz' }),
        draft({
          title: 'Find a toy and scan its code',
          detail: 'Walk to a toy and scan its QR code to start its clue.',
          icon: 'qr',
        }),
        draft({ title: 'Answer the clue', detail: 'Answer the question or clue for that toy to continue.', icon: 'quiz' }),
        draft({ title: 'Collect a stamp', detail: 'Finish a mission to collect a digital stamp.', icon: 'stamp' }),
        draft({ title: 'Check your reward', detail: 'Check your points and your progress towards a reward.', icon: 'reward' }),
      ],
    },
  ],
};
