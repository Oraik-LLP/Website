import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { getProductBySlug } from '../data/products';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('uses the square FixEase icon instead of the wide hero asset', () => {
    const product = getProductBySlug('fixease');
    expect(product).toBeDefined();

    render(
      <MemoryRouter>
        <ProductCard product={product!} index={0} />
      </MemoryRouter>,
    );

    expect(screen.getByAltText('FixEase logo')).toHaveAttribute('src', '/assets/fixease/wrench-logo.png');
  });

  it('uses the square product logo outside the Overview slideshow', () => {
    const product = getProductBySlug('mark-it');
    expect(product).toBeDefined();

    render(
      <MemoryRouter>
        <ProductCard product={product!} index={1} />
      </MemoryRouter>,
    );

    expect(screen.getByAltText('Mark-it logo')).toHaveAttribute('src', '/assets/products/mark-it-logo.png');
  });
});
