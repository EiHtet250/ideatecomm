import type { ReactNode } from 'react';
import type { GuideIconName } from './userGuideContent';

/**
 * Small inline SVG icons for the user guide. All icons are decorative: the step text
 * carries the meaning, so every icon is aria-hidden and has no title.
 * Icons use `currentColor` and a 24x24 viewBox so colour and size come from CSS.
 */

type IconProps = { className?: string };

const base = (className?: string) => ({
  className,
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
});

function TapIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M9 11V6a2 2 0 0 1 4 0v5" />
      <path d="M13 8a2 2 0 0 1 4 0v4" />
      <path d="M17 10a2 2 0 0 1 4 0v4a6 6 0 0 1-6 6h-2a6 6 0 0 1-5.3-3.2L5 13.5a1.6 1.6 0 0 1 2.7-1.7L9 13.5" />
    </svg>
  );
}

function FloorsIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 3 3 7l9 4 9-4-9-4Z" />
      <path d="M3 12l9 4 9-4" />
      <path d="M3 17l9 4 9-4" />
    </svg>
  );
}

function MapIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </svg>
  );
}

function PinIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function DirectionsIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M4 15v-2a4 4 0 0 1 4-4h8" />
      <path d="m13 5 4 4-4 4" />
      <circle cx="5" cy="18" r="1.6" />
    </svg>
  );
}

function TrailIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="6" cy="6" r="1.6" />
      <circle cx="12" cy="11" r="1.6" />
      <circle cx="18" cy="16" r="1.6" />
      <path d="M7.5 7.2 10.5 9.6" strokeDasharray="1 3" />
      <path d="M13.5 12.2 16.5 14.6" strokeDasharray="1 3" />
      <path d="M18 18v2" />
    </svg>
  );
}

function QrIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <path d="M14 14h3v3" />
      <path d="M20 14v6" />
      <path d="M14 20h3" />
    </svg>
  );
}

function QuizIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.2a2.8 2.8 0 0 1 5.2 1.3c0 1.8-2.5 2-2.5 3.5" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function StampIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M9 9a3 3 0 1 1 6 0c0 1.6-1.3 2.3-1.6 3.4H10.6C10.3 11.3 9 10.6 9 9Z" />
      <path d="M7 15h10" />
      <rect x="5" y="17" width="14" height="3" rx="1" />
    </svg>
  );
}

function RewardIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="9" r="5" />
      <path d="m9 13-2 7 5-3 5 3-2-7" />
    </svg>
  );
}

/** Larger header illustrations. */
function MapHeaderIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M8 4 3 6v13l5-2 8 2 5-2V4l-5 2-8-2Z" />
      <path d="M8 4v13" />
      <path d="M16 6v13" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

function TrailHeaderIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="5" cy="18" r="1.6" />
      <circle cx="11" cy="12" r="1.6" />
      <circle cx="17" cy="7" r="1.6" />
      <path d="M6.4 16.8 9.6 13.2" strokeDasharray="1 3" />
      <path d="M12.4 10.8 15.6 8.2" strokeDasharray="1 3" />
      <path d="M19 5.5 20.5 4" />
      <path d="M20.5 4 20 6" />
    </svg>
  );
}

const stepIcons: Record<GuideIconName, (props: IconProps) => ReactNode> = {
  tap: TapIcon,
  floors: FloorsIcon,
  map: MapIcon,
  pin: PinIcon,
  directions: DirectionsIcon,
  trail: TrailIcon,
  qr: QrIcon,
  quiz: QuizIcon,
  stamp: StampIcon,
  reward: RewardIcon,
};

/** Decorative step icon chosen by name. Returns null if the name is unknown. */
export function GuideStepIcon({ name, className }: { name: GuideIconName; className?: string }) {
  const Icon = stepIcons[name];
  return Icon ? <Icon className={className} /> : null;
}

/** Decorative header illustration for a guide. */
export function GuideHeaderIcon({ name, className }: { name: 'map' | 'trail'; className?: string }) {
  return name === 'trail' ? <TrailHeaderIcon className={className} /> : <MapHeaderIcon className={className} />;
}

/** Check mark shown on a completed step and in the "all done" banner. */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

/** Information icon for the "still being built" banner. */
export function InfoIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}
