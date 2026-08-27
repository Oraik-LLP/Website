import {
  Activity,
  ArrowLeft,
  BookOpen,
  Boxes,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileImage,
  FileText,
  Gauge,
  Globe2,
  LayoutTemplate,
  Link2,
  LogOut,
  Menu,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, Navigate, NavLink, Outlet, RouteObject, useNavigate, useParams } from 'react-router-dom';
import { defaultSiteSettings } from '../data/siteContent';
import { blogPosts } from '../data/blog';
import { products as productFixtures } from '../data/products';
import type { ConnectedAccount, ContentStatus, SiteSettings } from './types';
import { engineApi, jsonMutation, setEngineCsrf } from './api';
import './engine.css';

type SessionState = 'loading' | 'authenticated' | 'anonymous';

type EngineContext = {
  session: SessionState;
  setSession: (state: SessionState) => void;
};

let engineContext: EngineContext = { session: 'loading', setSession: () => undefined };

function useEngineSession() {
  return engineContext;
}

function EngineRoot() {
  const [session, setSession] = useState<SessionState>('loading');

  useEffect(() => {
    const previousTitle = document.title;
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = robots?.content;
    document.title = 'Oraik Engine';
    if (robots) robots.content = 'noindex,nofollow,noarchive';
    const unauthorized = () => setSession('anonymous');
    window.addEventListener('engine:unauthorized', unauthorized);
    engineApi<{ authenticated: boolean; csrfToken: string }>('session')
      .then((result) => {
        setEngineCsrf(result.csrfToken);
        setSession('authenticated');
      })
      .catch(() => setSession('anonymous'));
    return () => {
      window.removeEventListener('engine:unauthorized', unauthorized);
      document.title = previousTitle;
      if (robots && previousRobots) robots.content = previousRobots;
    };
  }, []);

  engineContext = { session, setSession };
  if (session === 'loading') {
    return (
      <div className="engine-boot">
        <span>ORAIK // ENGINE</span>
        <strong>Checking secure session…</strong>
      </div>
    );
  }
  return <Outlet />;
}

export const engineRoutes: RouteObject = {
  path: '/engine',
  element: <EngineRoot />,
  children: [
    { path: 'login', element: <EngineLogin /> },
    {
      element: <EngineGate />,
      children: [
        {
          element: <EngineLayout />,
          children: [
            { index: true, element: <EngineDashboard /> },
            { path: 'posts', element: <EnginePosts /> },
            { path: 'posts/new', element: <EnginePostEditor /> },
            { path: 'posts/:id/preview', element: <EngineRecordPreview type="post" /> },
            { path: 'posts/:id', element: <EnginePostEditor /> },
            { path: 'products', element: <EngineProducts /> },
            { path: 'products/new', element: <EngineProductEditor /> },
            { path: 'products/:id/preview', element: <EngineRecordPreview type="product" /> },
            { path: 'products/:id', element: <EngineProductEditor /> },
            { path: 'pages/:key', element: <EnginePageEditor /> },
            { path: 'connected-accounts', element: <EngineAccounts /> },
            { path: 'media', element: <EngineMedia /> },
            { path: 'activity', element: <EngineActivity /> },
          ],
        },
      ],
    },
  ],
};

function EngineGate() {
  const { session } = useEngineSession();
  return session === 'authenticated' ? <Outlet /> : <Navigate to="/engine/login" replace />;
}

