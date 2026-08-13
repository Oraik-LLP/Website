import { Bot, Cpu, Shield, Wrench } from 'lucide-react';
import { useContent } from '../engine/ContentProvider';

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

const leaders = [
  {
    name: 'Manav Vivek Modi',
    title: 'Co-Founder & Designated Partner',
    copy: 'Driving technical architecture, local-first AI systems, and rapid venture building.',
  },
  {
    name: 'Masoom Monil Hathi',
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
  const { page } = useContent();
  const content = page('about');
  const runtimeCards = Array.isArray(content.serviceCards) ? content.serviceCards as typeof aboutCards : aboutCards;
  const runtimeLeaders = Array.isArray(content.leadership) ? content.leadership as typeof leaders : leaders;
  const runtimeApproach = Array.isArray(content.approach) ? content.approach as typeof approachPoints : approachPoints;
  return (
    <section className="page-section about-page tech-grid">
      <div className="section-heading">
        <span>{String(content.eyebrow ?? 'About // Oraik Systems')}</span>
        <h1>{String(content.headline ?? 'India-based builders for software, security, AI, and connected systems.')}</h1>
        <p>
          {String(content.introduction ?? 'Oraik Systems is a 2026 technology company designing, maintaining, and optimizing products across cybersecurity, AI/ML, IoT, IT, mobile apps, and custom system consultancy.')}
        </p>
      </div>
      <div className="about-cards">
        {runtimeCards.map((card, index) => {
          const Icon = [Cpu, Shield, Bot, Wrench][index % 4];
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
          {runtimeLeaders.map((leader) => (
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
          {runtimeApproach.map((point) => (
            <article key={point.title} className="approach-card slash-hover">
              <span>{point.title}</span>
              <p>{point.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
