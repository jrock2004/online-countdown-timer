import { useId, useRef, useState, type FormEvent } from 'react';
import { toInputValues, toTargetDate, validateTimer, type Timer, type TimerErrors, type TimerInput } from '../lib/timers';
import { Button } from './Button';

interface Props {
  timer?: Timer;
  onSubmit: (input: TimerInput) => void;
  onCancel?: () => void;
}

const inputClass =
  'mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-base text-slate-900 dark:bg-slate-900 dark:text-slate-100 ' +
  'border-slate-400 aria-invalid:border-red-700 aria-invalid:border-2 dark:border-slate-500 dark:aria-invalid:border-red-400 dark:[color-scheme:dark]';

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function TimerForm({ timer, onSubmit, onCancel }: Props) {
  const initial = timer ? toInputValues(timer.target) : { date: '', time: '' };
  const [title, setTitle] = useState(timer?.title ?? '');
  const [subtitle, setSubtitle] = useState(timer?.subtitle ?? '');
  const [date, setDate] = useState(initial.date);
  const [time, setTime] = useState(initial.time);
  const [errors, setErrors] = useState<TimerErrors>({});
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const editing = Boolean(timer);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = validateTimer({ title, date, time });
    setErrors(next);
    if (next.title) return titleRef.current?.focus();
    if (next.target) return dateRef.current?.focus();
    onSubmit({ title: title.trim(), subtitle: subtitle.trim(), target: toTargetDate(date, time).toISOString() });
  };

  const field = (name: string) => `${id}-${name}`;
  const targetDescribedBy = [field('tz'), errors.target && field('target-error')].filter(Boolean).join(' ');

  return (
    <form noValidate onSubmit={handleSubmit} aria-labelledby="view-heading" className="space-y-5">
      <h2 id="view-heading" tabIndex={-1} className="text-2xl font-bold">
        {editing ? 'Edit countdown' : 'Create a countdown'}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">required</span> are required.
      </p>

      <div>
        <label htmlFor={field('title')} className="font-medium">
          Title <span aria-hidden="true">*</span>
        </label>
        <input
          ref={titleRef}
          id={field('title')}
          type="text"
          required
          maxLength={80}
          autoComplete="off"
          placeholder="e.g. Path of Exile 2: New League"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? field('title-error') : undefined}
          className={inputClass}
        />
        {errors.title && (
          <p id={field('title-error')} className="mt-1 text-sm font-medium text-red-700 dark:text-red-400">
            <span aria-hidden="true">⚠ </span>
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={field('subtitle')} className="font-medium">
          Subtitle <span className="font-normal text-slate-600 dark:text-slate-300">(optional)</span>
        </label>
        <input
          id={field('subtitle')}
          type="text"
          maxLength={120}
          autoComplete="off"
          placeholder="e.g. Launches on all platforms"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <fieldset aria-describedby={targetDescribedBy}>
        <legend className="font-medium">
          Launch date and time <span aria-hidden="true">*</span>
        </legend>
        <p id={field('tz')} className="text-sm text-slate-600 dark:text-slate-300">
          Uses your local time zone ({timeZone}).
        </p>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={field('date')} className="text-sm font-medium">
              Date
            </label>
            <input
              ref={dateRef}
              id={field('date')}
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-invalid={errors.target && !date ? true : undefined}
              aria-describedby={errors.target ? field('target-error') : undefined}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={field('time')} className="text-sm font-medium">
              Time
            </label>
            <input
              id={field('time')}
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-invalid={errors.target && !time ? true : undefined}
              aria-describedby={errors.target ? field('target-error') : undefined}
              className={inputClass}
            />
          </div>
        </div>
        {errors.target && (
          <p id={field('target-error')} className="mt-1 text-sm font-medium text-red-700 dark:text-red-400">
            <span aria-hidden="true">⚠ </span>
            {errors.target}
          </p>
        )}
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary">
          {editing ? 'Save changes' : 'Create countdown'}
        </Button>
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