function EngineLogin() {
  const { session, setSession } = useEngineSession();
  const navigate = useNavigate();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  if (session === 'authenticated') return <Navigate to="/engine" replace />;

  const submitCredentials = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await engineApi<{ challenge: true }>('auth/start', {
        method: 'POST',
        body: JSON.stringify({ loginId, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      setStep('otp');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  };

  const submitOtp = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const result = await engineApi<{ authenticated: true; csrfToken: string }>('auth/verify', {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: { 'Content-Type': 'application/json' },
      });
      setEngineCsrf(result.csrfToken);
      setSession('authenticated');
      navigate('/engine', { replace: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Incorrect or expired code');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="engine-login tech-grid">
      <section className="engine-login-panel">
        <div className="engine-wordmark">
          <ShieldCheck size={22} />
          <span>ORAIK // ENGINE</span>
        </div>
        <p className="engine-kicker">Private publishing system</p>
        <h1>{step === 'credentials' ? 'Authenticate operator.' : 'Verify possession.'}</h1>
        <p>
          {step === 'credentials'
            ? 'This surface has no registration or public account access.'
            : 'Enter the rotating code from your authenticator app.'}
        </p>
        <form onSubmit={step === 'credentials' ? submitCredentials : submitOtp}>
          {step === 'credentials' ? (
            <>
              <EngineField label="Login ID">
                <input value={loginId} onChange={(event) => setLoginId(event.target.value)} autoComplete="username" required />
              </EngineField>
              <EngineField label="Password">
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </EngineField>
            </>
          ) : (
            <EngineField label="Authenticator code">
              <input
                className="engine-otp"
                inputMode="numeric"
                pattern="[0-9]*"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                autoComplete="one-time-code"
                required
                autoFocus
              />
            </EngineField>
          )}
          {message && <p className="engine-error">{message}</p>}
          <button className="engine-primary" disabled={busy}>
            {busy ? 'Verifying…' : step === 'credentials' ? 'Continue securely' : 'Open Engine'}
          </button>
          {step === 'otp' && (
            <button className="engine-text-button" type="button" onClick={() => setStep('credentials')}>
              Use different credentials
            </button>
          )}
        </form>
      </section>
    </main>
  );
}

const engineNavigation = [
  { to: '/engine', label: 'Overview', icon: Gauge, end: true },
  { to: '/engine/posts', label: 'Field Notes', icon: BookOpen },
  { to: '/engine/products', label: 'Products', icon: Boxes },
  { to: '/engine/pages/home', label: 'Pages', icon: LayoutTemplate },
  { to: '/engine/connected-accounts', label: 'Connected accounts', icon: Link2 },
  { to: '/engine/media', label: 'Media', icon: FileImage },
  { to: '/engine/activity', label: 'Activity', icon: Activity },
];

function EngineLayout() {
  const { setSession } = useEngineSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const signOut = async () => {
    await jsonMutation('auth/logout', 'POST').catch(() => undefined);
    setSession('anonymous');
    navigate('/engine/login');
  };

  return (
    <div className="engine-shell">
      <header className="engine-mobile-header">
        <strong>ORAIK // ENGINE</strong>
        <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle Engine navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      <aside className={menuOpen ? 'engine-sidebar is-open' : 'engine-sidebar'}>
        <Link className="engine-brand" to="/engine">
          <ShieldCheck />
          <div>
            <strong>ORAIK</strong>
            <span>ENGINE // 01</span>
          </div>
        </Link>
        <nav>
          {engineNavigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)}>
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="engine-sidebar-foot">
          <a href="/" target="_blank" rel="noreferrer">
            <Globe2 size={16} />
            View website
          </a>
          <button type="button" onClick={signOut}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="engine-main">
        <Outlet />
      </main>
    </div>
  );
}

function EngineDashboard() {
  const [counts, setCounts] = useState({ posts: 0, products: 0, media: 0 });
  const [backendReady, setBackendReady] = useState(true);
  useEffect(() => {
    Promise.all([
      engineApi<{ items: unknown[] }>('posts'),
      engineApi<{ items: unknown[] }>('products'),
      engineApi<{ items: unknown[] }>('media'),
    ])
      .then(([posts, products, media]) =>
        setCounts({ posts: posts.items.length, products: products.items.length, media: media.items.length }),
      )
      .catch(() => setBackendReady(false));
  }, []);
  return (
    <EnginePage title="Control plane" eyebrow="SYSTEM // OVERVIEW" description="Publish without touching source code.">
      <div className="engine-status-line">
        <span className={backendReady ? 'is-online' : 'is-offline'} />
        {backendReady ? 'Engine services operational' : 'Engine services need deployment configuration'}
      </div>
      <div className="engine-stat-grid">
        {[
          ['Field Notes', counts.posts, '/engine/posts'],
          ['Products', counts.products, '/engine/products'],
          ['Media assets', counts.media, '/engine/media'],
        ].map(([label, count, to]) => (
          <Link key={String(label)} to={String(to)} className="engine-stat">
            <span>{label}</span>
            <strong>{count}</strong>
            <ExternalLink size={17} />
          </Link>
        ))}
      </div>
      <section className="engine-panel">
        <div className="engine-panel-heading">
          <div>
            <span>QUICK ACTIONS</span>
            <h2>Move content forward.</h2>
          </div>
        </div>
        <div className="engine-action-grid">
          <Link to="/engine/posts/new"><Plus />New Field Note</Link>
          <Link to="/engine/products/new"><Plus />New product</Link>
          <Link to="/engine/pages/home"><LayoutTemplate />Edit homepage</Link>
          <Link to="/engine/connected-accounts"><Link2 />Manage links</Link>
        </div>
      </section>
    </EnginePage>
  );
}

type PostRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: ContentStatus;
  updatedAt: string;
};

function EnginePosts() {
  const [items, setItems] = useState<PostRow[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    engineApi<{ items: PostRow[] }>('posts').then((result) => setItems(result.items)).catch((reason) => setError(reason.message));
  }, []);
  return (
    <EnginePage
      title="Field Notes"
      eyebrow="CONTENT // POSTS"
      description="Draft, preview, and publish structured editorial content."
      action={<Link className="engine-primary" to="/engine/posts/new"><Plus size={16} />New note</Link>}
    >
      {error ? <EngineNotice>{error}</EngineNotice> : <EngineTable items={items} type="post" />}
    </EnginePage>
  );
}

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  status: string;
  contentStatus: ContentStatus;
  updatedAt: string;
};

function EngineProducts() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    engineApi<{ items: ProductRow[] }>('products').then((result) => setItems(result.items)).catch((reason) => setError(reason.message));
  }, []);
  return (
    <EnginePage
      title="Products"
      eyebrow="CONTENT // SYSTEMS"
      description="Control product pages, visual assets, destinations, and redirect behavior."
      action={<Link className="engine-primary" to="/engine/products/new"><Plus size={16} />New product</Link>}
    >
      {error ? <EngineNotice>{error}</EngineNotice> : <EngineTable items={items} type="product" />}
    </EnginePage>
  );
}

function EngineTable({ items, type }: { items: Array<PostRow | ProductRow>; type: 'post' | 'product' }) {
  if (!items.length) return <EngineNotice>No records yet. Seed the Engine or create the first one.</EngineNotice>;
  return (
    <div className="engine-table">
      <div className="engine-table-head"><span>Name</span><span>State</span><span>Updated</span><span /></div>
      {items.map((item) => {
        const title = 'title' in item ? item.title : item.name;
        const status = 'contentStatus' in item ? item.contentStatus : item.status;
        return (
          <Link key={item.id} to={`/engine/${type === 'post' ? 'posts' : 'products'}/${item.id}`}>
            <span><strong>{title}</strong><small>/{item.slug}</small></span>
            <EngineStatus status={status} />
            <span>{new Date(item.updatedAt).toLocaleString()}</span>
            <ExternalLink size={16} />
          </Link>
        );
      })}
    </div>
  );
}

type PostEditorState = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTime: string;
  publishedAt: string | null;
  relatedProductSlugs: string[];
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  seoTitle: string;
  seoDescription: string;
  coverImage: string;
  contentStatus: ContentStatus;
};

