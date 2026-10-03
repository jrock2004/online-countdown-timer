import type { Timer } from '../lib/timers';
import { formatTarget } from '../lib/countdown';

interface Props {
  timers: Timer[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function TimerList({ timers, activeId, onSelect }: Props) {
  if (timers.length === 0) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">No countdowns yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {timers.map((t) => {
        const current = t.id === activeId;
        return (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onSelect(t.id)}
              aria-current={current ? 'true' : undefined}
              className={`block w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                current
                  ? 'border-violet-700 bg-violet-50 dark:border-violet-400 dark:bg-violet-950'
                  : 'border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800'
              }`}
            >
              <span className="block font-semibold">{t.title}</span>
              <span className="block text-sm text-slate-600 dark:text-slate-300">{formatTarget(t.target)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
