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
  /** Show only the digits; the title stays available to assistive tech. */
  compact?: boolean;
  doneLabel?: string;
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
  compact = false,
  doneLabel = 'It\u2019s live!',
}: Props) {
  const remaining = getRemaining(target, now);

  return (
    <div className="text-center">
      <Heading
        {...headingProps}
        className={compact ? 'sr-only' : `font-extrabold tracking-tight ${overlay ? 'text-5xl' : 'text-3xl sm:text-4xl'}`}
      >
        {title}
      </Heading>
      {subtitle && !compact && (
        <p className={`mt-2 text-slate-700 dark:text-slate-300 ${overlay ? 'text-2xl' : 'text-lg'}`}>{subtitle}</p>
      )}

      {remaining.done ? (
        <p
          role="timer"
          className={`${compact ? '' : 'mt-8'} text-5xl font-black text-violet-700 sm:text-6xl dark:text-violet-300`}
        >
          {doneLabel}
        </p>
      ) : (
        <div role="timer" aria-atomic="true" className={compact ? '' : 'mt-8'}>
          <span className="sr-only">{describeRemaining(remaining)} remaining</span>
          <ol
            aria-hidden="true"
            className={`mx-auto grid grid-cols-4 gap-2 sm:gap-4 ${overlay ? 'w-[40rem] max-w-[calc(100vw-3rem)]' : 'max-w-2xl'}`}
          >
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

      <p className={`mt-6 text-slate-700 ${compact ? 'sr-only' : ''} dark:text-slate-300 ${overlay ? 'text-xl' : ''}`}>
        {remaining.done ? 'Launched ' : 'Launches '}
        <time dateTime={target}>{formatTarget(target)}</time>
      </p>
    </div>
  );
}
