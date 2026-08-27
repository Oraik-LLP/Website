import { ProductCard } from '../components/ProductCard';
import { Seo } from '../components/Seo';
import { useContent } from '../engine/ContentProvider';

export function Products() {
  const { products } = useContent();
  const oraikProducts = products.filter((product) => product.ownership !== 'solo');
  const soloProducts = products.filter((product) => product.ownership === 'solo');
  const oraikCategories = new Set(oraikProducts.map((product) => product.category)).size;

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
          <strong>{oraikProducts.filter((product) => product.featured).length}</strong>
          Active highlights
        </span>
        <span>
          <strong>{oraikCategories}</strong>
          Product lanes
        </span>
      </div>

      <section className="catalog-section" aria-labelledby="oraik-products-title">
        <div className="catalog-section-heading">
          <div>
            <span>01 // Oraik systems</span>
            <h2 id="oraik-products-title">Company products</h2>
          </div>
          <p>Every active Oraik product, including released systems, public builds, and products in development.</p>
        </div>
        <div className="product-mini-grid" aria-label="Oraik product catalog">
          {oraikProducts.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </section>

      {soloProducts.length > 0 && (
        <section className="solo-projects" aria-labelledby="solo-projects-title">
          <div className="catalog-section-heading">
            <div>
              <span>02 // Independent</span>
              <h2 id="solo-projects-title">Solo project</h2>
            </div>
            <p>Mark-it is built independently by a team member and is presented separately from Oraik’s company product line.</p>
          </div>
          <div className="product-mini-grid solo-product-grid" aria-label="Independent product catalog">
            {soloProducts.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
