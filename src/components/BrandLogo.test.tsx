import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../theme/ThemeProvider';
import { BrandLogo } from './BrandLogo';

describe('BrandLogo', () => {
  it('uses mini logo assets that respond to the active theme', () => {
    render(
      <ThemeProvider>
        <BrandLogo />
      </ThemeProvider>,
    );

    expect(screen.getByAltText('Oraik mini logo')).toHaveAttribute('src', '/assets/oraik/oraik-mini-dark.png');
  });
});
