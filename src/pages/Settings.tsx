import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

export function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <section className="page-section settings-page">
      <div className="section-heading">
        <span>Settings</span>
        <h1>Theme control</h1>
        <p>Switch between Oraik dark mode and a clean tactical light mode. Your choice persists locally.</p>
      </div>
      <section className="settings-panel theme-only-panel">
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
    </section>
  );
}
