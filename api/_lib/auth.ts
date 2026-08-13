import type { VercelRequest, VercelResponse } from '@vercel/node';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import twilio from 'twilio';
import { getDb } from './db.js';
import { auditEvents, engineSessions, loginChallenges, rateLimits } from './schema.js';
import { json, requestOriginAllowed } from './http.js';

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = '__Host-oraik_engine';
const CHALLENGE_COOKIE = '__Host-oraik_challenge';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const IDLE_TTL_MS = 30 * 60 * 1000;

function hash(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(Uint8Array.from(a), Uint8Array.from(b));
}

function cookies(request: VercelRequest) {
  return Object.fromEntries(
    String(request.headers.cookie ?? '')
      .split(';')
      .map((entry) => entry.trim().split('='))
      .filter(([key, value]) => key && value)
      .map(([key, ...value]) => [key, decodeURIComponent(value.join('='))]),
  );
}

function setCookie(response: VercelResponse, value: string) {
  const existing = response.getHeader('Set-Cookie');
  const values = existing ? (Array.isArray(existing) ? existing : [String(existing)]) : [];
  response.setHeader('Set-Cookie', [...values, value]);
}

function secureCookie(name: string, value: string, maxAge: number) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

function clearCookie(name: string) {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

async function verifyPassword(password: string) {
  const encoded = process.env.ADMIN_PASSWORD_SCRYPT;
  if (!encoded) throw new Error('ADMIN_PASSWORD_SCRYPT is not configured');
  const [salt, expectedHex] = encoded.split(':');
  if (!salt || !expectedHex) return false;
  const actual = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(expectedHex, 'hex');
  return actual.length === expected.length && timingSafeEqual(Uint8Array.from(actual), Uint8Array.from(expected));
}

async function rateLimit(key: string, limit: number, windowMs: number) {
  const db = getDb();
  const now = new Date();
  const [row] = await db.select().from(rateLimits).where(eq(rateLimits.key, key)).limit(1);
  if (!row || now.getTime() - row.windowStartedAt.getTime() > windowMs) {
    await db
      .insert(rateLimits)
      .values({ key, attempts: 1, windowStartedAt: now, blockedUntil: null })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: { attempts: 1, windowStartedAt: now, blockedUntil: null },
      });
    return true;
  }
  if ((row.blockedUntil && row.blockedUntil > now) || row.attempts >= limit) {
    await db
      .update(rateLimits)
      .set({ blockedUntil: new Date(now.getTime() + windowMs) })
      .where(eq(rateLimits.key, key));
    return false;
  }
  await db.update(rateLimits).set({ attempts: row.attempts + 1 }).where(eq(rateLimits.key, key));
  return true;
}

export async function startLogin(
  request: VercelRequest,
  response: VercelResponse,
  credentials: { loginId: string; password: string },
) {
  if (!requestOriginAllowed(request)) return json(response, 403, { error: 'Request rejected' });
  const ip = String(request.headers['x-forwarded-for'] ?? request.socket.remoteAddress ?? 'unknown').split(',')[0];
  if (!(await rateLimit(`login:${hash(ip)}`, 5, 15 * 60 * 1000))) {
    return json(response, 429, { error: 'Unable to sign in. Try again later.' });
  }

  const loginId = process.env.ADMIN_LOGIN_ID;
  const phone = process.env.ADMIN_PHONE_E164;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!loginId || !phone || !accountSid || !authToken || !serviceSid) {
    throw new Error('Engine authentication is not configured');
  }

  const validId = safeEqual(credentials.loginId, loginId);
  const validPassword = await verifyPassword(credentials.password);
  if (!validId || !validPassword) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return json(response, 401, { error: 'Unable to sign in with those details' });
  }

  const verification = await twilio(accountSid, authToken).verify.v2
    .services(serviceSid)
    .verifications.create({ to: phone, channel: 'whatsapp' });
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const db = getDb();
  const [challenge] = await db
    .insert(loginChallenges)
    .values({ twilioSid: verification.sid, expiresAt })
    .returning({ id: loginChallenges.id });
  setCookie(response, secureCookie(CHALLENGE_COOKIE, challenge.id, 600));
  await db.insert(auditEvents).values({ action: 'auth.otp_requested' });
  return json(response, 200, { challenge: true, destination: `••••${phone.slice(-4)}` });
}