const emptyPost: PostEditorState = {
  title: '',
  slug: '',
  excerpt: '',
  category: 'Field Notes',
  readingTime: '5 min',
  publishedAt: null,
  relatedProductSlugs: [],
  sections: [{ heading: 'New section', paragraphs: [''], bullets: [] }],
  seoTitle: '',
  seoDescription: '',
  coverImage: '',
  contentStatus: 'draft',
};

function EnginePostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostEditorState>(emptyPost);
  const [loading, setLoading] = useState(Boolean(id));
  const [saveState, setSaveState] = useState('Not saved');
  const [error, setError] = useState('');
  const lastAutosave = useRef('');

  useEffect(() => {
    if (!id) return;
    engineApi<{ item: Record<string, unknown> }>(`posts/${id}`)
      .then(({ item }) => {
        setPost({
          ...(item as unknown as PostEditorState),
          contentStatus: item.status as ContentStatus,
          coverImage: String(item.coverImage ?? ''),
          publishedAt: item.publishedAt ? new Date(String(item.publishedAt)).toISOString() : null,
        });
      })
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || loading) return;
    const serialized = JSON.stringify(post);
    if (!lastAutosave.current) {
      lastAutosave.current = serialized;
      return;
    }
    if (serialized === lastAutosave.current) return;
    setSaveState('Unsaved changes');
    const timer = window.setTimeout(() => {
      jsonMutation(`posts/${id}`, 'PUT', post)
        .then(() => {
          lastAutosave.current = serialized;
          setSaveState('Autosaved');
        })
        .catch(() => setSaveState('Autosave failed'));
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [id, loading, post]);

  const save = async (nextStatus = post.contentStatus) => {
    setSaveState('Saving…');
    setError('');
    try {
      const payload = { ...post, contentStatus: nextStatus };
      const result = id
        ? await jsonMutation<{ item: PostEditorState }>(`posts/${id}`, 'PUT', payload)
        : await jsonMutation<{ item: PostEditorState & { id: string } }>('posts', 'POST', payload);
      setPost({ ...post, ...result.item, contentStatus: nextStatus });
      setSaveState('Saved');
      if (!id && result.item.id) navigate(`/engine/posts/${result.item.id}`, { replace: true });
    } catch (reason) {
      setSaveState('Save failed');
      setError(reason instanceof Error ? reason.message : 'Unable to save');
    }
  };

  const action = async (name: 'publish' | 'unpublish' | 'archive') => {
    if (!id) {
      await save(name === 'publish' ? 'published' : name === 'archive' ? 'archived' : 'draft');
      return;
    }
    const result = await jsonMutation<{ item: { status: ContentStatus } }>(`posts/${id}/${name}`, 'POST');
    setPost((value) => ({ ...value, contentStatus: result.item.status }));
  };
  const duplicate = async () => {
    if (!id) return;
    const result = await jsonMutation<{ item: { id: string } }>(`posts/${id}/duplicate`, 'POST');
    navigate(`/engine/posts/${result.item.id}`);
  };

  if (loading) return <EngineLoading />;
  return (
    <EngineEditorShell
      back="/engine/posts"
      eyebrow="FIELD NOTE // EDITOR"
      title={post.title || 'Untitled note'}
      status={post.contentStatus}
      saveState={saveState}
      onSave={() => save()}
      actions={
        <>
          {post.contentStatus !== 'published' ? (
            <button type="button" className="engine-publish" onClick={() => action('publish')}><Check size={16} />Publish</button>
          ) : (
            <button type="button" onClick={() => action('unpublish')}>Unpublish</button>
          )}
          <button type="button" onClick={() => action('archive')}>Archive</button>
          {id && <button type="button" onClick={duplicate}>Duplicate</button>}
        </>
      }
    >
      {error && <EngineNotice>{error}</EngineNotice>}
      <div className="engine-editor-grid">
        <div className="engine-form-stack">
          <EnginePanel title="Editorial identity" label="01 // METADATA">
            <EngineField label="Title"><input value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} /></EngineField>
            <div className="engine-field-row">
              <EngineField label="Slug"><input value={post.slug} onChange={(e) => setPost({ ...post, slug: slugify(e.target.value) })} /></EngineField>
              <EngineField label="Category"><input value={post.category} onChange={(e) => setPost({ ...post, category: e.target.value })} /></EngineField>
            </div>
            <EngineField label="Excerpt"><textarea rows={3} value={post.excerpt} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} /></EngineField>
            <EngineField label="Related product slugs">
              <input value={post.relatedProductSlugs.join(', ')} onChange={(e) => setPost({ ...post, relatedProductSlugs: list(e.target.value) })} />
            </EngineField>
          </EnginePanel>
          <EnginePanel title="Structured article" label="02 // BLOCKS">
            <div className="engine-block-list">
              {post.sections.map((section, index) => (
                <article className="engine-block" key={`${index}-${section.heading}`}>
                  <div className="engine-block-tools">
                    <span>SECTION {String(index + 1).padStart(2, '0')}</span>
                    <button type="button" onClick={() => moveSection(post, setPost, index, -1)} disabled={index === 0}><ChevronUp /></button>
                    <button type="button" onClick={() => moveSection(post, setPost, index, 1)} disabled={index === post.sections.length - 1}><ChevronDown /></button>
                    <button type="button" onClick={() => setPost({ ...post, sections: post.sections.filter((_, i) => i !== index) })}><Trash2 /></button>
                  </div>
                  <EngineField label="Heading"><input value={section.heading} onChange={(e) => updateSection(post, setPost, index, { heading: e.target.value })} /></EngineField>
                  <EngineField label="Paragraphs — one per line">
                    <textarea rows={7} value={section.paragraphs.join('\n')} onChange={(e) => updateSection(post, setPost, index, { paragraphs: lines(e.target.value) })} />
                  </EngineField>
                  <EngineField label="Bullets — one per line">
                    <textarea rows={4} value={(section.bullets ?? []).join('\n')} onChange={(e) => updateSection(post, setPost, index, { bullets: lines(e.target.value) })} />
                  </EngineField>
                </article>
              ))}
            </div>
            <button className="engine-add-button" type="button" onClick={() => setPost({ ...post, sections: [...post.sections, { heading: 'New section', paragraphs: [''], bullets: [] }] })}>
              <Plus />Add section
            </button>
          </EnginePanel>
        </div>
        <aside className="engine-editor-aside">
          <EnginePanel title="Search preview" label="SEO">
            <EngineField label="SEO title"><input value={post.seoTitle} onChange={(e) => setPost({ ...post, seoTitle: e.target.value })} /><small>{post.seoTitle.length}/70</small></EngineField>
            <EngineField label="SEO description"><textarea rows={5} value={post.seoDescription} onChange={(e) => setPost({ ...post, seoDescription: e.target.value })} /><small>{post.seoDescription.length}/170</small></EngineField>
            <EngineField label="Cover image URL"><input value={post.coverImage} onChange={(e) => setPost({ ...post, coverImage: e.target.value })} /></EngineField>
            <EngineField label="Reading time"><input value={post.readingTime} onChange={(e) => setPost({ ...post, readingTime: e.target.value })} /></EngineField>
          </EnginePanel>
          {id && <Link className="engine-preview-link" to={`/engine/posts/${id}/preview`}><FileText />Preview current draft</Link>}
          {post.slug && <a className="engine-preview-link" href={`/blog/${post.slug}`} target="_blank" rel="noreferrer"><ExternalLink />Open public URL</a>}
          {id && <EngineRevisions type="posts" id={id} onRestore={(item) => setPost({ ...(item as unknown as PostEditorState), contentStatus: 'draft', coverImage: String((item as Record<string, unknown>).coverImage ?? '') })} />}
        </aside>
      </div>
    </EngineEditorShell>
  );
}

