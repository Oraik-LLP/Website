import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from './About';

describe('About page', () => {
  it('does not duplicate the company contact block from the shared footer', () => {
    render(<About />);

    expect(screen.queryByText('Oraik Systems LLP')).not.toBeInTheDocument();
    expect(screen.queryByText(/1405, Siddhesh Apartment/)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'contact@oraik.co' })).not.toBeInTheDocument();
  });

  it('includes leadership and philosophy sections', () => {
    render(<About />);

    expect(screen.getByText('Management // Leadership')).toBeInTheDocument();
    expect(screen.getByText('Manav Vivek Modi')).toBeInTheDocument();
    expect(screen.getByText('Masoom Monil Hathi')).toBeInTheDocument();
    expect(screen.getAllByText('Co-Founder & Designated Partner')).toHaveLength(2);
    expect(screen.getByText('Privacy by Design')).toBeInTheDocument();
    expect(screen.getByText('Rapid Deployment')).toBeInTheDocument();
  });
});
