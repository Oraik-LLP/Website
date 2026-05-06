import { Bot, Cpu, MapPin, Shield, Wrench } from 'lucide-react';

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
      <div className="contact-band">
        <MapPin size={20} />
        <span>India</span>
        <a href="mailto:contact@oraik.in">contact@oraik.in</a>
        <a href="https://github.com/Oraik-LLP" target="_blank" rel="noreferrer">
          github.com/Oraik-LLP
        </a>
      </div>
    </section>
  );
}
