import { describe, expect, it } from 'vitest';
import { STORAGE_KEY, loadState, saveState, toInputValues, toTargetDate, validateTimer } from './timers';

describe('storage', () => {
  it('round-trips state', () => {
    const state = {
      timers: [
        { id: 'a', title: 'Launch', subtitle: '', target: '2030-01-01T00:00:00.000Z', createdAt: '', updatedAt: '' },
      ],
      activeId: 'a',
    };
    saveState(state);
    expect(loadState()).toEqual(state);
  });

  it('recovers from corrupt data', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadState()).toEqual({ timers: [], activeId: null });
  });

  it('drops invalid timers and repairs the active id', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        timers: [{ id: 'x' }, { id: 'b', title: 'B', subtitle: '', target: '2030-01-01T00:00:00Z' }],
        activeId: 'missing',
      }),
    );
    const state = loadState();
    expect(state.timers.map((t) => t.id)).toEqual(['b']);
    expect(state.activeId).toBe('b');
  });
});

describe('validateTimer', () => {
  it('requires a title and target', () => {
    expect(validateTimer({ title: ' ', date: '', time: '' })).toEqual({
      title: 'Enter a title for the countdown.',
      target: 'Enter both a launch date and time.',
    });
    expect(validateTimer({ title: 'Ok', date: '2030-01-01', time: '10:00' })).toEqual({});
  });
});

it('converts between form values and dates in local time', () => {
  const d = toTargetDate('2030-06-15', '18:30');
  expect(toInputValues(d.toISOString())).toEqual({ date: '2030-06-15', time: '18:30' });
});
