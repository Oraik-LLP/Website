import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { and, eq } from 'drizzle-orm';
import { connectedAccounts, posts, products, siteSettings } from '../api/_lib/schema';
import { blogPosts } from '../src/data/blog';
import { products as productFixtures } from '../src/data/products';
import { defaultConnectedAccounts, defaultSiteSettings } from '../src/data/siteContent';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required');
const db = drizzle(neon(databaseUrl));

for (const post of blogPosts) {
  await db
    .insert(posts)
    .values({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      readingTime: post.readingTime,
      publishedAt: new Date(post.publishedAt),
      relatedProductSlugs: post.relatedProductSlugs,
      sections: post.sections,
      seoTitle: post.title.slice(0, 70),
      seoDescription: post.excerpt.slice(0, 170),
      status: post.status === 'published' ? 'published' : 'draft',
    })
    .onConflictDoNothing({ target: posts.slug });
}

for (const [sortOrder, product] of productFixtures.entries()) {
  await db
    .insert(products)
    .values({
      slug: product.slug,
      name: product.name,
      status: product.status,
      contentStatus: 'published',
      data: product,
      sortOrder,
      openInNewTab: true,
    })
    .onConflictDoNothing({ target: products.slug });
}

await db
  .insert(siteSettings)
  .values({ id: 'global', data: defaultSiteSettings })
  .onConflictDoNothing({ target: siteSettings.id });

for (const account of defaultConnectedAccounts) {
  const { id: _fixtureId, ...data } = account;
  const [existing] = await db
    .select({ id: connectedAccounts.id })
    .from(connectedAccounts)
    .where(and(eq(connectedAccounts.label, data.label), eq(connectedAccounts.url, data.url)))
    .limit(1);
  if (!existing) await db.insert(connectedAccounts).values(data);
}

console.log(`Seeded ${blogPosts.length} posts and ${productFixtures.length} products.`);
