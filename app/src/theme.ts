// Colori presi dalle variabili CSS di src/index.css dell'app Base44 (tema scuro unico).
export const colors = {
  background: '#09090b', // 240 10% 3.9%
  foreground: '#f2f2f2', // 0 0% 95%
  card: '#131316', // 240 6% 8%
  primary: '#561a8e', // 271 69% 33%
  primaryForeground: '#ffffff',
  secondary: '#222225', // 240 5% 14%
  muted: '#222225',
  mutedForeground: '#878792', // 240 5% 55%
  accent: '#341f47', // 271 40% 20%
  accentForeground: '#cdadeb', // 271 60% 80%
  destructive: '#dc2828', // 0 72% 51%
  border: '#2c2c30', // 240 5% 18%
  gold: '#facc15',
  success: '#34d399',
  chart: ['#561a8e', '#269dd9', '#2eb873', '#e8ab30', '#d74273'],
} as const;

export const radius = { sm: 8, md: 12, lg: 16, full: 999 } as const;
export const space = (n: number) => n * 4;
