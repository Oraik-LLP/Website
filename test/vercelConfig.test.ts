import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Vercel config', () => {
  it('rewrites direct route requests to the SPA entrypoint', () => {
    const config = JSON.parse(readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8'));

    expect(config.rewrites).toContainEqual({
      source: '/api/engine/:path*',
      destination: '/api/engine',
    });
    expect(config.rewrites).toContainEqual({
      source: '/api/public/:path*',
      destination: '/api/public',
    });
    expect(config.rewrites).toContainEqual({
      source: '/:path((?!api/).*)',
      destination: '/index.html',
    });
  });
});
