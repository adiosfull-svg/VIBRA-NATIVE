// Ereditarietà CSS delle proprietà di testo scritte in `style` (es. <p style={{ color }}><span>…):
// le classi di testo si ereditano già con TextClassContext, gli stili in linea con questo.
// Funzioni pure (usate da text.tsx e html.tsx, testate in textStyleInherit.test.ts).
export type TextStyle = Record<string, unknown>;

const KEYS = ['color', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textAlign', 'textTransform', 'textDecorationLine', 'fontVariant'] as const;

/** Classi di testo proprie → proprietà che sostituiscono quelle ereditate dallo style del contenitore. */
const CLASS_KEYS: [RegExp, string[]][] = [
  [/^text-(xs|sm|base|lg|xl|[2-9]xl|\[\d)/, ['fontSize', 'lineHeight']],
  [/^text-(left|center|right|justify|start|end)$/, ['textAlign']],
  [/^text-(?!(xs|sm|base|lg|xl|[2-9]xl|\[\d|left|center|right|justify|start|end|wrap|nowrap|balance|pretty|ellipsis|clip)\b)[a-z[#]/, ['color']],
  [/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[)/, ['fontWeight']],
  [/^(italic|not-italic)$/, ['fontStyle']],
  [/^leading-/, ['lineHeight']],
  [/^tracking-/, ['letterSpacing']],
  [/^(uppercase|lowercase|capitalize|normal-case)$/, ['textTransform']],
  [/^(underline|line-through|no-underline)$/, ['textDecorationLine']],
];

export function pickTextStyle(style: TextStyle | null | undefined): TextStyle {
  const out: TextStyle = {};
  if (!style) return out;
  for (const k of KEYS) if (style[k] != null) out[k] = style[k];
  return out;
}

/** Toglie dallo stile ereditato le proprietà che le classi proprie ridefiniscono (le classi proprie vincono). */
export function withoutClassOverrides(inherited: TextStyle, classes: string | undefined): TextStyle {
  if (!classes || !Object.keys(inherited).length) return inherited;
  let out = inherited;
  for (const c of classes.split(/\s+/)) {
    const base = c.replace(/^(?:[a-z0-9-]+:)+/, '');
    if (base !== c) continue; // varianti (hover:, sm:...) non contano
    for (const [re, keys] of CLASS_KEYS) {
      if (!re.test(base)) continue;
      for (const k of keys) if (k in out) { if (out === inherited) out = { ...inherited }; delete out[k]; }
    }
  }
  return out;
}

/** Contesto per i figli: ereditato (meno ciò che le classi proprie cambiano) + proprio style di testo. */
export function nextTextStyle(inherited: TextStyle, classes: string | undefined, ownStyle: TextStyle | null | undefined): TextStyle {
  const own = pickTextStyle(ownStyle);
  const base = withoutClassOverrides(inherited, classes);
  return Object.keys(own).length ? { ...base, ...own } : base;
}

const WEIGHTS: Record<string, string> = {
  '100': 'font-thin', '200': 'font-extralight', '300': 'font-light', '400': 'font-normal', normal: 'font-normal',
  '500': 'font-medium', '600': 'font-semibold', '700': 'font-bold', bold: 'font-bold', '800': 'font-extrabold', '900': 'font-black',
};
/** fontWeight di uno style → classe di peso (per scegliere il file del font Inter). */
export function weightClass(fontWeight: unknown): string | null {
  return fontWeight == null ? null : WEIGHTS[String(fontWeight)] ?? null;
}
