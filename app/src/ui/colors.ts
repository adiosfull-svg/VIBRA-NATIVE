// Risolve un nome colore Tailwind ("violet-500/30", "primary/20", "card", "white/10",
// "[#a78bfa]") in un colore #rrggbb[aa] utilizzabile da React Native.
import { PALETTE, THEME } from './palette.generated.ts';

const NAMED: Record<string, string> = { white: '#ffffff', black: '#000000', transparent: '#00000000' };

function withAlpha(hex: string, alphaPct?: string) {
  if (!alphaPct) return hex;
  const a = Math.round(Math.min(100, Number(alphaPct)) / 100 * 255);
  return hex.slice(0, 7) + a.toString(16).padStart(2, '0');
}

export function themeColor(name: string): string | undefined {
  const m = name.match(/^(.+?)(?:\/(\d{1,3}))?$/);
  if (!m) return undefined;
  const [, base, alpha] = m;
  if (base === 'transparent') return 'transparent';
  const arb = base.match(/^\[(#[0-9a-fA-F]{6})\]$/);
  if (arb) return withAlpha(arb[1].toLowerCase(), alpha);
  if (NAMED[base]) return withAlpha(NAMED[base], alpha);
  if (THEME[base]) return withAlpha(THEME[base], alpha);
  const fam = base.match(/^([a-z]+)-(\d{2,3})$/);
  const hex = fam && PALETTE[fam[1]]?.[fam[2]];
  return hex ? withAlpha(hex, alpha) : undefined;
}
