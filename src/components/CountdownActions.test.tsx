import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Timer } from '../lib/timers';
import { CountdownActions } from './CountdownActions';

const timer = { id: '1', title: 'Dawn League', subtitle: '', target: new Date(60_000).toISOString() } as Timer;
const noop = () => {};
const actions = (now: number) => (
  <CountdownActions
    timer={timer}
    now={now}
    obsOpen={false}
    onEdit={noop}
    onToggleObs={noop}
    onDelete={noop}
    onAnnounce={noop}
  />
);

describe('CountdownActions', () => {
  it('keeps the fallback text current and selected as the clock ticks', async () => {
    const user = userEvent.setup();
    const { rerender } = render(actions(0));
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('denied'));
    await user.click(screen.getByRole('button', { name: /copy for chat/i }));

    const fallback = screen.getByLabelText<HTMLInputElement>(/copy this text instead/i);
    expect(fallback).toHaveValue('Countdown to Dawn League: 00:01:00');
    fallback.focus();

    rerender(actions(1000));
    expect(fallback).toHaveValue('Countdown to Dawn League: 00:00:59');
    expect(fallback.selectionStart).toBe(0);
    expect(fallback.selectionEnd).toBe(fallback.value.length);

    rerender(actions(60_000));
    expect(fallback).toHaveValue('Now live: Dawn League');
  });
});
