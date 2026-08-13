import { describe, expect, it } from 'vitest';
import { blogPosts, getBlogPostBySlug, getRelatedPosts } from './blog';

describe('blog data', () => {
  it('provides SEO-ready editorial placeholders with unique slugs', () => {
    expect(blogPosts.length).toBeGreaterThanOrEqual(5);
    expect(new Set(blogPosts.map((post) => post.slug)).size).toBe(blogPosts.length);
    expect(blogPosts.every((post) => post.sections.length > 0)).toBe(true);
  });

  it('connects articles to the relevant product pages', () => {
    expect(getRelatedPosts('fixease').map((post) => post.slug)).toContain('car-diagnostic-report-explained');
    expect(getRelatedPosts('get-true-charge').map((post) => post.slug)).toContain(
      'audit-itemized-bill-before-paying',
    );
    expect(getBlogPostBySlug('private-ai-local-vs-cloud')?.relatedProductSlugs).toContain('local-lm');
  });
});
