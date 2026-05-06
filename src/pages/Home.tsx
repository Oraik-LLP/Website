import { ArrowRight, Bot, CircuitBoard, Code2, Shield, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FixEaseSimulator } from '../components/FixEaseSimulator';
import { ProductCard } from '../components/ProductCard';
import { ProductSlideshow } from '../components/ProductSlideshow';
import { products } from '../data/products';

const services = [
  { label: 'Cybersecurity systems', icon: Shield },
  { label: 'AI and ML products', icon: Bot },
  { label: 'Mobile apps', icon: Smartphone },
  { label: 'IoT and IT solutions', icon: CircuitBoard },
];

export function Home() {
  const previewProducts = products.slice(0, 4);

  return (
    <>
      <section className="hero-section tech-grid">
        <div className="hero-copy">
          <span className="eyebrow">SYS.INIT // EST. 2026</span>
          <h1 className="typing-heading">Oraik builds sharp software systems for modern operators.</h1>
          <p>
            Software solutions, designs, mobile products, cybersecurity tools, AI/ML systems, IoT workflows, and
            practical IT consultancy from India.
          </p>
          <div className="hero-actions">
            <Link className="button-primary slash-hover" to="/products">
              Explore products
              <ArrowRight size={18} />
            </Link>
            <Link className="button-secondary slash-hover" to="/about">
              About Oraik
            </Link>
          </div>
          <div className="service-strip" aria-label="Oraik service areas">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <span key={service.label}>
                  <Icon size={16} />
                  {service.label}
                </span>
              );
            })}
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
          <h2>Built across apps, security, AI, and tools</h2>
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
          <h2>Design, maintain, and optimize systems that have to keep moving.</h2>
        </div>
        <div className="capability-list">
          <span>
            <Code2 size={18} />
            Software architecture
          </span>
          <span>
            <Shield size={18} />
            Security review
          </span>
          <span>
            <Bot size={18} />
            AI workflow design
          </span>
          <span>
            <CircuitBoard size={18} />
            IoT integration
          </span>
        </div>
      </section>
    </>
  );
}
