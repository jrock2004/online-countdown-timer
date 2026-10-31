import { describe, expect, it } from 'vitest';
import { describeRemaining, formatChatMessage, formatClock, getRemaining } from './countdown';

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

describe('formatClock', () => {
  it('pads the time and hides zero days', () => {
    expect(formatClock(getRemaining(new Date(((3 * 24 + 4) * 3600 + 12 * 60 + 5) * 1000), 0))).toBe('3d 04:12:05');
    expect(formatClock(getRemaining(new Date(65 * 1000), 0))).toBe('00:01:05');
  });
});

describe('formatChatMessage', () => {
  it('says how long is left, then that it is live', () => {
    expect(formatChatMessage('New League', getRemaining(new Date(90061 * 1000), 0))).toBe('Countdown to New League: 1d 01:01:01');
    expect(formatChatMessage('New League', getRemaining(new Date(0), 0))).toBe('Now live: New League');
  });

  it('never starts with the title, so it cannot be read as a chat command', () => {
    expect(formatChatMessage('/ban viewer', getRemaining(new Date(65 * 1000), 0))).toBe('Countdown to /ban viewer: 00:01:05');
    expect(formatChatMessage('$points', getRemaining(new Date(0), 0))).toBe('Now live: $points');
  });
});
