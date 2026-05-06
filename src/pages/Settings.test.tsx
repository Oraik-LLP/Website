import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Settings } from './Settings';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('Settings page', () => {
  it('includes typical appearance and site preference controls beyond theme', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(screen.getByText('Interface density')).toBeInTheDocument();
    expect(screen.getByText('Dynamic grid')).toBeInTheDocument();
    expect(screen.getByText('Motion')).toBeInTheDocument();
    expect(screen.getByText('Contact shortcuts')).toBeInTheDocument();
  });
});
