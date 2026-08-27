import type { VercelRequest, VercelResponse } from '@vercel/node';
import { del, put } from '@vercel/blob';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { logout, requireEngine, startLogin, verifyLogin } from '../_lib/auth.js';
import { getDb } from '../_lib/db.js';
import { inspectRaster } from '../_lib/image.js';
import { catchAllPath } from '../_lib/path.js';
import { handleError, json, methodNotAllowed, readJson } from '../_lib/http.js';
import {
  accountSchema,
  pageInputSchema,
  postInputSchema,
  productInputSchema,
  settingsSchema,
} from '../_lib/validation.js';
import {
  auditEvents,
  connectedAccounts,
  contentRevisions,
  mediaAssets,
  pageSections,
  posts,
  products,
  redirectHistory,
  siteSettings,
} from '../_lib/schema.js';

export const config = { api: { bodyParser: false } };

const credentialsSchema = z.object({ loginId: z.string().max(200), password: z.string().max(500) });
const otpSchema = z.object({ code: z.string().regex(/^\d{6}$/) });

function pathParts(request: VercelRequest) {
  return catchAllPath(request.url, request.query, 'engine');
}

async function bodyBuffer(request: VercelRequest): Promise<Uint8Array> {
  if (request.body instanceof Uint8Array) return Uint8Array.from(request.body);
  const chunks: Uint8Array[] = [];
  let size = 0;
  for await (const chunk of request) {
    const value = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += value.length;
    if (size > 4 * 1024 * 1024) throw new Error('Upload exceeds 4 MB');
    chunks.push(Uint8Array.from(value));
  }
  const combined = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }
  return combined;
}

async function audit(action: string, entityType?: string, entityId?: string, metadata = {}) {
  await getDb().insert(auditEvents).values({ action, entityType, entityId, metadata });
}

async function revision(entityType: string, entityId: string, snapshot: Record<string, unknown>, action: string) {
  await getDb().insert(contentRevisions).values({ entityType, entityId, snapshot, action });
}

function postRecord(input: z.infer<typeof postInputSchema>) {
  return {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    category: input.category,
    readingTime: input.readingTime,
    publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
    relatedProductSlugs: input.relatedProductSlugs,
    sections: input.sections,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    coverImage: input.coverImage || null,
    status: input.contentStatus,
    updatedAt: new Date(),
  };
}

function productRecord(input: z.infer<typeof productInputSchema>) {
  const { contentStatus, openInNewTab, sortOrder, ...data } = input;
  return {
    slug: input.slug,
    name: input.name,
    status: input.status,
    contentStatus,
    openInNewTab,
    sortOrder,
    data,
    updatedAt: new Date(),
  };
}

