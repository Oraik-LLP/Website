import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { blogPosts, type BlogPost } from '../data/blog';
import { products, type Product } from '../data/products';
import { defaultConnectedAccounts, defaultSiteSettings } from '../data/siteContent';
import type { ConnectedAccount, PageContent, PublicBootstrap, SiteSettings } from './types';

type ContentValue = {
  posts: BlogPost[];
  products: Product[];
  settings: SiteSettings;
  accounts: ConnectedAccount[];
  page: (key: 'home' | 'about' | 'resources') => Record<string, unknown>;
  redirectFor: (path: string) => string | undefined;
  source: 'fixtures' | 'engine';
};

const ContentContext = createContext<ContentValue>({
  posts: blogPosts,
  products,
  settings: defaultSiteSettings,
  accounts: defaultConnectedAccounts,
  page: () => ({}),
  redirectFor: () => undefined,
  source: 'fixtures',
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [runtime, setRuntime] = useState<PublicBootstrap | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/public/bootstrap', { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 204 || !response.ok) return null;
        return (await response.json()) as PublicBootstrap;
      })
      .then((result) => result && setRuntime(result))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const value = useMemo<ContentValue>(() => {
    const pages = new Map((runtime?.pages ?? []).map((page: PageContent) => [page.key, page.content]));
    return {
      posts: runtime?.posts?.length ? runtime.posts : blogPosts,
      products: runtime?.products?.length ? runtime.products : products,
      settings: runtime?.settings ?? defaultSiteSettings,
      accounts: runtime?.accounts?.length ? runtime.accounts : defaultConnectedAccounts,
      page: (key) => pages.get(key) ?? {},
      redirectFor: (path) => runtime?.redirects?.find((redirect) => redirect.oldPath === path)?.newPath,
      source: runtime ? 'engine' : 'fixtures',
    };
  }, [runtime]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
