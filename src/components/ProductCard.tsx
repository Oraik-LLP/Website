import { ArrowUpRight } from 'lucide-react';
import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const content = (
    <>
      <div className="card-index">{String(index + 1).padStart(2, '0')}</div>
      <div className="product-art">
        <img src={product.logo} alt={`${product.name} logo`} />
      </div>
      <div className="product-card-body">
        <span>{product.eyebrow}</span>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <div className="tag-row">
          {product.tags.slice(0, 3).map((tag) => (
            <small key={tag}>{tag}</small>
          ))}
        </div>
      </div>
      <ArrowUpRight className="card-arrow" aria-hidden="true" size={20} />
    </>
  );

  if (product.redirectToProductSite && product.productSite) {
    return (
      <a
        className="product-card slash-hover"
        style={{ '--product-logo': `url("${product.logo}")` } as CSSProperties}
        href={product.productSite}
        target={product.openInNewTab === false ? undefined : '_blank'}
        rel={product.openInNewTab === false ? undefined : 'noreferrer'}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      className="product-card slash-hover"
      style={{ '--product-logo': `url("${product.logo}")` } as CSSProperties}
      to={`/products/${product.slug}`}
    >
      {content}
    </Link>
  );
}
