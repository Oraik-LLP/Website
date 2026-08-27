import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProductSlideshow } from './ProductSlideshow';

describe('ProductSlideshow', () => {
  it('uses the FixEase car hero image in the Overview slideshow', () => {
    render(
      <MemoryRouter>
        <ProductSlideshow />
      </MemoryRouter>,
    );

    const artwork = screen.getByAltText('FixEase header artwork');
    expect(artwork).toHaveAttribute('src', '/assets/fixease/car-default-hero.png');
    expect(artwork).toHaveAttribute('data-asset-role', 'header_class');
    expect(artwork).toHaveClass('header-class-icon');
  });
});
