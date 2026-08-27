type RasterInfo = {
  mime: 'image/png' | 'image/jpeg' | 'image/webp';
  extension: 'png' | 'jpg' | 'webp';
  width: number;
  height: number;
};

function ascii(buffer: Uint8Array, offset: number, length: number) {
  return String.fromCharCode(...buffer.subarray(offset, offset + length));
}

function uint16be(buffer: Uint8Array, offset: number) {
  return (buffer[offset] << 8) | buffer[offset + 1];
}

function uint24le(buffer: Uint8Array, offset: number) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function jpegDimensions(buffer: Uint8Array) {
  const startOfFrame = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset];
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      offset += 1;
      continue;
    }
    if (offset + 2 >= buffer.length) return null;
    const segmentLength = uint16be(buffer, offset + 1);
    if (segmentLength < 2 || offset + segmentLength >= buffer.length) return null;
    if (startOfFrame.has(marker)) {
      return { height: uint16be(buffer, offset + 4), width: uint16be(buffer, offset + 6) };
    }
    offset += segmentLength + 1;
  }
  return null;
}

function webpDimensions(buffer: Uint8Array) {
  const chunk = ascii(buffer, 12, 4);
  if (chunk === 'VP8X' && buffer.length >= 30) {
    return { width: uint24le(buffer, 24) + 1, height: uint24le(buffer, 27) + 1 };
  }
  if (chunk === 'VP8L' && buffer.length >= 25 && buffer[20] === 0x2f) {
    return {
      width: 1 + (((buffer[22] & 0x3f) << 8) | buffer[21]),
      height: 1 + (((buffer[24] & 0x0f) << 10) | (buffer[23] << 2) | ((buffer[22] & 0xc0) >> 6)),
    };
  }
  if (
    chunk === 'VP8 ' &&
    buffer.length >= 30 &&
    buffer[23] === 0x9d &&
    buffer[24] === 0x01 &&
    buffer[25] === 0x2a
  ) {
    return {
      width: (buffer[26] | (buffer[27] << 8)) & 0x3fff,
      height: (buffer[28] | (buffer[29] << 8)) & 0x3fff,
    };
  }
  return null;
}

export function inspectRaster(buffer: Uint8Array, declared: string): RasterInfo | null {
  if (
    declared === 'image/png' &&
    buffer.length >= 24 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => buffer[index] === byte)
  ) {
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    return { mime: declared, extension: 'png', width: view.getUint32(16), height: view.getUint32(20) };
  }
  if (
    declared === 'image/jpeg' &&
    buffer.length >= 12 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[buffer.length - 2] === 0xff &&
    buffer[buffer.length - 1] === 0xd9
  ) {
    const dimensions = jpegDimensions(buffer);
    return dimensions ? { mime: declared, extension: 'jpg', ...dimensions } : null;
  }
  if (
    declared === 'image/webp' &&
    buffer.length >= 30 &&
    ascii(buffer, 0, 4) === 'RIFF' &&
    ascii(buffer, 8, 4) === 'WEBP'
  ) {
    const dimensions = webpDimensions(buffer);
    return dimensions ? { mime: declared, extension: 'webp', ...dimensions } : null;
  }
  return null;
}
