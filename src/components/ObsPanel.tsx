import { useEffect, useId, useState } from 'react';
import { buildOverlayUrl, loadOverlayOptions, saveOverlayOptions, SCALES, type OverlayOptions } from '../lib/overlay';
import type { Timer } from '../lib/timers';
import { Button } from './Button';

interface Props {
  timer: Timer;
  onAnnounce: (message: string) => void;
}

const controlClass =
  'mt-1 block w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-base text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:[color-scheme:dark]';

function RadioGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="font-medium">{legend}</legend>
      <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
        {options.map((opt) => (
          <label key={opt.value} className="flex min-h-11 items-center gap-2">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="size-4 accent-violet-700 dark:accent-violet-400"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ObsPanel({ timer, onAnnounce }: Props) {
  const [options, setOptions] = useState<OverlayOptions>(loadOverlayOptions);
  const id = useId();
  const url = buildOverlayUrl(timer, options);

  useEffect(() => saveOverlayOptions(options), [options]);

  const set = <K extends keyof OverlayOptions>(key: K, value: OverlayOptions[K]) =>
    setOptions((o) => ({ ...o, [key]: value }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      onAnnounce('OBS link copied to clipboard.');
    } catch {
      onAnnounce('Could not copy automatically. Select the link text and copy it manually.');
    }
  };

  return (
    <section aria-labelledby={`${id}-heading`} className="mt-8 border-t border-slate-200 pt-8 text-left dark:border-slate-700">
      <h3 id={`${id}-heading`} className="text-xl font-bold">
        Show on stream
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Choose how the timer looks, then add the link to OBS or Streamlabs as a browser source.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <RadioGroup
          legend="Theme"
          name={`${id}-theme`}
          value={options.theme}
          options={[
            { value: 'dark', label: 'Dark' },
            { value: 'light', label: 'Light' },
          ]}
          onChange={(v) => set('theme', v)}
        />
        <RadioGroup
          legend="Background"
          name={`${id}-bg`}
          value={options.bg}
          options={[
            { value: 'panel', label: 'Panel (easier to read)' },
            { value: 'none', label: 'Transparent' },
          ]}
          onChange={(v) => set('bg', v)}
        />
        <div>
          <label htmlFor={`${id}-scale`} className="font-medium">
            Size
          </label>
          <select
            id={`${id}-scale`}
            value={options.scale}
            onChange={(e) => set('scale', Number(e.target.value))}
            className={controlClass}
          >
            {SCALES.map((s) => (
              <option key={s} value={s}>
                {s * 100}%
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-done`} className="font-medium">
            Message at zero <span className="font-normal text-slate-600 dark:text-slate-300">(optional)</span>
          </label>
          <input
            id={`${id}-done`}
            type="text"
            maxLength={60}
            autoComplete="off"
            placeholder="It’s live!"
            value={options.done}
            onChange={(e) => set('done', e.target.value)}
            className={controlClass}
          />
        </div>
        <label className="flex min-h-11 items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={options.compact}
            onChange={(e) => set('compact', e.target.checked)}
            className="size-4 accent-violet-700 dark:accent-violet-400"
          />
          Digits only (hide the title, subtitle and launch date)
        </label>
      </div>

      <div className="mt-5">
        <label htmlFor={`${id}-url`} className="font-medium">
          OBS browser source URL
        </label>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <input
            id={`${id}-url`}
            type="text"
            readOnly
            value={url}
            onFocus={(e) => e.target.select()}
            className={`${controlClass} mt-0 font-mono text-sm`}
          />
          <Button variant="primary" onClick={copy} className="shrink-0">
            Copy link
          </Button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Preview <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>

      <h4 className="mt-6 font-semibold">Adding it to OBS</h4>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
        <li>In Sources, click + and choose Browser.</li>
        <li>Paste the link into URL and set Width to 1280 and Height to 720.</li>
        <li>Resize or crop the source in your scene as needed.</li>
        <li>
          The link holds the countdown itself. <strong>If you edit this countdown, copy the link again</strong> and update
          the source.
        </li>
      </ol>
    </section>
  );
}
