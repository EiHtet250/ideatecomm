import type { StaffStrings } from './staffStrings';
import { formatExact, formatRelative } from './time';

/** Relative time with the exact time also shown as text (and in the tooltip). */
export function RequestTime({ iso, now, strings }: { iso: string; now: number; strings: StaffStrings }) {
  const exact = formatExact(iso, strings.locale);
  return (
    <time dateTime={iso} title={exact} className="staff-time">
      {formatRelative(iso, now, strings.locale, strings.time.justNow)}
      <span className="staff-time__exact"> · {exact}</span>
    </time>
  );
}
