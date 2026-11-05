import { describe, expect, it } from 'vitest';
import { STORAGE_KEY, loadState, moveTimer, reorderTimers, saveState, toInputValues, toTargetDate, validateTimer } from './timers';

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

describe('reordering', () => {
  const make = (id: string) => ({ id, title: id, subtitle: '', target: '2030-01-01T00:00:00.000Z', createdAt: '', updatedAt: '' });
  const list = ['a', 'b', 'c'].map(make);
  const order = (timers: { id: string }[]) => timers.map((t) => t.id);

  it('arranges timers by id order and keeps unlisted timers at the end', () => {
    expect(order(reorderTimers(list, ['c', 'a']))).toEqual(['c', 'a', 'b']);
    expect(order(reorderTimers(list, ['b', 'missing', 'a', 'c']))).toEqual(['b', 'a', 'c']);
  });

  it('moves a timer by an offset, clamped to the list bounds', () => {
    expect(order(moveTimer(list, 'a', 1))).toEqual(['b', 'a', 'c']);
    expect(order(moveTimer(list, 'c', -5))).toEqual(['c', 'a', 'b']);
    expect(moveTimer(list, 'a', -1)).toBe(list);
    expect(moveTimer(list, 'missing', 1)).toBe(list);
  });
});
