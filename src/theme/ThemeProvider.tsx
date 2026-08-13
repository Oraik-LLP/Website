import { Moon, Sun } from 'lucide-react';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'dark' | 'light';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const storageKey = 'oraik-theme';
const themeColors: Record<Theme, string> = {
  dark: '#090a0b',
  light: '#e9edf2',
};

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const storedTheme = window.localStorage.getItem(storageKey);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.className = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(storageKey, theme);

    let runtimeThemeColor = document.head.querySelector<HTMLMetaElement>('meta[data-runtime-theme]');
    if (!runtimeThemeColor) {
      runtimeThemeColor = document.createElement('meta');
      runtimeThemeColor.name = 'theme-color';
      runtimeThemeColor.dataset.runtimeTheme = 'true';
      document.head.appendChild(runtimeThemeColor);
    }
    runtimeThemeColor.content = themeColors[theme];
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === 'light'}
      className="icon-button theme-toggle"
      data-theme={theme}
      title={`Use ${nextTheme} theme`}
      type="button"
      onClick={toggleTheme}
    >
      <Icon aria-hidden="true" size={18} />
    </button>
  );
}
