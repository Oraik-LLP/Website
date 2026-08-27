import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
};

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt').notNull().default(''),
    category: text('category').notNull().default('Field Notes'),
    readingTime: text('reading_time').notNull().default('5 min'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    relatedProductSlugs: jsonb('related_product_slugs').$type<string[]>().notNull().default([]),
    sections: jsonb('sections').$type<unknown[]>().notNull().default([]),
    seoTitle: text('seo_title').notNull().default(''),
    seoDescription: text('seo_description').notNull().default(''),
    coverImage: text('cover_image'),
    status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
    ...timestamps,
  },
  (table) => [uniqueIndex('posts_slug_unique').on(table.slug), index('posts_status_idx').on(table.status)],
);

export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    status: text('status').notNull().default('Coming soon'),
    contentStatus: text('content_status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
    data: jsonb('data').$type<Record<string, unknown>>().notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    openInNewTab: boolean('open_in_new_tab').notNull().default(true),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('products_slug_unique').on(table.slug),
    index('products_content_status_idx').on(table.contentStatus),
  ],
);

export const pageSections = pgTable(
  'page_sections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    pageKey: text('page_key', { enum: ['home', 'about', 'resources'] }).notNull(),
    status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
    content: jsonb('content').$type<Record<string, unknown>>().notNull().default({}),
    ...timestamps,
  },
  (table) => [uniqueIndex('page_sections_page_key_unique').on(table.pageKey)],
);

export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey().default('global'),
  data: jsonb('data').$type<Record<string, unknown>>().notNull(),
  ...timestamps,
});

export const connectedAccounts = pgTable('connected_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: text('label').notNull(),
  url: text('url').notNull(),
  icon: text('icon').notNull(),
  placement: text('placement', { enum: ['footer', 'header', 'both'] }).notNull().default('footer'),
  active: boolean('active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
});

export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: text('url').notNull(),
  pathname: text('pathname').notNull(),
  filename: text('filename').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  altText: text('alt_text').notNull(),
  ...timestamps,
});

export const contentRevisions = pgTable(
  'content_revisions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    snapshot: jsonb('snapshot').$type<Record<string, unknown>>().notNull(),
    action: text('action').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('content_revisions_entity_idx').on(table.entityType, table.entityId)],
);

export const redirectHistory = pgTable('redirect_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  oldPath: text('old_path').notNull(),
  newPath: text('new_path').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const engineSessions = pgTable(
  'engine_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tokenHash: text('token_hash').notNull(),
    csrfToken: text('csrf_token').notNull(),
    userAgentHash: text('user_agent_hash'),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('engine_sessions_token_hash_unique').on(table.tokenHash)],
);

export const loginChallenges = pgTable('login_challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  attempts: integer('attempts').notNull().default(0),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const engineAuthState = pgTable('engine_auth_state', {
  id: text('id').primaryKey().default('global'),
  lastTotpTimeStep: integer('last_totp_time_step').notNull().default(-1),
  ...timestamps,
});

export const auditEvents = pgTable(
  'audit_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    action: text('action').notNull(),
    entityType: text('entity_type'),
    entityId: text('entity_id'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('audit_events_created_at_idx').on(table.createdAt)],
);

export const rateLimits = pgTable(
  'rate_limits',
  {
    key: text('key').primaryKey(),
    attempts: integer('attempts').notNull().default(0),
    windowStartedAt: timestamp('window_started_at', { withTimezone: true }).notNull().defaultNow(),
    blockedUntil: timestamp('blocked_until', { withTimezone: true }),
  },
);
