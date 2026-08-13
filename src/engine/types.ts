import type { BlogPost } from '../data/blog';
import type { Product } from '../data/products';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type EnginePost = BlogPost & {
  id: string;
  contentStatus: ContentStatus;
  seoTitle: string;
  seoDescription: string;
  coverImage?: string;
  updatedAt: string;
};

export type EngineProduct = Product & {
  id: string;
  contentStatus: ContentStatus;
  openInNewTab: boolean;
  sortOrder: number;
  updatedAt: string;
};

export type PageKey = 'home' | 'about' | 'resources';

export type PageContent = {
  key: PageKey;
  contentStatus: ContentStatus;
  content: Record<string, unknown>;
  updatedAt: string;
};

export type SiteSettings = {
  companyDescription: string;
  contactEmail: string;
  contactPhoneDisplay: string;
  contactPhoneHref: string;
  address: string;
  copyright: string;
};

export type ConnectedAccount = {
  id: string;
  label: string;
  url: string;
  icon: 'x' | 'github' | 'linkedin' | 'instagram' | 'youtube' | 'discord' | 'whatsapp' | 'email' | 'link';
  placement: 'footer' | 'header' | 'both';
  active: boolean;
  sortOrder: number;
};

export type MediaAsset = {
  id: string;
  url: string;
  pathname: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  altText: string;
  createdAt: string;
};

export type PublicBootstrap = {
  posts: EnginePost[];
  products: EngineProduct[];
  pages: PageContent[];
  settings: SiteSettings | null;
  accounts: ConnectedAccount[];
  redirects: Array<{ oldPath: string; newPath: string }>;
};
