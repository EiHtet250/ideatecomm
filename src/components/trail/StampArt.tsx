import type { StampArt as StampArtName, TrailStamp } from '../../data/trail/discoveryTrail';

/** Toy drawings, each inside a 100 x 100 box. Colours come from trail.css. */
function Toy({ art }: { art: StampArtName }) {
  switch (art) {
    case 'rocket':
      return (
        <g>
          <path className="stamp-art__fill" d="M50 16 C62 28 66 44 64 62 H36 C34 44 38 28 50 16 Z" />
          <path className="stamp-art__accent" d="M36 52 L24 68 L36 66 Z M64 52 L76 68 L64 66 Z" />
          <circle className="stamp-art__light" cx="50" cy="40" r="7" />
          <path className="stamp-art__accent" d="M42 62 H58 L54 78 L50 70 L46 78 Z" />
        </g>
      );
    case 'robot':
      return (
        <g>
          <path className="stamp-art__line" d="M50 14 V24" />
          <circle className="stamp-art__accent" cx="50" cy="13" r="4" />
          <rect className="stamp-art__fill" x="32" y="24" width="36" height="26" rx="5" />
          <circle className="stamp-art__light" cx="42" cy="36" r="4.5" />
          <circle className="stamp-art__light" cx="58" cy="36" r="4.5" />
          <rect className="stamp-art__fill" x="36" y="54" width="28" height="24" rx="4" />
          <rect className="stamp-art__accent" x="24" y="56" width="8" height="18" rx="4" />
          <rect className="stamp-art__accent" x="68" y="56" width="8" height="18" rx="4" />
          <rect className="stamp-art__light" x="43" y="60" width="14" height="6" rx="2" />
        </g>
      );
    case 'spinning-top':
      return (
        <g>
          <rect className="stamp-art__accent" x="46" y="14" width="8" height="16" rx="3" />
          <path className="stamp-art__fill" d="M22 40 C22 32 78 32 78 40 C78 56 60 66 50 82 C40 66 22 56 22 40 Z" />
          <path className="stamp-art__light" d="M24 42 C36 48 64 48 76 42 C74 47 71 51 67 55 C56 59 44 59 33 55 C29 51 26 47 24 42 Z" />
        </g>
      );
    case 'teddy':
      return (
        <g>
          <circle className="stamp-art__accent" cx="33" cy="28" r="9" />
          <circle className="stamp-art__accent" cx="67" cy="28" r="9" />
          <circle className="stamp-art__fill" cx="50" cy="42" r="20" />
          <ellipse className="stamp-art__fill" cx="50" cy="70" rx="17" ry="14" />
          <ellipse className="stamp-art__light" cx="50" cy="48" rx="8" ry="6" />
          <circle className="stamp-art__light" cx="43" cy="38" r="2.5" />
          <circle className="stamp-art__light" cx="57" cy="38" r="2.5" />
        </g>
      );
    case 'rocking-horse':
      return (
        <g>
          <path className="stamp-art__fill" d="M30 40 C30 30 40 26 46 32 H62 C70 32 74 38 72 46 L74 62 H66 L62 50 H44 L40 62 H32 L34 46 C31 45 30 43 30 40 Z" />
          <path className="stamp-art__fill" d="M34 34 L26 22 L38 26 Z" />
          <path className="stamp-art__line" d="M20 68 C34 82 66 82 80 68" />
          <circle className="stamp-art__light" cx="36" cy="36" r="2.2" />
        </g>
      );
  }
}

interface StampBadgeProps {
  stamp: TrailStamp;
  /** False draws the silhouette for a stamp that has not been collected. */
  collected: boolean;
  className?: string;
}

/** A round postage-style stamp. Uncollected stamps show as a grey silhouette. */
export function StampBadge({ stamp, collected, className = '' }: StampBadgeProps) {
  return (
    <svg
      className={`stamp-art ${collected ? 'stamp-art--collected' : 'stamp-art--locked'} ${className}`}
      viewBox="0 0 100 100"
      role="img"
      aria-label={collected ? stamp.name : 'Stamp not collected yet'}
    >
      <circle className="stamp-art__edge" cx="50" cy="50" r="47" />
      <circle className="stamp-art__face" cx="50" cy="50" r="40" />
      <Toy art={stamp.art} />
    </svg>
  );
}
