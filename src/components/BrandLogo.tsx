import { useTheme } from '../theme/ThemeProvider';

export function BrandLogo() {
  const { theme } = useTheme();
  const src = theme === 'dark' ? '/assets/oraik/oraik-mini-dark.png' : '/assets/oraik/oraik-mini-light.png';

  return <img src={src} alt="Oraik mini logo" />;
}
