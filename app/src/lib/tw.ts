// Classi colore Tailwind → colori React Native (per il codice che riceve classi come stringhe,
// es. rankingColor() o BADGE_META dell'app web).
import { themeColor } from '../ui/colors.ts';

/** "text-cyan-300" -> "#67e8f9"; "bg-yellow-500/15" -> "#eab30826". undefined se non riconosciuta. */
export function twColor(cls: string): string | undefined {
  const m = cls.match(/^(?:text|bg|border|fill|ring|from|to|via)-(.+)$/);
  return m ? themeColor(m[1]) : undefined;
}

/** Estrae { color, backgroundColor, borderColor } da una stringa di classi. */
export function twColors(classes: string) {
  const out: { color?: string; backgroundColor?: string; borderColor?: string } = {};
  for (const cls of classes.split(/\s+/)) {
    const c = twColor(cls);
    if (!c) continue;
    if (cls.startsWith('text-')) out.color = c;
    else if (cls.startsWith('bg-')) out.backgroundColor = c;
    else if (cls.startsWith('border-')) out.borderColor = c;
  }
  return out;
}
