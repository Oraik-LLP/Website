import { ArrowRight, Bot, CircuitBoard, Code2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { FixEaseSimulator } from '../components/FixEaseSimulator';
import { ProductCard } from '../components/ProductCard';
import { ProductSlideshow } from '../components/ProductSlideshow';
import { Seo } from '../components/Seo';
import { useContent } from '../engine/ContentProvider';

const services = [
  'Cybersecurity systems',
  'AI and ML products',
  'Mobile applications',
  'IoT and IT solutions',
];

export function Home() {
  const { posts: blogPosts, products, page } = useContent();
  const content = page('home');
  const pageServices = Array.isArray(content.services) ? content.services.map(String) : services;
  const previewProducts = products.filter((product) => product.ownership !== 'solo').slice(0, 4);

  return (
    <>
      <Seo
        title="Oraik Systems"
        description="Oraik Systems builds private AI, cybersecurity tools, mobile apps, document intelligence, and focused software products from Mumbai, India."
      />
      <section className="hero-section tech-grid">
        <div className="hero-copy">
          <span className="eyebrow">{String(content.eyebrow ?? 'INDEPENDENT PRODUCT SYSTEMS // MUMBAI')}</span>
          <h1 className="typing-heading">{String(content.headline ?? 'Ideas. Engineered')}</h1>
          <p>
            {String(
              content.introduction ??
                'Oraik builds focused products across private AI, cybersecurity, mobile utilities, automotive intelligence, and document workflows.',
            )}
          </p>
          <div className="hero-actions">
            <Link className="button-primary slash-hover" to={String(content.primaryCtaUrl ?? '/products')}>
              {String(content.primaryCtaLabel ?? 'Explore products')}
              <ArrowRight size={18} />
            </Link>
            <Link className="button-secondary slash-hover" to={String(content.secondaryCtaUrl ?? '/about')}>
              {String(content.secondaryCtaLabel ?? 'About Oraik')}
            </Link>
          </div>
          <div className="service-strip" aria-label="Oraik service areas">
            {pageServices.map((service, index) => (
              <span key={service}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                {service}
              </span>
            ))}
          </div>
          <div className="signal-rail" aria-hidden="true">
            <span>ORAIK // PRODUCT SYSTEMS // ACTIVE DEVELOPMENT // MUMBAI // </span>
            <span>ORAIK // PRODUCT SYSTEMS // ACTIVE DEVELOPMENT // MUMBAI // </span>
          </div>
        </div>
        <div className="simulator-demo-block">
          <span className="demo-caption">A demo from one of our apps</span>
          <FixEaseSimulator />
        </div>
      </section>

      <ProductSlideshow />

      <section className="section-shell about-preview">
        <div className="section-heading">
          <span>02 // Portfolio</span>
          <h2>{String(content.portfolioHeading ?? 'Built across apps, security, AI, and tools')}</h2>
        </div>
        <div className="product-grid">
          {previewProducts.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </section>

      <section className="section-shell capability-band">
        <div>
          <span className="eyebrow">03 // Consultancy</span>
          <h2>{String(content.consultancyHeading ?? 'Design, maintain, and optimize systems that have to keep moving.')}</h2>
        </div>
        <div className="capability-list" aria-label="Consultancy capabilities">
          {[
            { label: 'Software architecture', Icon: Code2 },
            { label: 'Security review', Icon: Shield },
            { label: 'AI workflow design', Icon: Bot },
            { label: 'IoT integration', Icon: CircuitBoard },
          ].map(({ label, Icon }, index) => (
            <div className="capability-readout" key={label}>
              <small>{String(index + 1).padStart(2, '0')}</small>
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell home-journal">
        <div className="section-heading">
          <span>04 // Field Notes</span>
          <h2>{String(content.fieldNotesHeading ?? 'The thinking behind the systems.')}</h2>
          <p>{String(content.fieldNotesIntroduction ?? 'Practical guides, product boundaries, and engineering notes connected directly to Oraik products.')}</p>
        </div>
        <div className="article-grid">
          {blogPosts.slice(0, 3).map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
        <Link className="text-link" to="/resources">
          Browse all field notes
          <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}
