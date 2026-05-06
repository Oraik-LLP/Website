import { Apple, Github, Play, Smartphone } from 'lucide-react';
import { ProductLink } from '../data/products';

const icons = {
  github: Github,
  playStore: Play,
  appStore: Apple,
  fdroid: Smartphone,
};

type StoreBadgesProps = {
  links: Record<keyof typeof icons, ProductLink>;
};

export function StoreBadges({ links }: StoreBadgesProps) {
  return (
    <div className="store-badges" aria-label="Product links">
      {Object.entries(links).map(([key, link]) => {
        const Icon = icons[key as keyof typeof icons];
        const content = (
          <>
            <Icon aria-hidden="true" size={16} />
            <span>{link.label}</span>
            {link.status === 'coming-soon' && <small>Coming soon</small>}
          </>
        );

        return link.status === 'available' ? (
          <a key={key} className="store-badge" href={link.href} target="_blank" rel="noreferrer">
            {content}
          </a>
        ) : (
          <span key={key} className="store-badge is-disabled">
            {content}
          </span>
        );
      })}
    </div>
  );
}