export async function verifyLogin(request: VercelRequest, response: VercelResponse, code: string) {
  if (!requestOriginAllowed(request)) return json(response, 403, { error: 'Request rejected' });
  const challengeId = cookies(request)[CHALLENGE_COOKIE];
  if (!challengeId) return json(response, 401, { error: 'Login challenge expired' });
  const db = getDb();
  const [challenge] = await db
    .select()
    .from(loginChallenges)
    .where(
      and(
        eq(loginChallenges.id, challengeId),
        isNull(loginChallenges.completedAt),
        gt(loginChallenges.expiresAt, new Date()),
      ),
    )
    .limit(1);
  if (!challenge || challenge.attempts >= 5) return json(response, 401, { error: 'Login challenge expired' });

  await db
    .update(loginChallenges)
    .set({ attempts: challenge.attempts + 1 })
    .where(eq(loginChallenges.id, challenge.id));

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  const phone = process.env.ADMIN_PHONE_E164;
  if (!accountSid || !authToken || !serviceSid || !phone) throw new Error('Engine authentication is not configured');
  const check = await twilio(accountSid, authToken).verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: phone, code });
  if (check.status !== 'approved') return json(response, 401, { error: 'Incorrect or expired code' });

  const token = randomBytes(32).toString('base64url');
  const csrfToken = randomBytes(24).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(engineSessions).values({
    tokenHash: hash(token),
    csrfToken,
    userAgentHash: request.headers['user-agent'] ? hash(String(request.headers['user-agent'])) : null,
    expiresAt,
  });
  await db
    .update(loginChallenges)
    .set({ completedAt: new Date() })
    .where(eq(loginChallenges.id, challenge.id));
  await db.insert(auditEvents).values({ action: 'auth.login' });
  setCookie(response, clearCookie(CHALLENGE_COOKIE));
  setCookie(response, secureCookie(SESSION_COOKIE, token, SESSION_TTL_MS / 1000));
  return json(response, 200, { authenticated: true, csrfToken });
}

export async function requireEngine(request: VercelRequest, response: VercelResponse, mutation = false) {
  const token = cookies(request)[SESSION_COOKIE];
  if (!token) {
    json(response, 401, { error: 'Authentication required' });
    return null;
  }
  const db = getDb();
  const now = new Date();
  const [session] = await db
    .select()
    .from(engineSessions)
    .where(
      and(
        eq(engineSessions.tokenHash, hash(token)),
        isNull(engineSessions.revokedAt),
        gt(engineSessions.expiresAt, now),
      ),
    )
    .limit(1);
  if (!session || now.getTime() - session.lastSeenAt.getTime() > IDLE_TTL_MS) {
    setCookie(response, clearCookie(SESSION_COOKIE));
    json(response, 401, { error: 'Session expired' });
    return null;
  }
  if (mutation) {
    if (!requestOriginAllowed(request) || request.headers['x-engine-csrf'] !== session.csrfToken) {
      json(response, 403, { error: 'Request rejected' });
      return null;
    }
  }
  await db.update(engineSessions).set({ lastSeenAt: now }).where(eq(engineSessions.id, session.id));
  return session;
}

export async function logout(request: VercelRequest, response: VercelResponse) {
  const token = cookies(request)[SESSION_COOKIE];
  if (token) {
    const db = getDb();
    await db
      .update(engineSessions)
      .set({ revokedAt: new Date() })
      .where(eq(engineSessions.tokenHash, hash(token)));
    await db.insert(auditEvents).values({ action: 'auth.logout' });
  }
  setCookie(response, clearCookie(SESSION_COOKIE));
  return json(response, 200, { authenticated: false });
}