type ProductEditorState = typeof productFixtures[number] & {
  id?: string;
  contentStatus: ContentStatus;
  openInNewTab: boolean;
  sortOrder: number;
};

const emptyLink = { label: 'Coming soon', href: '#coming-soon', status: 'coming-soon' as const };
const emptyProduct: ProductEditorState = {
  slug: '',
  name: '',
  eyebrow: '',
  category: '',
  status: 'Draft',
  shortDescription: '',
  longDescription: '',
  logo: '/assets/oraik/oraik-mini-light.png',
  catalogImage: '',
  headerClassImage: '',
  heroImage: '',
  tags: [],
  features: [],
  audiences: [],
  workflow: [],
  principles: [],
  metrics: [],
  productSite: '',
  productSiteLabel: 'Open product',
  redirectToProductSite: false,
  ownership: 'oraik',
  links: { github: emptyLink, playStore: emptyLink, appStore: emptyLink, fdroid: emptyLink },
  featured: false,
  contentStatus: 'draft',
  openInNewTab: true,
  sortOrder: 0,
};

function EngineProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductEditorState>(emptyProduct);
  const [loading, setLoading] = useState(Boolean(id));
  const [saveState, setSaveState] = useState('Not saved');
  const [error, setError] = useState('');
  const lastAutosave = useRef('');
  useEffect(() => {
    if (!id) return;
    engineApi<{ item: ProductEditorState }>(`products/${id}`)
      .then(({ item }) => setProduct(item))
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || loading) return;
    const serialized = JSON.stringify(product);
    if (!lastAutosave.current) {
      lastAutosave.current = serialized;
      return;
    }
    if (serialized === lastAutosave.current) return;
    setSaveState('Unsaved changes');
    const timer = window.setTimeout(() => {
      jsonMutation(`products/${id}`, 'PUT', product)
        .then(() => {
          lastAutosave.current = serialized;
          setSaveState('Autosaved');
        })
        .catch(() => setSaveState('Autosave failed'));
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [id, loading, product]);

  const save = async (nextStatus = product.contentStatus) => {
    setSaveState('Saving…');
    try {
      const payload = { ...product, contentStatus: nextStatus };
      const result = id
        ? await jsonMutation<{ item: ProductEditorState }>(`products/${id}`, 'PUT', payload)
        : await jsonMutation<{ item: ProductEditorState & { id: string } }>('products', 'POST', payload);
      setProduct({ ...product, ...result.item, contentStatus: nextStatus });
      setSaveState('Saved');
      if (!id && result.item.id) navigate(`/engine/products/${result.item.id}`, { replace: true });
    } catch (reason) {
      setSaveState('Save failed');
      setError(reason instanceof Error ? reason.message : 'Unable to save');
    }
  };

  const action = async (name: 'publish' | 'unpublish' | 'archive') => {
    if (!id) return save(name === 'publish' ? 'published' : name === 'archive' ? 'archived' : 'draft');
    const result = await jsonMutation<{ item: { contentStatus: ContentStatus } }>(`products/${id}/${name}`, 'POST');
    setProduct((value) => ({ ...value, contentStatus: result.item.contentStatus }));
  };

  if (loading) return <EngineLoading />;
  return (
    <EngineEditorShell
      back="/engine/products"
      eyebrow="PRODUCT // EDITOR"
      title={product.name || 'Untitled product'}
      status={product.contentStatus}
      saveState={saveState}
      onSave={() => save()}
      actions={
        <>
          {product.contentStatus !== 'published' ? <button className="engine-publish" onClick={() => action('publish')}><Check />Publish</button> : <button onClick={() => action('unpublish')}>Unpublish</button>}
          <button onClick={() => action('archive')}>Archive</button>
        </>
      }
    >
      {error && <EngineNotice>{error}</EngineNotice>}
      <div className="engine-editor-grid">
        <div className="engine-form-stack">
          <EnginePanel title="Product identity" label="01 // CORE">
            <div className="engine-field-row">
              <EngineField label="Name"><input value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} /></EngineField>
              <EngineField label="Slug"><input value={product.slug} onChange={(e) => setProduct({ ...product, slug: slugify(e.target.value) })} /></EngineField>
            </div>
            <div className="engine-field-row">
              <EngineField label="Eyebrow"><input value={product.eyebrow} onChange={(e) => setProduct({ ...product, eyebrow: e.target.value })} /></EngineField>
              <EngineField label="Category"><input value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} /></EngineField>
            </div>
            <EngineField label="Product status"><input value={product.status} onChange={(e) => setProduct({ ...product, status: e.target.value })} /></EngineField>
            <EngineField label="Short description"><textarea rows={3} value={product.shortDescription} onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })} /></EngineField>
            <EngineField label="Long description"><textarea rows={7} value={product.longDescription} onChange={(e) => setProduct({ ...product, longDescription: e.target.value })} /></EngineField>
          </EnginePanel>
          <EnginePanel title="Capabilities" label="02 // CONTENT">
            <EngineListField label="Tags" value={product.tags} onChange={(tags) => setProduct({ ...product, tags })} />
            <EngineListField label="Features" value={product.features} onChange={(features) => setProduct({ ...product, features })} />
            <EngineListField label="Audiences" value={product.audiences ?? []} onChange={(audiences) => setProduct({ ...product, audiences })} />
            <EngineListField label="Principles" value={product.principles ?? []} onChange={(principles) => setProduct({ ...product, principles })} />
            <JsonField label="Workflow" value={product.workflow ?? []} onChange={(workflow) => setProduct({ ...product, workflow: workflow as ProductEditorState['workflow'] })} />
            <JsonField label="Metrics" value={product.metrics} onChange={(metrics) => setProduct({ ...product, metrics: metrics as ProductEditorState['metrics'] })} />
          </EnginePanel>
          <EnginePanel title="Destinations" label="03 // ROUTING">
            <EngineField label="Hosted product URL"><input value={product.productSite ?? ''} onChange={(e) => setProduct({ ...product, productSite: e.target.value })} placeholder="https://product.oraik.co" /></EngineField>
            <EngineField label="CTA label"><input value={product.productSiteLabel ?? ''} onChange={(e) => setProduct({ ...product, productSiteLabel: e.target.value })} /></EngineField>
            <div className="engine-toggle-grid">
              <EngineToggle label="Redirect internal page" checked={Boolean(product.redirectToProductSite)} onChange={(redirectToProductSite) => setProduct({ ...product, redirectToProductSite })} />
              <EngineToggle label="Open in a new tab" checked={product.openInNewTab} onChange={(openInNewTab) => setProduct({ ...product, openInNewTab })} />
              <EngineToggle label="Feature on homepage" checked={product.featured} onChange={(featured) => setProduct({ ...product, featured })} />
            </div>
            <JsonField label="Store and source links" value={product.links} onChange={(links) => setProduct({ ...product, links: links as ProductEditorState['links'] })} />
          </EnginePanel>
        </div>
        <aside className="engine-editor-aside">
          <EnginePanel title="Visual system" label="MEDIA">
            <EngineField label="Logo URL"><input value={product.logo} onChange={(e) => setProduct({ ...product, logo: e.target.value })} /></EngineField>
            <EngineField label="Catalog image"><input value={product.catalogImage ?? ''} onChange={(e) => setProduct({ ...product, catalogImage: e.target.value })} /></EngineField>
            <EngineField label="Header class artwork"><input value={product.headerClassImage ?? ''} onChange={(e) => setProduct({ ...product, headerClassImage: e.target.value })} placeholder="/assets/products/app-header-class.png" /></EngineField>
            <EngineField label="Hero image"><input value={product.heroImage ?? ''} onChange={(e) => setProduct({ ...product, heroImage: e.target.value })} /></EngineField>
            {product.logo && <img className="engine-product-logo" src={product.logo} alt="" />}
            <Link className="engine-preview-link" to="/engine/media"><FileImage />Open media library</Link>
          </EnginePanel>
          <EnginePanel title="Catalog control" label="ORDER">
            <EngineField label="Ownership">
              <select value={product.ownership ?? 'oraik'} onChange={(e) => setProduct({ ...product, ownership: e.target.value as 'oraik' | 'solo' })}>
                <option value="oraik">Oraik product</option><option value="solo">Solo project</option>
              </select>
            </EngineField>
            <EngineField label="Sort order"><input type="number" value={product.sortOrder} onChange={(e) => setProduct({ ...product, sortOrder: Number(e.target.value) })} /></EngineField>
          </EnginePanel>
          {product.slug && <a className="engine-preview-link" href={`/products/${product.slug}`} target="_blank" rel="noreferrer"><ExternalLink />Open public URL</a>}
          {id && <Link className="engine-preview-link" to={`/engine/products/${id}/preview`}><FileText />Preview current draft</Link>}
          {id && <EngineRevisions type="products" id={id} onRestore={(item) => setProduct({ ...(item as unknown as ProductEditorState), contentStatus: 'draft' })} />}
        </aside>
      </div>
    </EngineEditorShell>
  );
}

