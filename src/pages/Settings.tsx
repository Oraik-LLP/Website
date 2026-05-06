import { Bell, Grid3X3, Gauge, Mail, Moon, MousePointer2, ShieldCheck, Sun, Zap } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

const preferenceGroups = [
  {
    title: 'Interface density',
    copy: 'Comfortable spacing for portfolio browsing, compact readouts for product scans.',
    icon: Gauge,
    options: ['Comfort', 'Compact'],
  },
  {
    title: 'Dynamic grid',
    copy: 'Animated page gridlines with a low-intensity scan pattern.',
    icon: Grid3X3,
    options: ['Active', 'Reduced'],
  },
  {
    title: 'Motion',
    copy: 'Hover wipes, phone scan pulses, and subtle card shifts.',
    icon: Zap,
    options: ['Standard', 'Reduced'],
  },
  {
    title: 'Contact shortcuts',
    copy: 'Keep GitHub, email, and social actions visible in the footer bar.',
    icon: Mail,
    options: ['Visible', 'Minimal'],
  },
];

export function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <section className="page-section settings-page">
      <div className="section-heading">
        <span>Settings</span>
        <h1>Theme control</h1>
        <p>Switch between Oraik dark mode and a clean tactical light mode. Your choice persists locally.</p>
      </div>
      <div className="settings-grid">
        <section className="settings-panel">
          <h2>Appearance</h2>
          <div className="theme-choice">
            <button
              className={theme === 'dark' ? 'theme-card is-active' : 'theme-card'}
              type="button"
              onClick={() => setTheme('dark')}
            >
              <Moon size={24} />
              <strong>Dark</strong>
              <span>Cobalt-on-charcoal cyberdeck mode.</span>
            </button>
            <button
              className={theme === 'light' ? 'theme-card is-active' : 'theme-card'}
              type="button"
              onClick={() => setTheme('light')}
            >
              <Sun size={24} />
              <strong>Light</strong>
              <span>White slate with restrained tactical gridlines.</span>
            </button>
          </div>
        </section>

        <section className="settings-panel">
          <h2>Preferences</h2>
          <div className="preference-list">
            {preferenceGroups.map((group) => {
              const Icon = group.icon;
              return (
                <article key={group.title} className="preference-row">
                  <Icon size={20} />
                  <div>
                    <strong>{group.title}</strong>
                    <p>{group.copy}</p>
                  </div>
                  <div className="segmented-control" aria-label={`${group.title} options`}>
                    {group.options.map((option, index) => (
                      <button key={option} className={index === 0 ? 'is-selected' : ''} type="button">
                        {option}
                      </button>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="settings-panel system-panel">
          <h2>System</h2>
          <div className="system-readouts">
            <span>
              <ShieldCheck size={18} />
              Local preferences
            </span>
            <span>
              <Bell size={18} />
              No notification hooks
            </span>
            <span>
              <MousePointer2 size={18} />
              Pointer-ready controls
            </span>
          </div>
        </section>
      </div>
    </section>
  );
}
