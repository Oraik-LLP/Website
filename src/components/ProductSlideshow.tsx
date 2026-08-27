import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../engine/ContentProvider';

export function ProductSlideshow() {
  const { products } = useContent();
  const featuredProducts = products.filter((product) => product.featured && product.ownership !== 'solo');
  const [activeIndex, setActiveIndex] = useState(0);
  const product = featuredProducts[activeIndex] ?? featuredProducts[0];
  if (!product) return null;
  const headerClassImage = product.headerClassImage ?? product.catalogImage ?? product.logo;

  const move = (direction: number) => {
    setActiveIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0) {
        return featuredProducts.length - 1;
      }
      if (nextIndex >= featuredProducts.length) {
        return 0;
      }
      return nextIndex;
    });
  };

  return (
    <section className="slideshow-section section-shell" aria-label="Featured product slideshow">
      <div className="section-heading">
        <span>01 // Product Slideshow</span>
        <h2>Overview</h2>
      </div>
      <div className="slideshow-panel">
        <div className="slide-copy">
          <span>{product.eyebrow}</span>
          <h3>{product.name}</h3>
          <p>{product.longDescription}</p>
          {product.redirectToProductSite && product.productSite ? (
            <a className="button-primary slash-hover" href={product.productSite} target={product.openInNewTab === false ? undefined : '_blank'} rel={product.openInNewTab === false ? undefined : 'noreferrer'}>
              Open product
              <ArrowRight size={18} />
            </a>
          ) : (
            <Link className="button-primary slash-hover" to={`/products/${product.slug}`}>
              Open product
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
        {product.redirectToProductSite && product.productSite ? (
          <a className="slide-visual" href={product.productSite} target={product.openInNewTab === false ? undefined : '_blank'} rel={product.openInNewTab === false ? undefined : 'noreferrer'}>
            <img className="header-class-icon" data-asset-role="header_class" src={headerClassImage} alt={`${product.name} header artwork`} />
            <div className="slide-metrics">
              {product.metrics.map((metric) => (
                <span key={metric.label}>
                  <strong>{metric.value}</strong>
                  {metric.label}
                </span>
              ))}
            </div>
          </a>
        ) : (
          <Link className="slide-visual" to={`/products/${product.slug}`}>
          <img className="header-class-icon" data-asset-role="header_class" src={headerClassImage} alt={`${product.name} header artwork`} />
          <div className="slide-metrics">
            {product.metrics.map((metric) => (
              <span key={metric.label}>
                <strong>{metric.value}</strong>
                {metric.label}
              </span>
            ))}
          </div>
          </Link>
        )}
        <div className="slide-controls">
          <button className="icon-button" type="button" aria-label="Previous product" onClick={() => move(-1)}>
            <ArrowLeft size={18} />
          </button>
          <span>
            {activeIndex + 1}/{featuredProducts.length}
          </span>
          <button className="icon-button" type="button" aria-label="Next product" onClick={() => move(1)}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
