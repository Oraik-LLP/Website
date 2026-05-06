import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FixEaseSimulator } from './FixEaseSimulator';

describe('FixEaseSimulator', () => {
  it('walks through the real FixEase-inspired urgent diagnostic flow', () => {
    render(<FixEaseSimulator />);

    expect(screen.getByText('AI Car Diagnostics')).toBeInTheDocument();
    expect(screen.getByText('2024 Honda Civic Type R')).toBeInTheDocument();
    expect(screen.getByText('K20A i-VTEC')).toBeInTheDocument();
    expect(screen.getByText('Health score')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /start demo/i }));
    expect(screen.getByText('Urgent Mode')).toBeInTheDocument();
    expect(screen.getByText('Photo Mode')).toBeInTheDocument();
    expect(screen.getByText(/Gemini Live/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /urgent mode/i }));
    expect(screen.getByText('Engine')).toBeInTheDocument();
    expect(screen.getByText('Brakes')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /run ai scan/i }));
    expect(screen.getByText(/analyzing/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /show report/i }));
    expect(screen.getByText('Diagnostic Report')).toBeInTheDocument();
    expect(screen.getByText('Possible causes')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
  });
});
