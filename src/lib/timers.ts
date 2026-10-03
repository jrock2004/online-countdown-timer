export interface Timer {
  id: string;
  title: string;
  /** Optional subtitle, e.g. the game or league name. */
  subtitle: string;
  /** Target moment as an ISO 8601 UTC string. */
  target: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimerState {
  timers: Timer[];
  activeId: string | null;
}

export type TimerInput = Pick<Timer, 'title' | 'subtitle' | 'target'>;

export const STORAGE_KEY = 'countdown:timers';
const EMPTY_STATE: TimerState = { timers: [], activeId: null };

function isTimer(value: unknown): value is Timer {
  if (typeof value !== 'object' || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.subtitle === 'string' &&
    typeof t.target === 'string' &&
    !Number.isNaN(Date.parse(t.target))
  );
}

export function loadState(storage: Storage = localStorage): TimerState {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<TimerState>;
    const timers = Array.isArray(parsed.timers) ? parsed.timers.filter(isTimer) : [];
    const activeId = timers.some((t) => t.id === parsed.activeId) ? parsed.activeId! : (timers[0]?.id ?? null);
    return { timers, activeId };
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state: TimerState, storage: Storage = localStorage): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be full or unavailable (private mode); the app keeps working in memory.
  }
}

export function createTimer(input: TimerInput, now = new Date()): Timer {
  const stamp = now.toISOString();
  return { id: crypto.randomUUID(), ...input, createdAt: stamp, updatedAt: stamp };
}

export type TimerErrors = Partial<Record<keyof TimerInput, string>>;

export function validateTimer(input: { title: string; date: string; time: string }): TimerErrors {
  const errors: TimerErrors = {};
  if (!input.title.trim()) errors.title = 'Enter a title for the countdown.';
  else if (input.title.trim().length > 80) errors.title = 'Title must be 80 characters or fewer.';
  if (!input.date || !input.time) errors.target = 'Enter both a launch date and time.';
  else if (Number.isNaN(toTargetDate(input.date, input.time).getTime())) errors.target = 'Enter a valid date and time.';
  return errors;
}

/** Combine `YYYY-MM-DD` and `HH:mm` values (local time) into a Date. */
export function toTargetDate(date: string, time: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm);
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Split an ISO target into local `YYYY-MM-DD` and `HH:mm` values for form inputs. */
export function toInputValues(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}
