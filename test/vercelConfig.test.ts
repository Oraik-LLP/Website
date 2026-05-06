import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Vercel config', () => {
  it('rewrites direct route requests to the SPA entrypoint', () => {
    const config = JSON.parse(readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8'));

    expect(config.rewrites).toContainEqual({
      source: '/(.*)',
      destination: '/index.html',
    });
  });
});
