import { describe, expect, it } from 'vitest';
import { describeRemaining, getRemaining } from './countdown';

describe('getRemaining', () => {
  const now = Date.UTC(2026, 0, 1, 0, 0, 0);

  it('splits the difference into units', () => {
    const target = new Date(now + ((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000);
    expect(getRemaining(target, now)).toMatchObject({ days: 2, hours: 3, minutes: 4, seconds: 5, done: false });
  });

  it('clamps past targets to zero', () => {
    expect(getRemaining(new Date(now - 1000), now)).toMatchObject({ days: 0, seconds: 0, done: true });
  });
});

describe('describeRemaining', () => {
  const now = 0;
  it('reads naturally', () => {
    expect(describeRemaining(getRemaining(new Date((86400 + 3600 + 60) * 1000), now))).toBe('1 day, 1 hour and 1 minute');
    expect(describeRemaining(getRemaining(new Date(125 * 1000), now))).toBe('2 minutes and 5 seconds');
    expect(describeRemaining(getRemaining(new Date(0), now))).toBe('Launched');
  });
});
