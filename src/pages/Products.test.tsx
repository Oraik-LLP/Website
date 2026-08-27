import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Products } from './Products';

describe('Products page', () => {
  it('renders every current company product and keeps Mark-it in a separate solo section', () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>,
    );

    const companyCatalog = screen.getByLabelText('Oraik product catalog');
    const soloCatalog = screen.getByLabelText('Independent product catalog');

    expect(companyCatalog).toHaveClass('product-mini-grid');
    expect(companyCatalog).toHaveTextContent('FixEase');
    expect(companyCatalog).toHaveTextContent('GetTrueCharge');
    expect(companyCatalog).toHaveTextContent('Agent Zero');
    expect(companyCatalog).toHaveTextContent('Find Ducky');
    expect(companyCatalog).toHaveTextContent('Phos');
    expect(companyCatalog).not.toHaveTextContent('Mark-it');

    expect(soloCatalog).toHaveTextContent('Mark-it');
    expect(soloCatalog).toHaveTextContent('01');
  });
});
