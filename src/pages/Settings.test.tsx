import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Settings } from './Settings';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('Settings page', () => {
  it('only exposes the theme controls', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.queryByText('Interface density')).not.toBeInTheDocument();
    expect(screen.queryByText('Dynamic grid')).not.toBeInTheDocument();
    expect(screen.queryByText('Motion')).not.toBeInTheDocument();
    expect(screen.queryByText('Contact shortcuts')).not.toBeInTheDocument();
  });
});
