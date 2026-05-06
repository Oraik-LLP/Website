import { describe, expect, it } from 'vitest';
import { getFeaturedProducts, getProductBySlug, products } from './products';

describe('products data', () => {
  it('includes the launch products with FixEase, Agent Zero, and Orkzoid grounded in known facts', () => {
    expect(products.map((product) => product.slug)).toEqual([
      'fixease',
      'agent-zero',
      'mark-it',
      'xpdf',
      'find-ducky',
      'local-lm',
      'orkzoid',
      'bastepin',
    ]);

    expect(getProductBySlug('fixease')?.shortDescription).toContain('AI Car Diagnostics');
    expect(getProductBySlug('fixease')?.logo).toBe('/assets/fixease/wrench-logo.png');
    expect(getProductBySlug('fixease')?.catalogImage).toBe('/assets/fixease/car-default-hero.png');
    expect(getProductBySlug('fixease')?.features).toContain('Urgent symptom diagnosis');
    expect(getProductBySlug('agent-zero')?.shortDescription).toContain('meeting AI assistant');
    expect(getProductBySlug('agent-zero')?.logo).toBe('/assets/products/agentzero-logo.png');
    expect(getProductBySlug('agent-zero')?.catalogImage).toBe('/assets/products/agentzero-catalog.png');
    expect(getProductBySlug('agent-zero')?.links.github.href).toBe('https://github.com/EntroproxTheOne/AgentZero');
    expect(getProductBySlug('local-lm')?.shortDescription).toContain('offline LLM');
    expect(getProductBySlug('local-lm')?.catalogImage).toBe('/assets/products/local-lm-catalog.png');
    expect(getProductBySlug('orkzoid')?.features).toContain('Shadow API attack surface management');
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

  it('uses sibling project assets and descriptions for Mark-it, xPDF, and Find Ducky', () => {
    expect(getProductBySlug('mark-it')?.logo).toBe('/assets/products/mark-it-logo.png');
    expect(getProductBySlug('mark-it')?.catalogImage).toBe('/assets/products/mark-it-catalog.png');
    expect(getProductBySlug('mark-it')?.shortDescription).toContain('EXIF-based text');

    expect(getProductBySlug('xpdf')?.logo).toBe('/assets/products/xpdf-logo.png');
    expect(getProductBySlug('xpdf')?.catalogImage).toBe('/assets/products/xpdf-catalog.png');
    expect(getProductBySlug('xpdf')?.features).toContain('Password lock, unlock, and security checks');

    expect(getProductBySlug('find-ducky')?.logo).toBe('/assets/products/find-ducky-logo.svg');
    expect(getProductBySlug('find-ducky')?.shortDescription).toContain('Bluetooth Low Energy and Wi-Fi');
  });
});
