import { describe, expect, it } from 'vitest';
import { inspectRaster } from './image';

describe('Engine raster inspection', () => {
  it('reads PNG dimensions only when the declared type and signature agree', () => {
    const png = new Uint8Array(24);
    png.set([137, 80, 78, 71, 13, 10, 26, 10]);
    new DataView(png.buffer).setUint32(16, 1200);
    new DataView(png.buffer).setUint32(20, 630);
    expect(inspectRaster(png, 'image/png')).toMatchObject({ extension: 'png', width: 1200, height: 630 });
    expect(inspectRaster(png, 'image/jpeg')).toBeNull();
  });

  it('rejects truncated and unsupported image payloads', () => {
    expect(inspectRaster(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]), 'image/jpeg')).toBeNull();
    expect(inspectRaster(new Uint8Array(64), 'image/heif')).toBeNull();
  });
});
