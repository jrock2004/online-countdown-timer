import { describeRemaining, formatTarget, getRemaining } from '../lib/countdown';

interface Props {
  title: string;
  subtitle?: string;
  target: string;
  now: number;
  /** Compact chrome-free rendering for stream overlays. */
  overlay?: boolean;
  headingProps?: { id?: string; tabIndex?: number };
  headingLevel?: 'h1' | 'h2';
}

const UNITS = ['days', 'hours', 'minutes', 'seconds'] as const;

export function CountdownDisplay({
  title,
  subtitle,
  target,
  now,
  overlay = false,
  headingProps,
  headingLevel: Heading = 'h2',
}: Props) {
  const remaining = getRemaining(target, now);

  return (
    <div className="text-center">
      <Heading {...headingProps} className={`font-extrabold tracking-tight ${overlay ? 'text-5xl' : 'text-3xl sm:text-4xl'}`}>
        {title}
      </Heading>
      {subtitle && (
        <p className={`mt-2 text-slate-700 dark:text-slate-300 ${overlay ? 'text-2xl' : 'text-lg'}`}>{subtitle}</p>
      )}

      {remaining.done ? (
        <p role="timer" className="mt-8 text-5xl font-black text-violet-700 sm:text-6xl dark:text-violet-300">
          It&rsquo;s live!
        </p>
      ) : (
        <div role="timer" aria-atomic="true" className="mt-8">
          <span className="sr-only">{describeRemaining(remaining)} remaining</span>
          <ol aria-hidden="true" className="mx-auto grid max-w-2xl grid-cols-4 gap-2 sm:gap-4">
            {UNITS.map((unit) => (
              <li
                key={unit}
                className="rounded-xl border border-slate-200 bg-white px-1 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="block text-4xl font-black tabular-nums sm:text-6xl">
                  {unit === 'days' ? remaining[unit] : String(remaining[unit]).padStart(2, '0')}
                </span>
                <span className="mt-1 block text-xs font-semibold tracking-widest text-slate-600 uppercase sm:text-sm dark:text-slate-300">
                  {unit}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className={`mt-6 text-slate-700 dark:text-slate-300 ${overlay ? 'text-xl' : ''}`}>
        {remaining.done ? 'Launched ' : 'Launches '}
        <time dateTime={target}>{formatTarget(target)}</time>
      </p>
    </div>
  );
}
