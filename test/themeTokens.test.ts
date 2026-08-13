import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('minimal cyberdeck theme tokens', () => {
  it('keeps matching dark and light visual systems', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8');

    expect(css).toContain('--bg: #090a0b');
    expect(css).toContain("--accent: #ff3b35");
    expect(css).toContain(":root[data-theme='light']");
    expect(css).toContain('--bg: #e9edf2');
    expect(css).toContain('--accent: #d91f2d');
  });
});
