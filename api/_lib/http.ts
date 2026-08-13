import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ZodError } from 'zod';

export function json(response: VercelResponse, status: number, body: unknown) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response.status(status).json(body);
}

export async function readJson(request: VercelRequest) {
  if (typeof request.body === 'string') {
    return JSON.parse(request.body);
  }
  if (request.body && typeof request.body === 'object') return request.body;
  let raw = '';
  for await (const chunk of request) {
    raw += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
    if (raw.length > 1_000_000) throw new Error('Request body is too large');
  }
  return raw ? JSON.parse(raw) : {};
}

export function methodNotAllowed(response: VercelResponse, allowed: string[]) {
  response.setHeader('Allow', allowed.join(', '));
  return json(response, 405, { error: 'Method not allowed' });
}

export function handleError(response: VercelResponse, error: unknown) {
  if (error instanceof ZodError) {
    return json(response, 400, { error: 'Invalid request', issues: error.issues });
  }
  const message = error instanceof Error ? error.message : 'Unknown error';
  if (message.includes('not configured')) {
    return json(response, 503, { error: 'Engine backend is not configured' });
  }
  console.error(error);
  return json(response, 500, { error: 'Internal server error' });
}

export function requestOriginAllowed(request: VercelRequest) {
  const origin = request.headers.origin;
  const host = request.headers['x-forwarded-host'] ?? request.headers.host;
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
