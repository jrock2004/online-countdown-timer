import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';
import { STORAGE_KEY } from './lib/timers';

async function createCountdown(user: ReturnType<typeof userEvent.setup>, title: string) {
  await user.type(screen.getByLabelText(/^title/i), title);
  await user.type(screen.getByLabelText(/^date/i), '2099-12-31');
  await user.type(screen.getByLabelText(/^time/i), '18:00');
  await user.click(screen.getByRole('button', { name: /create countdown/i }));
}

describe('App', () => {
  it('shows validation errors linked to their fields', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /create countdown/i }));
    const title = screen.getByLabelText(/^title/i);
    expect(title).toHaveAttribute('aria-invalid', 'true');
    expect(title).toHaveAccessibleDescription(/enter a title/i);
    expect(title).toHaveFocus();
  });

  it('creates, edits and deletes a countdown and persists it', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await createCountdown(user, 'New League');
    const heading = screen.getByRole('heading', { level: 2, name: 'New League' });
    expect(heading).toHaveFocus();
    expect(screen.getByRole('timer')).toHaveTextContent(/remaining/);
    expect(screen.getByRole('status')).toHaveTextContent('Countdown "New League" created.');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).timers).toHaveLength(1);

    // Reopening the page restores the last timer.
    unmount();
    render(<App />);
    expect(screen.getByRole('heading', { level: 2, name: 'New League' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /edit countdown new league/i }));
    const title = screen.getByLabelText(/^title/i);
    await user.clear(title);
    await user.type(title, 'Season 2');
    await user.click(screen.getByRole('button', { name: /save changes/i }));
    expect(screen.getByRole('heading', { level: 2, name: 'Season 2' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /delete countdown season 2/i }));
    const dialog = screen.getByRole('dialog', { name: /delete this countdown/i });
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));
    expect(screen.getByRole('heading', { name: /create a countdown/i })).toHaveFocus();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).timers).toHaveLength(0);
  });

  it('switches between multiple countdowns', async () => {
    const user = userEvent.setup();
    render(<App />);
    await createCountdown(user, 'First');
    await user.click(screen.getByRole('button', { name: /new countdown/i }));
    await createCountdown(user, 'Second');

    const nav = screen.getByRole('navigation', { name: /your countdowns/i });
    await user.click(within(nav).getByRole('button', { name: /first/i }));
    expect(screen.getByRole('heading', { level: 2, name: 'First' })).toHaveFocus();
    expect(within(nav).getByRole('button', { name: /first/i })).toHaveAttribute('aria-current', 'true');
  });
});
