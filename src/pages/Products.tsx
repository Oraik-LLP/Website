import { ProductCard } from '../components/ProductCard';
import { Seo } from '../components/Seo';
import { useContent } from '../engine/ContentProvider';

export function Products() {
  const { products } = useContent();
  const oraikProducts = products.filter((product) => product.ownership !== 'solo');
  const soloProducts = products.filter((product) => product.ownership === 'solo');

  return (
    <section className="page-section tech-grid">
      <Seo
        title="Products"
        description="Explore Oraik products across private AI, automotive diagnostics, cybersecurity, document intelligence, and mobile utilities."
      />
      <div className="section-heading">
        <span>Products // Active systems</span>
        <h1>Not a portfolio. A growing product network.</h1>
        <p>
          Shipped tools, public-source systems, and active product experiments—each with a clear job, operating
          boundary, and path to the real product.
        </p>
      </div>
      <div className="catalog-readout">
        <span>
          <strong>{oraikProducts.length}</strong>
          Systems tracked
        </span>
        <span>
          <strong>{products.filter((product) => product.featured).length}</strong>
          Active highlights
        </span>
        <span>
          <strong>{new Set(products.map((product) => product.category)).size}</strong>
          Product lanes
        </span>
      </div>
      <div className="product-mini-grid" aria-label="Product catalog">
        {oraikProducts.map((product, index) => (
          <ProductCard key={product.slug} product={product} index={index} />
        ))}
      </div>
      {soloProducts.length > 0 && (
        <section className="solo-projects" aria-labelledby="solo-projects-title">
          <div className="section-heading compact-heading">
            <span>Independent // Solo work</span>
            <h2 id="solo-projects-title">Built independently by a team member.</h2>
            <p>Separate from Oraik’s company product line, shown here as individual maker work.</p>
          </div>
          <div className="product-mini-grid solo-product-grid">
            {soloProducts.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
