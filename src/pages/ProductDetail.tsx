import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { StoreBadges } from '../components/StoreBadges';
import { getProductBySlug } from '../data/products';

export function ProductDetail() {
  const { slug } = useParams();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  return (
    <section className="detail-page">
      <Link className="back-link" to="/products">
        <ArrowLeft size={17} />
        Back to products
      </Link>
      <div className="detail-hero tech-grid">
        <div className="detail-copy">
          <span className="eyebrow">{product.eyebrow}</span>
          <h1>{product.name}</h1>
          <p>{product.longDescription}</p>
          <StoreBadges links={product.links} />
        </div>
        <div className="detail-art">
          <img src={product.heroImage ?? product.logo} alt={`${product.name} product visual`} />
        </div>
      </div>

      <div className="detail-grid">
        <section>
          <h2>Capabilities</h2>
          <ul className="feature-list">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
        <aside>
          <h2>Readout</h2>
          <div className="metric-stack">
            {product.metrics.map((metric) => (
              <span key={metric.label}>
                <strong>{metric.value}</strong>
                {metric.label}
              </span>
            ))}
          </div>
          {product.links.github.status === 'available' && (
            <a className="button-secondary slash-hover" href={product.links.github.href} target="_blank" rel="noreferrer">
              View source
              <ExternalLink size={17} />
            </a>
          )}
        </aside>
      </div>
    </section>
  );
}
