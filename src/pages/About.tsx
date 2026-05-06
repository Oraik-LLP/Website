import { Bot, Cpu, Github, Instagram, Linkedin, Mail, MapPin, Phone, Shield, Wrench } from 'lucide-react';

const aboutCards = [
  {
    title: 'Design',
    copy: 'Product design, interface systems, and practical software architecture for web and mobile.',
    icon: Cpu,
  },
  {
    title: 'Secure',
    copy: 'Cybersecurity tooling, review workflows, attack-surface thinking, and system hardening.',
    icon: Shield,
  },
  {
    title: 'Automate',
    copy: 'AI/ML assistants, IoT integrations, data-heavy workflows, and operational software.',
    icon: Bot,
  },
  {
    title: 'Maintain',
    copy: 'Optimization, modernization, reliability work, and long-term technical consultancy.',
    icon: Wrench,
  },
];

const socialItems = [
  { label: 'GitHub', href: 'https://github.com/Oraik-LLP', icon: Github },
  { label: 'LinkedIn', href: '#linkedin', icon: Linkedin },
  { label: 'Instagram', href: '#instagram', icon: Instagram },
  { label: 'Email', href: 'mailto:contact@oraik.co', icon: Mail },
];

const leaders = [
  {
    name: 'Manav Vivek Modi',
    title: 'Co-Founder & Designated Partner',
    copy: 'Driving technical architecture, local-first AI systems, and rapid venture building.',
  },
  {
    name: 'Masoom Hathi',
    title: 'Co-Founder & Designated Partner',
    copy: 'Leading operational strategy, business development, and system scaling for high-volume deployment.',
  },
];

const approachPoints = [
  {
    title: 'Privacy by Design',
    copy: 'Prioritizing local-first software architecture and on-device processing to guarantee data security and user control from the ground up.',
  },
  {
    title: 'Rapid Deployment',
    copy: 'Utilizing a venture-builder model to aggressively prototype, validate, and ship robust, production-ready systems at scale.',
  },
];

export function About() {
  return (
    <section className="page-section about-page tech-grid">
      <div className="section-heading">
        <span>About // Oraik Systems</span>
        <h1>India-based builders for software, security, AI, and connected systems.</h1>
        <p>
          Oraik Systems is a 2026 technology company designing, maintaining, and optimizing products across
          cybersecurity, AI/ML, IoT, IT, mobile apps, and custom system consultancy.
        </p>
      </div>
      <div className="about-cards">
        {aboutCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="about-card slash-hover">
              <Icon size={24} />
              <h2>{card.title}</h2>
              <p>{card.copy}</p>
            </article>
          );
        })}
      </div>
      <section className="about-split-section">
        <div className="section-heading compact-heading">
          <span>Management // Leadership</span>
          <h2>Leadership & Philosophy</h2>
        </div>
        <div className="leadership-grid">
          {leaders.map((leader) => (
            <article key={leader.name} className="leadership-card slash-hover">
              <span>Designated Partner</span>
              <h3>{leader.name}</h3>
              <strong>{leader.title}</strong>
              <p>{leader.copy}</p>
            </article>
          ))}
        </div>
        <div className="section-heading compact-heading">
          <span>Operating Model // Approach</span>
          <h2>Our Approach</h2>
        </div>
        <div className="approach-grid">
          {approachPoints.map((point) => (
            <article key={point.title} className="approach-card slash-hover">
              <span>{point.title}</span>
              <p>{point.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="about-contact-panel">
        <div>
          <div className="footer-brand">
            <Cpu size={22} />
            <strong>Oraik Systems LLP</strong>
          </div>
          <p>Software solutions, product design, apps, AI/ML, cybersecurity, IoT, and IT consultancy.</p>
          <div className="footer-contact">
            <span>
              <MapPin size={16} />
              1405, Siddhesh Apartment, Thakurdwar, Kalbadevi, L.T. Marg Police Station, Mumbai, Mumbai- 400002, Maharashtra, India
            </span>
            <a href="mailto:contact@oraik.co">
              <Mail size={16} />
              contact@oraik.co
            </a>
            <a href="tel:+917400354911">
              <Phone size={16} />
              7400354911
            </a>
          </div>
          <small>Est. 2026 // Oraik Systems LLP</small>
        </div>
        <div className="footer-socials">
          {socialItems.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.label} className="icon-button" href={item.href} aria-label={item.label}>
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      </section>
    </section>
  );
}
