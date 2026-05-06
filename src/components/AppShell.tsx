import { Cpu, Github, Instagram, Linkedin, Mail, MapPin, Menu, Phone, Settings, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ThemeToggle } from '../theme/ThemeProvider';
import { BrandLogo } from './BrandLogo';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Settings', href: '/settings' },
];

const socialItems = [
  { label: 'GitHub', href: 'https://github.com/Oraik-LLP', icon: Github },
  { label: 'LinkedIn', href: '#linkedin', icon: Linkedin },
  { label: 'Instagram', href: '#instagram', icon: Instagram },
  { label: 'Email', href: 'mailto:contact@oraik.co', icon: Mail },
];

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <ThemeToggle />
          <NavLink className="icon-button" to="/settings" aria-label="Open settings">
            <Settings size={18} />
          </NavLink>
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
      </footer>
    </div>
  );
}
