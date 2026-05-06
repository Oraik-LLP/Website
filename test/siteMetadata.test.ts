import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('site metadata', () => {
  it('declares the Oraik favicon', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

    expect(html).toContain('rel="icon"');
    expect(html).toContain('/favicon-dark-transparent-32x32.png');
  });
});
