import type { Timer } from './timers';

export const OBS_PATH = '/obs';
export const SCALES = [0.75, 1, 1.25, 1.5, 2] as const;

export interface OverlayOptions {
  theme: 'light' | 'dark';
  /** `panel` draws a semi-opaque backdrop; `none` is fully transparent. */
  bg: 'panel' | 'none';
  /** Hide the title, subtitle and launch date; show only the digits. */
  compact: boolean;
  scale: number;
  /** Message shown when the countdown reaches zero. */
  done: string;
}

export interface OverlayParams extends Omit<OverlayOptions, 'theme'> {
  title: string;
  subtitle: string;
  target: string;
  /** null means follow the viewer's system preference. */
  theme: OverlayOptions['theme'] | null;
}

export const DEFAULT_OPTIONS: OverlayOptions = { theme: 'dark', bg: 'panel', compact: false, scale: 1, done: '' };
export const DEFAULT_DONE = 'It’s live!';

/**
 * Parse an OBS browser-source URL: `/obs?title=…&target=…`.
 * The legacy `/?overlay=1&…` form is still accepted so existing OBS sources keep working.
 */
export function parseOverlay(pathname: string, search: string): OverlayParams | null {
  const params = new URLSearchParams(search);
  const isObsPath = pathname.replace(/\/+$/, '') === OBS_PATH;
  if (!isObsPath && params.get('overlay') !== '1') return null;

  const target = params.get('target') ?? '';
  const theme = params.get('theme');
  const scale = Number(params.get('scale'));
  return {
    title: params.get('title') ?? '',
    subtitle: params.get('subtitle') ?? '',
    // An invalid target still renders the overlay so the streamer sees a clear error instead of the app.
    target: Number.isNaN(Date.parse(target)) ? '' : target,
    theme: theme === 'light' || theme === 'dark' ? theme : null,
    bg: params.get('bg') === 'none' ? 'none' : 'panel',
    compact: params.get('compact') === '1',
    scale: Number.isFinite(scale) && scale >= 0.5 && scale <= 3 ? scale : 1,
    done: (params.get('done') ?? '').slice(0, 60),
  };
}

export function buildOverlayUrl(timer: Timer, options: OverlayOptions, origin = window.location.origin): string {
  const params = new URLSearchParams({ title: timer.title, target: timer.target, theme: options.theme });
  if (timer.subtitle) params.set('subtitle', timer.subtitle);
  if (options.bg === 'none') params.set('bg', 'none');
  if (options.compact) params.set('compact', '1');
  if (options.scale !== 1) params.set('scale', String(options.scale));
  if (options.done.trim()) params.set('done', options.done.trim());
  return `${origin}${OBS_PATH}?${params}`;
}

const OPTIONS_KEY = 'countdown:obs';

export function loadOverlayOptions(): OverlayOptions {
  try {
    const saved = JSON.parse(localStorage.getItem(OPTIONS_KEY) ?? '{}') as Partial<OverlayOptions>;
    return {
      theme: saved.theme === 'light' ? 'light' : 'dark',
      bg: saved.bg === 'none' ? 'none' : 'panel',
      compact: saved.compact === true,
      scale: SCALES.includes(saved.scale as (typeof SCALES)[number]) ? saved.scale! : 1,
      done: typeof saved.done === 'string' ? saved.done.slice(0, 60) : '',
    };
  } catch {
    return DEFAULT_OPTIONS;
  }
}

export function saveOverlayOptions(options: OverlayOptions): void {
  try {
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(options));
  } catch {
    // ignore
  }
}
