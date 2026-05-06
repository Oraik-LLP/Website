import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Products } from './Products';

describe('Products page', () => {
  it('renders products as a mini-square catalog', () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('Product catalog')).toHaveClass('product-mini-grid');
    expect(screen.getByRole('link', { name: /FixEase/ })).toBeInTheDocument();
  });
});
