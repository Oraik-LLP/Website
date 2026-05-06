import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from './About';

describe('About page', () => {
  it('includes the same company contact details as the footer', () => {
    render(<About />);

    expect(screen.getByText('Oraik Systems LLP')).toBeInTheDocument();
    expect(screen.getByText(/1405, Siddhesh Apartment/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'contact@oraik.co' })).toHaveAttribute('href', 'mailto:contact@oraik.co');
    expect(screen.getByRole('link', { name: '7400354911' })).toHaveAttribute('href', 'tel:+917400354911');
  });

  it('includes leadership and philosophy sections', () => {
    render(<About />);

    expect(screen.getByText('Management // Leadership')).toBeInTheDocument();
    expect(screen.getByText('Manav Vivek Modi')).toBeInTheDocument();
    expect(screen.getByText('Masoom Hathi')).toBeInTheDocument();
    expect(screen.getAllByText('Co-Founder & Designated Partner')).toHaveLength(2);
    expect(screen.getByText('Privacy by Design')).toBeInTheDocument();
    expect(screen.getByText('Rapid Deployment')).toBeInTheDocument();
  });
});