const pageFields: Record<string, Array<[string, string, 'text' | 'textarea' | 'list' | 'json']>> = {
  home: [
    ['eyebrow', 'Hero eyebrow', 'text'],
    ['headline', 'Hero headline', 'text'],
    ['introduction', 'Hero introduction', 'textarea'],
    ['primaryCtaLabel', 'Primary CTA label', 'text'],
    ['primaryCtaUrl', 'Primary CTA URL', 'text'],
    ['secondaryCtaLabel', 'Secondary CTA label', 'text'],
    ['secondaryCtaUrl', 'Secondary CTA URL', 'text'],
    ['services', 'Service labels', 'list'],
    ['portfolioHeading', 'Portfolio heading', 'text'],
    ['consultancyHeading', 'Consultancy heading', 'textarea'],
    ['fieldNotesHeading', 'Field Notes heading', 'text'],
    ['fieldNotesIntroduction', 'Field Notes introduction', 'textarea'],
  ],
  about: [
    ['eyebrow', 'Page eyebrow', 'text'],
    ['headline', 'Page headline', 'text'],
    ['introduction', 'Introduction', 'textarea'],
    ['serviceCards', 'Service cards', 'json'],
    ['leadership', 'Leadership entries', 'json'],
    ['approach', 'Approach cards', 'json'],
  ],
  resources: [
    ['eyebrow', 'Page eyebrow', 'text'],
    ['headline', 'Page headline', 'text'],
    ['introduction', 'Introduction', 'textarea'],
    ['fieldNotesHeading', 'Field Notes heading', 'text'],
    ['faq', 'FAQ entries', 'json'],
  ],
};

