import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../data/products';

const featuredProducts = getFeaturedProducts();

export function ProductSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const product = featuredProducts[activeIndex];
  const catalogImage = product.catalogImage ?? product.logo;

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
          <Link className="button-primary slash-hover" to={`/products/${product.slug}`}>
            Open product
            <ArrowRight size={18} />
          </Link>
        </div>
        <Link className="slide-visual" to={`/products/${product.slug}`}>
          <img src={catalogImage} alt={`${product.name} preview`} />
          <div className="slide-metrics">
            {product.metrics.map((metric) => (
              <span key={metric.label}>
                <strong>{metric.value}</strong>
                {metric.label}
              </span>
            ))}
          </div>
        </Link>
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
