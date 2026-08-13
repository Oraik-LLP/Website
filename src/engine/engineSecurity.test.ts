import { describe, expect, it } from 'vitest';
import {
  accountSchema,
  postInputSchema,
  productInputSchema,
  safeUrlSchema,
  settingsSchema,
} from '../../api/_lib/validation';
import { getProductBySlug } from '../data/products';

describe('Oraik Engine validation', () => {
  it('rejects scriptable and protocol-relative destinations', () => {
    expect(safeUrlSchema.safeParse('javascript:alert(1)').success).toBe(false);
    expect(safeUrlSchema.safeParse('//attacker.example').success).toBe(false);
    expect(safeUrlSchema.safeParse('data:text/html,hello').success).toBe(false);
    expect(safeUrlSchema.safeParse('https://fixease.oraik.co').success).toBe(true);
    expect(safeUrlSchema.safeParse('/products').success).toBe(true);
  });

  it('treats SQL-looking content as text while enforcing structured fields', () => {
    const fixture = {
      slug: 'safe-note',
      title: "Robert'); DROP TABLE posts;--",
      excerpt: 'A plain text payload',
      category: 'Security',
      readingTime: '4 min',
      publishedAt: null,
      relatedProductSlugs: [],
      sections: [{ heading: 'Input', paragraphs: ["'; DELETE FROM products;--"], bullets: [] }],
      seoTitle: 'Safe note',
      seoDescription: 'Validation does not execute content.',
      coverImage: '',
      contentStatus: 'draft',
    };
    const parsed = postInputSchema.parse(fixture);
    expect(parsed.title).toContain('DROP TABLE');
    expect(parsed.sections[0].paragraphs[0]).toContain('DELETE');
  });

  it('requires a destination for product redirects and prevents self-redirects', () => {
    const fixture = getProductBySlug('get-true-charge')!;
    const base = {
      ...fixture,
      catalogImage: fixture.catalogImage ?? '',
      heroImage: fixture.heroImage ?? '',
      audiences: fixture.audiences ?? [],
      workflow: fixture.workflow ?? [],
      principles: fixture.principles ?? [],
      productSite: '',
      productSiteLabel: 'Open product',
      redirectToProductSite: true,
      openInNewTab: true,
      contentStatus: 'draft',
      sortOrder: 1,
    };
    expect(productInputSchema.safeParse(base).success).toBe(false);
    expect(productInputSchema.safeParse({ ...base, productSite: '/products/get-true-charge' }).success).toBe(false);
    expect(productInputSchema.safeParse({ ...base, productSite: 'https://gettruecharge.com' }).success).toBe(true);
  });

  it('restricts connected-account icons and private settings URL schemes', () => {
    expect(
      accountSchema.safeParse({
        label: 'Unsafe',
        url: 'https://example.com',
        icon: '<svg onload=alert(1)>',
        placement: 'footer',
        active: true,
        sortOrder: 0,
      }).success,
    ).toBe(false);
    expect(
      settingsSchema.safeParse({
        companyDescription: 'Oraik',
        contactEmail: 'contact@oraik.co',
        contactPhoneDisplay: '+91 74003 54911',
        contactPhoneHref: 'https://attacker.example',
        address: 'Mumbai',
        copyright: 'Oraik',
      }).success,
    ).toBe(false);
  });
});