function EnginePageEditor() {
  const { key = 'home' } = useParams();
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [message, setMessage] = useState('');
  useEffect(() => {
    engineApi<{ item: { content: Record<string, unknown>; status: ContentStatus } }>(`pages/${key}`).then(({ item }) => {
      setContent(item.content ?? {});
      setStatus(item.status ?? 'draft');
    }).catch((reason) => setMessage(reason.message));
  }, [key]);
  const save = async (nextStatus = status) => {
    try {
      await jsonMutation(`pages/${key}`, 'PUT', { content, contentStatus: nextStatus });
      setStatus(nextStatus);
      setMessage('Saved');
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Save failed');
    }
  };
  return (
    <EnginePage
      title={`${key[0].toUpperCase()}${key.slice(1)} page`}
      eyebrow="PAGES // STRUCTURED CONTENT"
      description="Edit approved content regions without changing the responsive layout."
      action={<button className="engine-primary" onClick={() => save()}><Save />Save draft</button>}
    >
      <div className="engine-page-tabs">
        {['home', 'about', 'resources'].map((page) => <NavLink key={page} to={`/engine/pages/${page}`}>{page}</NavLink>)}
      </div>
      {message && <EngineNotice>{message}</EngineNotice>}
      <div className="engine-form-stack">
        <EnginePanel title="Editable regions" label={`${key.toUpperCase()} // CONTENT`}>
          {(pageFields[key] ?? []).map(([field, label, type]) => {
            const value = content[field];
            if (type === 'list') {
              return <EngineListField key={field} label={label} value={Array.isArray(value) ? value.map(String) : []} onChange={(next) => setContent({ ...content, [field]: next })} />;
            }
            if (type === 'json') {
              return <JsonField key={field} label={label} value={value ?? []} onChange={(next) => setContent({ ...content, [field]: next })} />;
            }
            return (
              <EngineField key={field} label={label}>
                {type === 'textarea' ? (
                  <textarea rows={field === 'introduction' ? 5 : 8} value={typeof value === 'string' ? value : value ? JSON.stringify(value, null, 2) : ''} onChange={(e) => setContent({ ...content, [field]: e.target.value })} />
                ) : (
                  <input value={String(value ?? '')} onChange={(e) => setContent({ ...content, [field]: e.target.value })} />
                )}
              </EngineField>
            );
          })}
        </EnginePanel>
        <div className="engine-publish-row">
          <EngineStatus status={status} />
          <button onClick={() => save('published')} className="engine-publish"><Check />Publish page</button>
          <a href={`/${key === 'home' ? '' : key}`} target="_blank" rel="noreferrer"><ExternalLink />View public page</a>
        </div>
      </div>
    </EnginePage>
  );
}

function EngineAccounts() {
  const [items, setItems] = useState<ConnectedAccount[]>([]);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    engineApi<{ items: ConnectedAccount[] }>('accounts').then((result) => setItems(result.items)).catch((reason) => setError(reason.message));
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const add = async () => {
    await jsonMutation('accounts', 'POST', { label: 'New link', url: 'https://', icon: 'link', placement: 'footer', active: false, sortOrder: items.length });
    load();
  };
  const save = async (item: ConnectedAccount) => {
    await jsonMutation(`accounts/${item.id}`, 'PUT', item);
    load();
  };
  const remove = async (id: string) => {
    await jsonMutation(`accounts/${id}`, 'DELETE');
    load();
  };
  return (
    <EnginePage title="Connected accounts" eyebrow="GLOBAL // PUBLIC LINKS" description="Manage public contact and social destinations." action={<button className="engine-primary" onClick={add}><Plus />Add account</button>}>
      {error && <EngineNotice>{error}</EngineNotice>}
      <div className="engine-account-list">
        {items.map((item, index) => (
          <article key={item.id} className="engine-panel engine-account-row">
            <span className="engine-account-index">{String(index + 1).padStart(2, '0')}</span>
            <EngineField label="Label"><input value={item.label} onChange={(e) => setItems(items.map((value) => value.id === item.id ? { ...value, label: e.target.value } : value))} /></EngineField>
            <EngineField label="URL"><input value={item.url} onChange={(e) => setItems(items.map((value) => value.id === item.id ? { ...value, url: e.target.value } : value))} /></EngineField>
            <EngineField label="Icon"><select value={item.icon} onChange={(e) => setItems(items.map((value) => value.id === item.id ? { ...value, icon: e.target.value as ConnectedAccount['icon'] } : value))}>{['x','github','linkedin','instagram','youtube','discord','whatsapp','email','link'].map((icon) => <option key={icon}>{icon}</option>)}</select></EngineField>
            <EngineField label="Placement"><select value={item.placement} onChange={(e) => setItems(items.map((value) => value.id === item.id ? { ...value, placement: e.target.value as ConnectedAccount['placement'] } : value))}><option value="footer">Footer</option><option value="header">Header</option><option value="both">Both</option></select></EngineField>
            <EngineToggle label="Active" checked={item.active} onChange={(active) => setItems(items.map((value) => value.id === item.id ? { ...value, active } : value))} />
            <button className="engine-icon-action" onClick={() => save(item)} aria-label={`Save ${item.label}`}><Save /></button>
            <button className="engine-icon-action danger" onClick={() => remove(item.id)} aria-label={`Delete ${item.label}`}><Trash2 /></button>
          </article>
        ))}
      </div>
      <EngineSettings />
    </EnginePage>
  );
}

function EngineSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [message, setMessage] = useState('');
  useEffect(() => {
    engineApi<{ item: SiteSettings | null }>('settings').then(({ item }) => item && setSettings(item)).catch(() => undefined);
  }, []);
  const save = async () => {
    await jsonMutation('settings', 'PUT', settings);
    setMessage('Global contact details saved');
  };
  return (
    <EnginePanel title="Company contact details" label="GLOBAL // FOOTER">
      <EngineField label="Company description"><textarea rows={4} value={settings.companyDescription} onChange={(e) => setSettings({ ...settings, companyDescription: e.target.value })} /></EngineField>
      <div className="engine-field-row">
        <EngineField label="Public email"><input value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} /></EngineField>
        <EngineField label="Phone display"><input value={settings.contactPhoneDisplay} onChange={(e) => setSettings({ ...settings, contactPhoneDisplay: e.target.value })} /></EngineField>
      </div>
      <EngineField label="Phone hyperlink"><input value={settings.contactPhoneHref} onChange={(e) => setSettings({ ...settings, contactPhoneHref: e.target.value })} /></EngineField>
      <EngineField label="Address"><textarea rows={4} value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} /></EngineField>
      <EngineField label="Copyright"><input value={settings.copyright} onChange={(e) => setSettings({ ...settings, copyright: e.target.value })} /></EngineField>
      <button className="engine-primary" onClick={save}><Save />Save global details</button>
      {message && <span className="engine-saved">{message}</span>}
    </EnginePanel>
  );
}

type MediaItem = { id: string; url: string; filename: string; altText: string; mimeType: string; size: number };

function EngineMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [altText, setAltText] = useState('');
  const [message, setMessage] = useState('');
  const load = useCallback(() => engineApi<{ items: MediaItem[] }>('media').then((result) => setItems(result.items)).catch((reason) => setMessage(reason.message)), []);
  useEffect(() => {
    void load();
  }, [load]);
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!altText.trim()) {
      setMessage('Add alt text before selecting a file.');
      event.target.value = '';
      return;
    }
    try {
      await engineApi('media', { method: 'POST', body: file, headers: { 'Content-Type': file.type, 'x-file-name': file.name, 'x-alt-text': altText } });
      setAltText('');
      setMessage('Upload complete');
      load();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Upload failed');
    }
  };
  const remove = async (id: string) => {
    try {
      await jsonMutation(`media/${id}`, 'DELETE');
      load();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Delete failed');
    }
  };
  return (
    <EnginePage title="Media library" eyebrow="ASSETS // RASTER ONLY" description="Authenticated PNG, JPEG, and WebP uploads up to 4 MB.">
      <section className="engine-upload">
        <Upload />
        <div><strong>Upload a verified image</strong><span>Scriptable SVG files are rejected.</span></div>
        <input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Required alt text" />
        <label className="engine-primary">Choose file<input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} hidden /></label>
      </section>
      {message && <EngineNotice>{message}</EngineNotice>}
      <div className="engine-media-grid">
        {items.map((item) => (
          <article key={item.id}>
            <img src={item.url} alt={item.altText} />
            <div><strong>{item.filename}</strong><span>{item.altText}</span><small>{Math.round(item.size / 1024)} KB // {item.mimeType}</small></div>
            <button onClick={() => navigator.clipboard.writeText(item.url)}>Copy URL</button>
            <button className="danger" onClick={() => remove(item.id)}><Trash2 /></button>
          </article>
        ))}
      </div>
    </EnginePage>
  );
}

type ActivityItem = { id: string; action: string; entityType?: string; entityId?: string; createdAt: string };

function EngineActivity() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  useEffect(() => { engineApi<{ items: ActivityItem[] }>('activity').then((result) => setItems(result.items)).catch(() => undefined); }, []);
  return (
    <EnginePage title="Activity" eyebrow="SECURITY // AUDIT" description="The latest authentication and publishing events.">
      <div className="engine-activity-list">
        {items.map((item) => <article key={item.id}><span>{new Date(item.createdAt).toLocaleString()}</span><strong>{item.action}</strong><small>{item.entityType ?? 'system'} {item.entityId ? `// ${item.entityId}` : ''}</small></article>)}
      </div>
    </EnginePage>
  );
}

