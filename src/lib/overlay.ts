import type { Timer } from './timers';

export interface OverlayParams {
  title: string;
  subtitle: string;
  target: string;
  theme: 'light' | 'dark' | null;
}

/** Parse `?overlay=1&title=…&target=…` used as an OBS / streaming browser source. */
export function parseOverlay(search: string): OverlayParams | null {
  const params = new URLSearchParams(search);
  if (params.get('overlay') !== '1') return null;
  const target = params.get('target') ?? '';
  if (Number.isNaN(Date.parse(target))) return null;
  const theme = params.get('theme');
  return {
    title: params.get('title') ?? '',
    subtitle: params.get('subtitle') ?? '',
    target,
    theme: theme === 'light' || theme === 'dark' ? theme : null,
  };
}

export function buildOverlayUrl(timer: Timer, theme: 'light' | 'dark', base = window.location.origin + window.location.pathname) {
  const params = new URLSearchParams({ overlay: '1', title: timer.title, target: timer.target, theme });
  if (timer.subtitle) params.set('subtitle', timer.subtitle);
  return `${base}?${params}`;
}
