import { describe, expect, it } from 'vitest';
import { getFeaturedProducts, getProductBySlug, products } from './products';

describe('products data', () => {
  it('includes the current company products and keeps solo work explicitly separated', () => {
    expect(products.map((product) => product.slug)).toEqual([
      'fixease',
      'get-true-charge',
      'agent-zero',
      'mark-it',
      'find-ducky',
      'local-lm',
    ]);

    expect(getProductBySlug('fixease')?.shortDescription).toContain('AI Car Diagnostics');
    expect(getProductBySlug('fixease')?.logo).toBe('/assets/fixease/wrench-logo.png');
    expect(getProductBySlug('fixease')?.catalogImage).toBe('/assets/fixease/car-default-hero.png');
    expect(getProductBySlug('fixease')?.features).toContain('Urgent symptom diagnosis');
    expect(getProductBySlug('fixease')?.productSite).toBe('https://fixease.oraik.co');
    expect(getProductBySlug('fixease')?.redirectToProductSite).toBe(true);
    expect(getProductBySlug('agent-zero')?.shortDescription).toContain('meeting AI assistant');
    expect(getProductBySlug('agent-zero')?.logo).toBe('/assets/products/agentzero-logo.png');
    expect(getProductBySlug('agent-zero')?.catalogImage).toBe('/assets/products/agentzero-catalog.png');
    expect(getProductBySlug('agent-zero')?.links.github.href).toBe('https://github.com/EntroproxTheOne/AgentZero');
    expect(getProductBySlug('local-lm')?.name).toBe('Phos');
    expect(getProductBySlug('local-lm')?.productSite).toBe('https://phos.oraik.co');
    expect(getProductBySlug('local-lm')?.catalogImage).toBe('/assets/products/local-lm-catalog.png');
    expect(getProductBySlug('get-true-charge')?.productSite).toBe('https://gettruecharge.com');
    expect(getProductBySlug('mark-it')?.ownership).toBe('solo');
    expect(getProductBySlug('xpdf')).toBeUndefined();
    expect(getProductBySlug('orkzoid')).toBeUndefined();
    expect(getProductBySlug('bastepin')).toBeUndefined();
  });

  it('marks store badges as coming soon where launch links are placeholders', () => {
    const fixease = getProductBySlug('fixease');

    expect(fixease?.links.playStore.status).toBe('coming-soon');
    expect(fixease?.links.appStore.status).toBe('coming-soon');
    expect(fixease?.links.fdroid.status).toBe('coming-soon');
  });

  it('exposes featured products for the home slideshow', () => {
    expect(getFeaturedProducts().map((product) => product.slug)).toContain('fixease');
    expect(getFeaturedProducts().length).toBeGreaterThanOrEqual(3);
  });

  it('uses sibling project assets and descriptions for Mark-it and Find Ducky', () => {
    expect(getProductBySlug('mark-it')?.logo).toBe('/assets/products/mark-it-logo.png');
    expect(getProductBySlug('mark-it')?.catalogImage).toBe('/assets/products/mark-it-catalog.png');
    expect(getProductBySlug('mark-it')?.shortDescription).toContain('EXIF-based text');

    expect(getProductBySlug('find-ducky')?.logo).toBe('/assets/products/find-ducky-logo.svg');
    expect(getProductBySlug('find-ducky')?.shortDescription).toContain('Bluetooth Low Energy and Wi-Fi');
  });
});