async function handlePosts(request: VercelRequest, response: VercelResponse, parts: string[]) {
  const db = getDb();
  const id = parts[1];
  const action = parts[2];

  if (request.method === 'GET' && !id) {
    return json(response, 200, { items: await db.select().from(posts).orderBy(desc(posts.updatedAt)) });
  }
  if (request.method === 'GET' && id && !action) {
    const [item] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return item ? json(response, 200, { item }) : json(response, 404, { error: 'Post not found' });
  }
  if (request.method === 'POST' && !id) {
    const input = postInputSchema.parse(await readJson(request));
    const [item] = await db.insert(posts).values(postRecord(input)).returning();
    await revision('post', item.id, item as unknown as Record<string, unknown>, 'created');
    await audit('post.created', 'post', item.id);
    return json(response, 201, { item });
  }
  if (request.method === 'PUT' && id && !action) {
    const input = postInputSchema.parse(await readJson(request));
    const [current] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (!current) return json(response, 404, { error: 'Post not found' });
    if (current.slug !== input.slug) {
      await db.insert(redirectHistory).values({
        entityType: 'post',
        entityId: id,
        oldPath: `/blog/${current.slug}`,
        newPath: `/blog/${input.slug}`,
      });
    }
    await revision('post', id, current as unknown as Record<string, unknown>, 'saved');
    const [item] = await db.update(posts).set(postRecord(input)).where(eq(posts.id, id)).returning();
    await audit('post.saved', 'post', id);
    return json(response, 200, { item });
  }
  if (request.method === 'POST' && id && ['publish', 'unpublish', 'archive'].includes(action)) {
    const [current] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (!current) return json(response, 404, { error: 'Post not found' });
    const status = action === 'publish' ? 'published' : action === 'archive' ? 'archived' : 'draft';
    await revision('post', id, current as unknown as Record<string, unknown>, action);
    const [item] = await db
      .update(posts)
      .set({ status, publishedAt: status === 'published' ? current.publishedAt ?? new Date() : current.publishedAt, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    await audit(`post.${action}`, 'post', id);
    return json(response, 200, { item });
  }
  if (request.method === 'POST' && id && action === 'duplicate') {
    const [current] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (!current) return json(response, 404, { error: 'Post not found' });
    const [item] = await db
      .insert(posts)
      .values({
        ...current,
        id: undefined,
        slug: `${current.slug}-copy-${Date.now().toString().slice(-5)}`,
        title: `${current.title} (copy)`,
        status: 'draft',
        publishedAt: null,
        createdAt: undefined,
        updatedAt: new Date(),
      })
      .returning();
    await audit('post.duplicated', 'post', item.id, { sourceId: id });
    return json(response, 201, { item });
  }
  if (request.method === 'GET' && id && action === 'revisions') {
    const items = await db
      .select()
      .from(contentRevisions)
      .where(and(eq(contentRevisions.entityType, 'post'), eq(contentRevisions.entityId, id)))
      .orderBy(desc(contentRevisions.createdAt));
    return json(response, 200, { items });
  }
  if (request.method === 'POST' && id && action === 'restore') {
    const { revisionId } = z.object({ revisionId: z.string().uuid() }).parse(await readJson(request));
    const [saved] = await db
      .select()
      .from(contentRevisions)
      .where(
        and(
          eq(contentRevisions.id, revisionId),
          eq(contentRevisions.entityType, 'post'),
          eq(contentRevisions.entityId, id),
        ),
      )
      .limit(1);
    if (!saved) return json(response, 404, { error: 'Revision not found' });
    const snapshot = saved.snapshot as typeof posts.$inferSelect;
    const [item] = await db
      .update(posts)
      .set({
        slug: snapshot.slug,
        title: snapshot.title,
        excerpt: snapshot.excerpt,
        category: snapshot.category,
        readingTime: snapshot.readingTime,
        publishedAt: snapshot.publishedAt ? new Date(snapshot.publishedAt) : null,
        relatedProductSlugs: snapshot.relatedProductSlugs,
        sections: snapshot.sections,
        seoTitle: snapshot.seoTitle,
        seoDescription: snapshot.seoDescription,
        coverImage: snapshot.coverImage,
        status: 'draft',
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();
    await audit('post.revision_restored', 'post', id, { revisionId });
    return json(response, 200, { item });
  }
  return methodNotAllowed(response, ['GET', 'POST', 'PUT']);
}

async function handleProducts(request: VercelRequest, response: VercelResponse, parts: string[]) {
  const db = getDb();
  const id = parts[1];
  const action = parts[2];
  if (request.method === 'GET' && !id) {
    return json(response, 200, { items: await db.select().from(products).orderBy(asc(products.sortOrder)) });
  }
  if (request.method === 'GET' && id && !action) {
    const [item] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return item ? json(response, 200, { item: { ...item, ...item.data } }) : json(response, 404, { error: 'Product not found' });
  }
  if (request.method === 'POST' && !id) {
    const input = productInputSchema.parse(await readJson(request));
    const [item] = await db.insert(products).values(productRecord(input)).returning();
    await revision('product', item.id, item as unknown as Record<string, unknown>, 'created');
    await audit('product.created', 'product', item.id);
    return json(response, 201, { item: { ...item, ...item.data } });
  }
  if (request.method === 'PUT' && id && !action) {
    const input = productInputSchema.parse(await readJson(request));
    const [current] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!current) return json(response, 404, { error: 'Product not found' });
    if (current.slug !== input.slug) {
      await db.insert(redirectHistory).values({
        entityType: 'product',
        entityId: id,
        oldPath: `/products/${current.slug}`,
        newPath: `/products/${input.slug}`,
      });
    }
    await revision('product', id, current as unknown as Record<string, unknown>, 'saved');
    const [item] = await db.update(products).set(productRecord(input)).where(eq(products.id, id)).returning();
    await audit('product.saved', 'product', id);
    return json(response, 200, { item: { ...item, ...item.data } });
  }
  if (request.method === 'POST' && id && ['publish', 'unpublish', 'archive'].includes(action)) {
    const [current] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!current) return json(response, 404, { error: 'Product not found' });
    const contentStatus = action === 'publish' ? 'published' : action === 'archive' ? 'archived' : 'draft';
    await revision('product', id, current as unknown as Record<string, unknown>, action);
    const [item] = await db
      .update(products)
      .set({ contentStatus, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    await audit(`product.${action}`, 'product', id);
    return json(response, 200, { item: { ...item, ...item.data } });
  }
  if (request.method === 'GET' && id && action === 'revisions') {
    const items = await db
      .select()
      .from(contentRevisions)
      .where(and(eq(contentRevisions.entityType, 'product'), eq(contentRevisions.entityId, id)))
      .orderBy(desc(contentRevisions.createdAt));
    return json(response, 200, { items });
  }
  if (request.method === 'POST' && id && action === 'restore') {
    const { revisionId } = z.object({ revisionId: z.string().uuid() }).parse(await readJson(request));
    const [saved] = await db
      .select()
      .from(contentRevisions)
      .where(
        and(
          eq(contentRevisions.id, revisionId),
          eq(contentRevisions.entityType, 'product'),
          eq(contentRevisions.entityId, id),
        ),
      )
      .limit(1);
    if (!saved) return json(response, 404, { error: 'Revision not found' });
    const snapshot = saved.snapshot as typeof products.$inferSelect;
    const [item] = await db
      .update(products)
      .set({
        slug: snapshot.slug,
        name: snapshot.name,
        status: snapshot.status,
        contentStatus: 'draft',
        data: snapshot.data,
        sortOrder: snapshot.sortOrder,
        openInNewTab: snapshot.openInNewTab,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    await audit('product.revision_restored', 'product', id, { revisionId });
    return json(response, 200, { item: { ...item, ...item.data } });
  }
  return methodNotAllowed(response, ['GET', 'POST', 'PUT']);
}

async function handlePages(request: VercelRequest, response: VercelResponse, parts: string[]) {
  const db = getDb();
  const key = parts[1] as 'home' | 'about' | 'resources' | undefined;
  if (request.method === 'GET' && !key) {
    return json(response, 200, { items: await db.select().from(pageSections).orderBy(asc(pageSections.pageKey)) });
  }
  if (request.method === 'GET' && key) {
    const [item] = await db.select().from(pageSections).where(eq(pageSections.pageKey, key)).limit(1);
    return json(response, 200, { item: item ?? { pageKey: key, status: 'draft', content: {} } });
  }
  if (request.method === 'PUT' && key) {
    const input = pageInputSchema.parse(await readJson(request));
    const [current] = await db.select().from(pageSections).where(eq(pageSections.pageKey, key)).limit(1);
    if (current) await revision('page', current.id, current as unknown as Record<string, unknown>, 'saved');
    const [item] = await db
      .insert(pageSections)
      .values({ pageKey: key, status: input.contentStatus, content: input.content })
      .onConflictDoUpdate({
        target: pageSections.pageKey,
        set: { status: input.contentStatus, content: input.content, updatedAt: new Date() },
      })
      .returning();
    await audit('page.saved', 'page', item.id, { pageKey: key });
    return json(response, 200, { item });
  }
  return methodNotAllowed(response, ['GET', 'PUT']);
}

async function handleSettings(request: VercelRequest, response: VercelResponse) {
  const db = getDb();
  if (request.method === 'GET') {
    const [item] = await db.select().from(siteSettings).where(eq(siteSettings.id, 'global')).limit(1);
    return json(response, 200, { item: item?.data ?? null });
  }
  if (request.method === 'PUT') {
    const data = settingsSchema.parse(await readJson(request));
    await db
      .insert(siteSettings)
      .values({ id: 'global', data })
      .onConflictDoUpdate({ target: siteSettings.id, set: { data, updatedAt: new Date() } });
    await audit('settings.saved', 'settings', 'global');
    return json(response, 200, { item: data });
  }
  return methodNotAllowed(response, ['GET', 'PUT']);
}

async function handleAccounts(request: VercelRequest, response: VercelResponse, parts: string[]) {
  const db = getDb();
  const id = parts[1];
  if (request.method === 'GET') {
    return json(response, 200, { items: await db.select().from(connectedAccounts).orderBy(asc(connectedAccounts.sortOrder)) });
  }
  if (request.method === 'POST' && !id) {
    const input = accountSchema.parse(await readJson(request));
    const [item] = await db.insert(connectedAccounts).values(input).returning();
    await audit('account.created', 'connected_account', item.id);
    return json(response, 201, { item });
  }
  if (request.method === 'PUT' && id) {
    const input = accountSchema.omit({ id: true }).parse(await readJson(request));
    const [item] = await db
      .update(connectedAccounts)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(connectedAccounts.id, id))
      .returning();
    await audit('account.saved', 'connected_account', id);
    return item ? json(response, 200, { item }) : json(response, 404, { error: 'Account not found' });
  }
  if (request.method === 'DELETE' && id) {
    await db.delete(connectedAccounts).where(eq(connectedAccounts.id, id));
    await audit('account.deleted', 'connected_account', id);
    return json(response, 200, { deleted: true });
  }
  return methodNotAllowed(response, ['GET', 'POST', 'PUT', 'DELETE']);
}

async function handleMedia(request: VercelRequest, response: VercelResponse, parts: string[]) {
  const db = getDb();
  const id = parts[1];
  if (request.method === 'GET') {
    return json(response, 200, { items: await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)) });
  }
  if (request.method === 'POST' && !id) {
    const altText = String(request.headers['x-alt-text'] ?? '').trim();
    const originalName = String(request.headers['x-file-name'] ?? 'upload');
    const mimeType = String(request.headers['content-type'] ?? '');
    if (!altText || altText.length > 300) return json(response, 400, { error: 'Valid alt text is required' });
    const buffer = await bodyBuffer(request);
    const type = inspectRaster(buffer, mimeType);
    if (!type) return json(response, 400, { error: 'Only verified PNG, JPEG, and WebP files are accepted' });
    if (
      type.width < 32 ||
      type.height < 32 ||
      type.width > 8000 ||
      type.height > 8000
    ) {
      return json(response, 400, { error: 'Image dimensions must be between 32 and 8000 pixels' });
    }
    const pathname = `engine/${randomUUID()}.${type.extension}`;
    const blob = await put(pathname, Buffer.from(buffer), {
      access: 'public',
      contentType: type.mime,
      addRandomSuffix: false,
    });
    const [item] = await db
      .insert(mediaAssets)
      .values({
        url: blob.url,
        pathname,
        filename: originalName.slice(0, 255),
        mimeType: type.mime,
        size: buffer.length,
        width: type.width,
        height: type.height,
        altText,
      })
      .returning();
    await audit('media.uploaded', 'media', item.id);
    return json(response, 201, { item });
  }
  if (request.method === 'DELETE' && id) {
    const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
    if (!asset) return json(response, 404, { error: 'Asset not found' });
    const [postRows, productRows, pageRows, settingRows] = await Promise.all([
      db.select().from(posts),
      db.select().from(products),
      db.select().from(pageSections),
      db.select().from(siteSettings),
    ]);
    const references = JSON.stringify([postRows, productRows, pageRows, settingRows]);
    if (references.includes(asset.url)) return json(response, 409, { error: 'Asset is currently in use' });
    await del(asset.url);
    await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
    await audit('media.deleted', 'media', id);
    return json(response, 200, { deleted: true });
  }
  return methodNotAllowed(response, ['GET', 'POST', 'DELETE']);
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const parts = pathParts(request);
    response.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");

    if (parts[0] === 'auth' && parts[1] === 'start' && request.method === 'POST') {
      return startLogin(request, response, credentialsSchema.parse(await readJson(request)));
    }
    if (parts[0] === 'auth' && parts[1] === 'verify' && request.method === 'POST') {
      return verifyLogin(request, response, otpSchema.parse(await readJson(request)).code);
    }
    if (parts[0] === 'auth' && parts[1] === 'logout' && request.method === 'POST') {
      const session = await requireEngine(request, response, true);
      if (!session) return;
      return logout(request, response);
    }

    const mutation = !['GET', 'HEAD', 'OPTIONS'].includes(request.method ?? 'GET');
    const session = await requireEngine(request, response, mutation);
    if (!session) return;
    if (parts[0] === 'session' && request.method === 'GET') {
      return json(response, 200, { authenticated: true, csrfToken: session.csrfToken });
    }
    if (parts[0] === 'posts') return handlePosts(request, response, parts);
    if (parts[0] === 'products') return handleProducts(request, response, parts);
    if (parts[0] === 'pages') return handlePages(request, response, parts);
    if (parts[0] === 'settings') return handleSettings(request, response);
    if (parts[0] === 'accounts') return handleAccounts(request, response, parts);
    if (parts[0] === 'media') return handleMedia(request, response, parts);
    if (parts[0] === 'activity' && request.method === 'GET') {
      return json(response, 200, { items: await getDb().select().from(auditEvents).orderBy(desc(auditEvents.createdAt)).limit(100) });
    }
    if (parts[0] === 'redirects' && request.method === 'GET') {
      return json(response, 200, { items: await getDb().select().from(redirectHistory).orderBy(desc(redirectHistory.createdAt)) });
    }
    return json(response, 404, { error: 'Engine endpoint not found' });
  } catch (error) {
    return handleError(response, error);
  }
}
