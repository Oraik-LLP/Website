import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('site metadata', () => {
  it('declares the Oraik favicon and social preview metadata', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

    expect(html).toContain('rel="icon"');
    expect(html).toContain('/favicon-dark-transparent-32x32.png');
    expect(html).toContain('property="og:image"');
    expect(html).toContain('https://oraik.co/og-minimal-dark-v2.png');
    expect(html).toContain('prefers-color-scheme: dark');
    expect(html).toContain('prefers-color-scheme: light');
    expect(html).toContain('application/ld+json');
  });
});
