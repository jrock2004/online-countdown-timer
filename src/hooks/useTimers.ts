import { useCallback, useEffect, useState } from 'react';
import { createTimer, loadState, moveTimer, reorderTimers, saveState, type Timer, type TimerInput, type TimerState } from '../lib/timers';

export function useTimers() {
  const [state, setState] = useState<TimerState>(loadState);

  useEffect(() => saveState(state), [state]);

  const add = useCallback((input: TimerInput): Timer => {
    const timer = createTimer(input);
    setState((s) => ({ timers: [...s.timers, timer], activeId: timer.id }));
    return timer;
  }, []);

  const update = useCallback((id: string, input: TimerInput) => {
    setState((s) => ({
      ...s,
      timers: s.timers.map((t) => (t.id === id ? { ...t, ...input, updatedAt: new Date().toISOString() } : t)),
    }));
  }, []);

  const remove = useCallback((id: string) => {
    setState((s) => {
      const timers = s.timers.filter((t) => t.id !== id);
      const activeId = s.activeId === id ? (timers[0]?.id ?? null) : s.activeId;
      return { timers, activeId };
    });
  }, []);

  const select = useCallback((id: string) => setState((s) => ({ ...s, activeId: id })), []);

  const reorder = useCallback((ids: string[]) => setState((s) => ({ ...s, timers: reorderTimers(s.timers, ids) })), []);

  const move = useCallback((id: string, offset: number) => setState((s) => ({ ...s, timers: moveTimer(s.timers, id, offset) })), []);

  const active = state.timers.find((t) => t.id === state.activeId) ?? null;

  return { timers: state.timers, active, add, update, remove, select, reorder, move };
}
