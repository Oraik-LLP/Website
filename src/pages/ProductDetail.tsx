import { ArrowLeft, ArrowRight, ExternalLink, Gauge, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { Seo } from '../components/Seo';
import { StoreBadges } from '../components/StoreBadges';
import { useContent } from '../engine/ContentProvider';

export function ProductDetail() {
  const { slug } = useParams();
  const { products, posts, redirectFor } = useContent();
  const product = slug ? products.find((item) => item.slug === slug) : undefined;

  useEffect(() => {
    if (product?.redirectToProductSite && product.productSite) {
      window.location.replace(product.productSite);
    }
  }, [product]);

  if (!product) {
    const redirect = slug ? redirectFor(`/products/${slug}`) : undefined;
    if (redirect) return <Navigate to={redirect} replace />;
    return <Navigate to="/products" replace />;
  }

  if (product.redirectToProductSite && product.productSite) {
    return (
      <section className="redirect-page tech-grid">
        <Seo title={product.name} description={product.shortDescription} />
        <span className="eyebrow">External product system</span>
        <h1>Opening {product.name}</h1>
        <p>{product.longDescription}</p>
        <a className="button-primary slash-hover" href={product.productSite}>
          Continue to {product.name}
          <ExternalLink size={17} />
        </a>
      </section>
    );
  }

  const relatedPosts = posts.filter((post) => post.relatedProductSlugs.includes(product.slug));
  const workflow =
    product.workflow ??
    product.features.slice(0, 3).map((feature, index) => ({
      label: `${String(index + 1).padStart(2, '0')} // Capability`,
      title: feature,
      description: `A focused part of the ${product.name} workflow, designed to keep the experience direct and understandable.`,
    }));
  const audiences = product.audiences ?? [
    `${product.category} users`,
    'Early product adopters',
    'Teams looking for focused software',
  ];
  const principles = product.principles ?? ['Focused interface', 'Clear system state', 'Useful output without unnecessary steps'];

  return (
    <article className="detail-page">
      <Seo title={product.name} description={product.shortDescription} />
      <div className="detail-breadcrumb">
        <Link className="back-link" to="/products">
          <ArrowLeft size={17} />
          Product index
        </Link>
        <span>/</span>
        <span>{product.slug}</span>
      </div>

      <section className="detail-hero tech-grid">
        <div className="detail-copy">
          <div className="product-readout">
            <span>{product.category}</span>
            <span>{product.status}</span>
          </div>
          <span className="eyebrow">{product.eyebrow}</span>
          <h1>{product.name}</h1>
          <p>{product.longDescription}</p>
          <div className="detail-actions">
            {product.productSite && (
              <a
                className="button-primary slash-hover"
                href={product.productSite}
                target={product.openInNewTab === false ? undefined : '_blank'}
                rel={product.openInNewTab === false ? undefined : 'noreferrer'}
              >
                {product.productSiteLabel ?? 'Open product'}
                <ExternalLink size={17} />
              </a>
            )}
            <StoreBadges links={product.links} />
          </div>
          <div className="tag-row detail-tags">
            {product.tags.map((tag) => (
              <small key={tag}>{tag}</small>
            ))}
          </div>
        </div>
        <div className="detail-art">
          <div className="detail-art-frame">
            <span>ORAIK / PRODUCT SYSTEM</span>
            <img src={product.heroImage ?? product.catalogImage ?? product.logo} alt={`${product.name} product visual`} />
            <div className="detail-art-scan" />
          </div>
        </div>
      </section>

      <section className="metric-deck" aria-label={`${product.name} product readout`}>
        {product.metrics.map((metric) => (
          <div key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </section>

      <section className="product-story-grid">
        <div className="product-story-copy">
          <span className="eyebrow">01 // Mission</span>
          <h2>One focused system for a real-world job.</h2>
          <p>{product.shortDescription}</p>
          <div className="audience-block">
            <span>Built for</span>
            <ul>
              {audiences.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="capability-matrix">
          {product.features.map((feature, index) => (
            <div key={feature}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="workflow-section">
        <div className="section-heading">
          <span>02 // Operational flow</span>
          <h2>How {product.name} moves from input to useful output.</h2>
        </div>
        <div className="workflow-grid">
          {workflow.map((step) => (
            <div key={step.label} className="workflow-card">
              <span>{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <ArrowRight size={18} />
            </div>
          ))}
        </div>
      </section>

      <section className="principles-section">
        <div className="principles-intro">
          <span className="eyebrow">03 // System principles</span>
          <h2>Built to make the important boundary visible.</h2>
        </div>
        <div className="principle-grid">
          {principles.map((principle, index) => {
            const Icon = [ShieldCheck, Gauge, Layers3, Sparkles][index % 4];
            return (
              <div key={principle}>
                <Icon size={20} />
                <strong>{principle}</strong>
              </div>
            );
          })}
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="related-reading">
          <div className="section-heading">
            <span>04 // Product intelligence</span>
            <h2>Guides and field notes for {product.name}.</h2>
          </div>
          <div className="article-grid">
            {relatedPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <section className="product-cta tech-grid">
        <span className="eyebrow">Ready signal</span>
        <h2>Explore the product or talk to the team building it.</h2>
        <div>
          {product.productSite && (
            <a className="button-primary slash-hover" href={product.productSite} target={product.openInNewTab === false ? undefined : '_blank'} rel={product.openInNewTab === false ? undefined : 'noreferrer'}>
              {product.productSiteLabel ?? 'Open product'}
              <ExternalLink size={17} />
            </a>
          )}
          {product.links.github.status === 'available' && (
            <a
              className="button-secondary slash-hover"
              href={product.links.github.href}
              target="_blank"
              rel="noreferrer"
            >
              View source
              <ExternalLink size={17} />
            </a>
          )}
          <a className="button-secondary slash-hover" href="mailto:contact@oraik.co">
            Contact Oraik
            <ArrowRight size={17} />
          </a>
        </div>
      </section>
    </article>
  );
}
