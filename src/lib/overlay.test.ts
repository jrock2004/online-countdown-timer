import { describe, expect, it } from 'vitest';
import { buildOverlayUrl, DEFAULT_OPTIONS, parseOverlay } from './overlay';
import type { Timer } from './timers';

const timer: Timer = {
  id: '1',
  title: 'Dawn League',
  subtitle: 'Servers open',
  target: '2030-01-01T20:00:00.000Z',
  createdAt: '',
  updatedAt: '',
};

describe('overlay URLs', () => {
  it('round-trips through /obs with every option', () => {
    const url = new URL(
      buildOverlayUrl(timer, { theme: 'light', bg: 'none', compact: true, scale: 1.5, done: 'GO!' }, 'https://x.test'),
    );
    expect(url.pathname).toBe('/obs');
    expect(parseOverlay(url.pathname, url.search)).toEqual({
      title: 'Dawn League',
      subtitle: 'Servers open',
      target: timer.target,
      theme: 'light',
      bg: 'none',
      compact: true,
      scale: 1.5,
      done: 'GO!',
    });
  });

  it('omits default options to keep links short', () => {
    const url = new URL(buildOverlayUrl(timer, DEFAULT_OPTIONS, 'https://x.test'));
    expect([...url.searchParams.keys()].sort()).toEqual(['subtitle', 'target', 'theme', 'title']);
  });

  it('still accepts legacy ?overlay=1 links', () => {
    expect(parseOverlay('/', `?overlay=1&title=A&target=${timer.target}`)).toMatchObject({ title: 'A', bg: 'panel' });
  });

  it('ignores normal app URLs and clamps bad values', () => {
    expect(parseOverlay('/', '?title=A')).toBeNull();
    expect(parseOverlay('/obs/', '?target=nope&scale=99')).toMatchObject({ target: '', scale: 1 });
  });
});
