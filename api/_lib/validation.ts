import { z } from 'zod';

export const slugSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const safeUrlSchema = z.string().max(2048).refine((value) => {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    return ['https:', 'mailto:', 'tel:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, 'Unsafe or invalid URL');

export const contentStatusSchema = z.enum(['draft', 'published', 'archived']);

export const sectionSchema = z.object({
  heading: z.string().max(180),
  paragraphs: z.array(z.string().max(10000)).max(30),
  bullets: z.array(z.string().max(1000)).max(50).optional(),
});

export const postInputSchema = z.object({
  slug: slugSchema,
  title: z.string().min(2).max(180),
  excerpt: z.string().max(600),
  category: z.string().min(1).max(80),
  readingTime: z.string().min(1).max(30),
  publishedAt: z.string().datetime().nullable().optional(),
  relatedProductSlugs: z.array(slugSchema).max(20),
  sections: z.array(sectionSchema).min(1).max(100),
  seoTitle: z.string().max(70),
  seoDescription: z.string().max(170),
  coverImage: safeUrlSchema.optional().or(z.literal('')),
  contentStatus: contentStatusSchema,
});

const productLinkSchema = z.object({
  label: z.string().max(60),
  href: safeUrlSchema.or(z.literal('#coming-soon')),
  status: z.enum(['available', 'coming-soon']),
});

export const productInputSchema = z
  .object({
    slug: slugSchema,
    name: z.string().min(1).max(100),
    eyebrow: z.string().max(100),
    category: z.string().max(100),
    status: z.string().max(100),
    shortDescription: z.string().max(500),
    longDescription: z.string().max(5000),
    logo: safeUrlSchema,
    catalogImage: safeUrlSchema.optional().or(z.literal('')),
    heroImage: safeUrlSchema.optional().or(z.literal('')),
    tags: z.array(z.string().max(50)).max(30),
    features: z.array(z.string().max(500)).max(50),
    audiences: z.array(z.string().max(300)).max(30).optional(),
    workflow: z
      .array(z.object({ label: z.string().max(80), title: z.string().max(150), description: z.string().max(800) }))
      .max(20)
      .optional(),
    principles: z.array(z.string().max(200)).max(30).optional(),
    metrics: z.array(z.object({ label: z.string().max(80), value: z.string().max(80) })).max(30),
    productSite: safeUrlSchema.optional().or(z.literal('')),
    productSiteLabel: z.string().max(80).optional(),
    redirectToProductSite: z.boolean().optional(),
    openInNewTab: z.boolean(),
    ownership: z.enum(['oraik', 'solo']).optional(),
    links: z.object({
      github: productLinkSchema,
      playStore: productLinkSchema,
      appStore: productLinkSchema,
      fdroid: productLinkSchema,
    }),
    featured: z.boolean(),
    contentStatus: contentStatusSchema,
    sortOrder: z.number().int().min(0).max(10000),
  })
  .superRefine((value, context) => {
    if (value.redirectToProductSite && !value.productSite) {
      context.addIssue({ code: 'custom', path: ['productSite'], message: 'A redirect destination is required' });
    }
    if (value.productSite?.startsWith(`/products/${value.slug}`)) {
      context.addIssue({ code: 'custom', path: ['productSite'], message: 'A product cannot redirect to itself' });
    }
  });

export const pageInputSchema = z.object({
  contentStatus: contentStatusSchema,
  content: z.record(z.string(), z.unknown()),
});

export const settingsSchema = z.object({
  companyDescription: z.string().max(800),
  contactEmail: z.string().email(),
  contactPhoneDisplay: z.string().max(40),
  contactPhoneHref: safeUrlSchema.refine((value) => value.startsWith('tel:'), 'Phone link must use tel:'),
  address: z.string().max(800),
  copyright: z.string().max(200),
});

export const accountSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1).max(80),
  url: safeUrlSchema,
  icon: z.enum(['x', 'github', 'linkedin', 'instagram', 'youtube', 'discord', 'whatsapp', 'email', 'link']),
  placement: z.enum(['footer', 'header', 'both']),
  active: z.boolean(),
  sortOrder: z.number().int().min(0).max(10000),
});

