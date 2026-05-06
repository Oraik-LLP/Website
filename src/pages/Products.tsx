import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';

export function Products() {
  return (
    <section className="page-section tech-grid">
      <div className="section-heading">
        <span>Products // Projects</span>
        <h1>Oraik product index</h1>
        <p>Scrollable launch catalog with detail pages, repo links, and store availability states.</p>
      </div>
      <div className="product-mini-grid" aria-label="Product catalog">
        {products.map((product, index) => (
          <ProductCard key={product.slug} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
