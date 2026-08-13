import {
  ArrowUpRight,
  Cpu,
  Github,
  Instagram,
  Linkedin,
  Link2,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
  Youtube,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ThemeToggle } from '../theme/ThemeProvider';
import { BrandLogo } from './BrandLogo';
import { useContent } from '../engine/ContentProvider';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
];

const accountIcons = {
  x: X,
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  discord: MessageCircle,
  whatsapp: MessageCircle,
  email: Mail,
  link: Link2,
};

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { settings, accounts } = useContent();
  const footerAccounts = accounts.filter((account) => account.active && ['footer', 'both'].includes(account.placement));
  const headerAccounts = accounts.filter((account) => account.active && ['header', 'both'].includes(account.placement));

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand-lockup" to="/" onClick={() => setMenuOpen(false)}>
          <BrandLogo />
          <span>Oraik Systems</span>
        </NavLink>
        <nav className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          {headerAccounts.map((account) => {
            const Icon = accountIcons[account.icon] ?? Link2;
            return (
              <a className="icon-button engine-managed-link" key={account.id} href={account.url} aria-label={account.label}>
                <Icon size={16} />
              </a>
            );
          })}
          <ThemeToggle />
          <a className="header-contact" href={`mailto:${settings.contactEmail}`}>
            Start a project
            <ArrowUpRight size={16} />
          </a>
          <button
            className="icon-button menu-button"
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-overview">
          <div className="footer-brand">
            <Cpu size={22} />
            <strong>Oraik Systems LLP</strong>
          </div>
          <p>{settings.companyDescription}</p>
          <div className="footer-socials">
            {footerAccounts.map((item) => {
              const Icon = accountIcons[item.icon] ?? Link2;
              return (
                <a
                  key={item.id}
                  className="social-wordmark"
                  href={item.url}
                  target={item.url.startsWith('http') ? '_blank' : undefined}
                  rel={item.url.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <Icon size={16} />
                  {item.label}
                </a>
              );
            })}
          </div>
          <small>{settings.copyright}</small>
        </div>
        <div className="footer-link-grid">
          <div>
            <strong>Products</strong>
            <a href="https://fixease.oraik.co">FixEase</a>
            <a href="https://phos.oraik.co">Phos</a>
            <NavLink to="/products/get-true-charge">GetTrueCharge</NavLink>
            <NavLink to="/products">All products</NavLink>
          </div>
          <div>
            <strong>Resources</strong>
            <NavLink to="/resources">Field Notes & FAQ</NavLink>
            <NavLink to="/about">About Oraik</NavLink>
            <a href="https://github.com/Oraik-LLP" target="_blank" rel="noreferrer">
              Open source
            </a>
            <a href="mailto:contact@oraik.co">Contact</a>
          </div>
        </div>
        <div className="footer-contact">
          <span>
            <MapPin size={16} />
            {settings.address}
          </span>
          <a href={`mailto:${settings.contactEmail}`}>
            <Mail size={16} />
            {settings.contactEmail}
          </a>
          <a href={settings.contactPhoneHref}>
            <Phone size={16} />
            {settings.contactPhoneDisplay}
          </a>
        </div>
      </footer>
    </div>
  );
}
