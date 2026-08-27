import { describe, expect, it } from 'vitest';
import { catchAllPath } from './path';

describe('Vercel catch-all path parsing', () => {
  it('uses the original request path in production', () => {
    expect(catchAllPath('/api/engine/auth/start', {}, 'engine')).toEqual(['auth', 'start']);
  });

  it('supports Vercel catch-all query keys as a fallback', () => {
    expect(catchAllPath('/api/engine/[...path]?...path=auth/start', { '...path': 'auth/start' }, 'engine')).toEqual([
      'auth',
      'start',
    ]);
  });
});
