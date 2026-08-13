import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider, ThemeToggle } from './ThemeProvider';

describe('ThemeProvider', () => {
  it('toggles and persists the preferred theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /switch to light theme/i }));
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
    expect(localStorage.getItem('oraik-theme')).toBe('light');
    expect(document.head.querySelector('meta[data-runtime-theme]')).toHaveAttribute('content', '#e9edf2');

    fireEvent.click(screen.getByRole('button', { name: /switch to dark theme/i }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(localStorage.getItem('oraik-theme')).toBe('dark');
    expect(document.head.querySelector('meta[data-runtime-theme]')).toHaveAttribute('content', '#090a0b');
  });
});
