import type { VercelRequest, VercelResponse } from '@vercel/node';
import { asc, eq } from 'drizzle-orm';
import { getDb } from '../_lib/db.js';
import { handleError } from '../_lib/http.js';
import { catchAllPath } from '../_lib/path.js';
import { connectedAccounts, pageSections, posts, products, redirectHistory, siteSettings } from '../_lib/schema.js';

function publicHeaders(response: VercelResponse) {
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=5, stale-while-revalidate=30');
  response.setHeader('X-Content-Type-Options', 'nosniff');
}

function postDto(row: typeof posts.$inferSelect) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    publishedAt: row.publishedAt?.toISOString() ?? '',
    readingTime: row.readingTime,
    relatedProductSlugs: row.relatedProductSlugs,
    status: 'published',
    sections: row.sections,
    contentStatus: row.status,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    coverImage: row.coverImage ?? undefined,
    updatedAt: row.updatedAt.toISOString(),
  };
}

function productDto(row: typeof products.$inferSelect) {
  return {
    id: row.id,
    ...row.data,
    slug: row.slug,
    name: row.name,
    status: row.status,
    contentStatus: row.contentStatus,
    openInNewTab: row.openInNewTab,
    sortOrder: row.sortOrder,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' });
    publicHeaders(response);
    const parts = catchAllPath(request.url, request.query, 'public');
    const db = getDb();

    if (parts[0] === 'bootstrap') {
      const [postRows, productRows, pages, settingsRows, accounts, redirects] = await Promise.all([
        db.select().from(posts).where(eq(posts.status, 'published')).orderBy(asc(posts.publishedAt)),
        db.select().from(products).where(eq(products.contentStatus, 'published')).orderBy(asc(products.sortOrder)),
        db.select().from(pageSections).where(eq(pageSections.status, 'published')),
        db.select().from(siteSettings).where(eq(siteSettings.id, 'global')).limit(1),
        db.select().from(connectedAccounts).where(eq(connectedAccounts.active, true)).orderBy(asc(connectedAccounts.sortOrder)),
        db.select({ oldPath: redirectHistory.oldPath, newPath: redirectHistory.newPath }).from(redirectHistory),
      ]);
      if (!postRows.length && !productRows.length) return response.status(204).end();
      return response.status(200).json({
        posts: postRows.map(postDto),
        products: productRows.map(productDto),
        pages: pages.map((page) => ({
          key: page.pageKey,
          contentStatus: page.status,
          content: page.content,
          updatedAt: page.updatedAt.toISOString(),
        })),
        settings: settingsRows[0]?.data ?? null,
        accounts,
        redirects,
      });
    }
    if (parts[0] === 'posts' && parts[1]) {
      const [row] = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, parts[1]))
        .limit(1);
      if (row?.status === 'published') return response.status(200).json({ item: postDto(row) });
      const oldPath = `/blog/${parts[1]}`;
      const [redirect] = await db.select().from(redirectHistory).where(eq(redirectHistory.oldPath, oldPath)).limit(1);
      return redirect
        ? response.status(301).json({ redirect: redirect.newPath })
        : response.status(404).json({ error: 'Not found' });
    }
    if (parts[0] === 'products' && parts[1]) {
      const [row] = await db.select().from(products).where(eq(products.slug, parts[1])).limit(1);
      if (row?.contentStatus === 'published') return response.status(200).json({ item: productDto(row) });
      return response.status(404).json({ error: 'Not found' });
    }
    return response.status(404).json({ error: 'Not found' });
  } catch (error) {
    return handleError(response, error);
  }
}
