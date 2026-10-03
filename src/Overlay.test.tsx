import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Overlay } from './Overlay';
import { parseOverlay } from './lib/overlay';

describe('Overlay', () => {
  it('shows only the digits in compact mode but keeps the title for assistive tech', () => {
    render(<Overlay {...parseOverlay('/obs', '?title=Launch&subtitle=Soon&target=2099-01-01T00:00:00Z&compact=1')!} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Launch' })).toHaveClass('sr-only');
    expect(screen.queryByText('Soon')).not.toBeInTheDocument();
    expect(screen.getByRole('timer')).toHaveTextContent(/remaining/);
  });

  it('shows the custom message at zero', () => {
    render(<Overlay {...parseOverlay('/obs', '?title=Launch&target=2000-01-01T00:00:00Z&done=GO%20TIME')!} />);
    expect(screen.getByRole('timer')).toHaveTextContent('GO TIME');
  });

  it('explains a broken link instead of rendering nothing', () => {
    render(<Overlay {...parseOverlay('/obs', '?title=Launch')!} />);
    expect(screen.getByRole('heading', { name: /missing a launch date/i })).toBeInTheDocument();
  });
});