function EngineRecordPreview({ type }: { type: 'post' | 'product' }) {
  const { id } = useParams();
  const [item, setItem] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!id) return;
    engineApi<{ item: Record<string, unknown> }>(`${type === 'post' ? 'posts' : 'products'}/${id}`)
      .then((result) => setItem(result.item))
      .catch((reason) => setError(reason.message));
  }, [id, type]);
  if (error) return <EngineNotice>{error}</EngineNotice>;
  if (!item) return <EngineLoading />;
  if (type === 'post') {
    const sections = Array.isArray(item.sections)
      ? item.sections as Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>
      : [];
    return (
      <article className="engine-private-preview">
        <div className="engine-preview-bar"><Link to={`/engine/posts/${id}`}><ArrowLeft />Back to editor</Link><span>PRIVATE DRAFT PREVIEW</span></div>
        <header><span>{String(item.category ?? '')}</span><h1>{String(item.title ?? 'Untitled')}</h1><p>{String(item.excerpt ?? '')}</p></header>
        <div className="engine-preview-body">
          {sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets?.length ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}</section>)}
        </div>
      </article>
    );
  }
  const features = Array.isArray(item.features) ? item.features.map(String) : [];
  return (
    <article className="engine-private-preview">
      <div className="engine-preview-bar"><Link to={`/engine/products/${id}`}><ArrowLeft />Back to editor</Link><span>PRIVATE PRODUCT PREVIEW</span></div>
      <header className="engine-product-preview"><img src={String(item.heroImage ?? item.catalogImage ?? item.logo ?? '')} alt="" /><div><span>{String(item.eyebrow ?? '')}</span><h1>{String(item.name ?? 'Untitled')}</h1><p>{String(item.longDescription ?? '')}</p></div></header>
      <div className="engine-preview-body"><h2>Capabilities</h2><ul>{features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
    </article>
  );
}

type RevisionItem = { id: string; action: string; createdAt: string };

function EngineRevisions({ type, id, onRestore }: { type: 'posts' | 'products'; id: string; onRestore: (item: unknown) => void }) {
  const [items, setItems] = useState<RevisionItem[]>([]);
  const [open, setOpen] = useState(false);
  const load = () => engineApi<{ items: RevisionItem[] }>(`${type}/${id}/revisions`).then((result) => setItems(result.items));
  const restore = async (revisionId: string) => {
    const result = await jsonMutation<{ item: unknown }>(`${type}/${id}/restore`, 'POST', { revisionId });
    onRestore(result.item);
    await load();
  };
  return (
    <section className="engine-revisions">
      <button type="button" onClick={() => { setOpen((value) => !value); if (!open) void load(); }}>
        <Activity />Revision history
      </button>
      {open && <div>{items.length ? items.slice(0, 12).map((item) => <article key={item.id}><span>{new Date(item.createdAt).toLocaleString()}</span><small>{item.action}</small><button type="button" onClick={() => restore(item.id)}>Restore as draft</button></article>) : <p>No revisions yet.</p>}</div>}
    </section>
  );
}

function EnginePage({ title, eyebrow, description, action, children }: { title: string; eyebrow: string; description: string; action?: ReactNode; children: ReactNode }) {
  return (
    <>
      <header className="engine-page-header">
        <div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
        {action}
      </header>
      {children}
    </>
  );
}

function EngineEditorShell({ back, eyebrow, title, status, saveState, onSave, actions, children }: { back: string; eyebrow: string; title: string; status: ContentStatus; saveState: string; onSave: () => void; actions: ReactNode; children: ReactNode }) {
  return (
    <>
      <header className="engine-editor-header">
        <Link to={back} aria-label="Back"><ArrowLeft /></Link>
        <div><span>{eyebrow}</span><h1>{title}</h1></div>
        <EngineStatus status={status} />
        <small>{saveState}</small>
        <button className="engine-primary" onClick={onSave}><Save />Save</button>
        <div className="engine-editor-actions">{actions}</div>
      </header>
      {children}
    </>
  );
}

function EnginePanel({ title, label, children }: { title: string; label: string; children: ReactNode }) {
  return <section className="engine-panel"><div className="engine-panel-heading"><div><span>{label}</span><h2>{title}</h2></div></div>{children}</section>;
}

function EngineField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="engine-field"><span>{label}</span>{children}</label>;
}

function EngineListField({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) {
  return <EngineField label={`${label} — one per line`}><textarea rows={Math.max(3, Math.min(9, value.length + 1))} value={value.join('\n')} onChange={(event) => onChange(lines(event.target.value))} /></EngineField>;
}

function JsonField({ label, value, onChange }: { label: string; value: unknown; onChange: (value: unknown) => void }) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [valid, setValid] = useState(true);
  useEffect(() => setText(JSON.stringify(value, null, 2)), [value]);
  return (
    <EngineField label={`${label} — structured JSON`}>
      <textarea className={valid ? 'engine-json' : 'engine-json is-invalid'} rows={10} value={text} onChange={(event) => {
        const next = event.target.value;
        setText(next);
        try { onChange(JSON.parse(next)); setValid(true); } catch { setValid(false); }
      }} />
      {!valid && <small className="engine-error">Fix the JSON before saving.</small>}
    </EngineField>
  );
}

function EngineToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="engine-toggle"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span /><strong>{label}</strong></label>;
}

function EngineStatus({ status }: { status: string }) {
  return <span className={`engine-status is-${status}`}>{status}</span>;
}

function EngineNotice({ children }: { children: ReactNode }) {
  return <div className="engine-notice">{children}</div>;
}

function EngineLoading() {
  return <div className="engine-loading">Loading Engine record…</div>;
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function lines(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function list(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function updateSection(post: PostEditorState, setPost: (post: PostEditorState) => void, index: number, patch: Partial<PostEditorState['sections'][number]>) {
  setPost({ ...post, sections: post.sections.map((section, i) => i === index ? { ...section, ...patch } : section) });
}

function moveSection(post: PostEditorState, setPost: (post: PostEditorState) => void, index: number, direction: number) {
  const target = index + direction;
  if (target < 0 || target >= post.sections.length) return;
  const sections = [...post.sections];
  [sections[index], sections[target]] = [sections[target], sections[index]];
  setPost({ ...post, sections });
}
