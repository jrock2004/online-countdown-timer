export interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  done: boolean;
}

export function getRemaining(target: Date | string, now: number = Date.now()): Remaining {
  const totalMs = Math.max(0, new Date(target).getTime() - now);
  const totalSeconds = Math.floor(totalMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMs,
    done: totalMs === 0,
  };
}

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;

/** Human-readable summary for screen readers, e.g. "3 days, 4 hours and 12 minutes". */
export function describeRemaining(r: Remaining): string {
  if (r.done) return 'Launched';
  const parts: string[] = [];
  if (r.days) parts.push(plural(r.days, 'day'));
  if (r.hours) parts.push(plural(r.hours, 'hour'));
  if (r.minutes) parts.push(plural(r.minutes, 'minute'));
  if (!r.days && !r.hours) parts.push(plural(r.seconds, 'second'));
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`;
}

export function formatTarget(iso: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short' }).format(new Date(iso));
}
