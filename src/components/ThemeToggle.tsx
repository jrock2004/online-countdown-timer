import type { ReactNode } from 'react';
import type { ThemePreference } from '../lib/theme';

const OPTIONS: { value: ThemePreference; label: string; icon: ReactNode }[] = [
  {
    value: 'system',
    label: 'System',
    icon: <path d="M3 5h18v11H3zM8 20h8M12 16v4" />,
  },
  {
    value: 'light',
    label: 'Light',
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  },
];

interface Props {
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
}

export function ThemeToggle({ value, onChange }: Props) {
  return (
    <fieldset className="flex items-center gap-2">
      <legend className="sr-only">Color theme</legend>
      <span aria-hidden="true" className="hidden text-sm text-slate-600 sm:inline dark:text-slate-300">
        Theme
      </span>
      <div className="flex rounded-lg border border-slate-300 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 has-checked:bg-violet-700 has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-violet-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:has-checked:bg-violet-400 dark:has-checked:text-slate-950 dark:has-focus-visible:outline-violet-400"
          >
            <input
              type="radio"
              name="theme"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {opt.icon}
            </svg>
            <span className="sr-only sm:not-sr-only">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
