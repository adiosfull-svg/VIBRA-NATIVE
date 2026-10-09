// Rende il piccolo sottoinsieme di HTML usato nei messaggi (dangerouslySetInnerHTML nell'originale):
// <b>/<strong>, <i>/<em>, <br>, entità comuni; gli altri tag vengono rimossi.
import { Fragment } from 'react';
import { Text } from './text';

const ENTITIES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };

export function HtmlText({ html, className, numberOfLines }: { html?: string | null; className?: string; numberOfLines?: number }) {
  const src = String(html ?? '').replace(/<br\s*\/?>/gi, '\n');
  const parts: { text: string; bold: boolean; italic: boolean }[] = [];
  let bold = 0;
  let italic = 0;
  for (const token of src.split(/(<\/?[a-z][^>]*>)/i)) {
    const tag = token.match(/^<(\/?)([a-z]+)/i);
    if (tag) {
      const close = tag[1] === '/';
      const name = tag[2].toLowerCase();
      if (name === 'b' || name === 'strong') bold += close ? -1 : 1;
      if (name === 'i' || name === 'em') italic += close ? -1 : 1;
      continue;
    }
    if (token) parts.push({ text: token.replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e), bold: bold > 0, italic: italic > 0 });
  }
  return (
    <Text className={className} numberOfLines={numberOfLines}>
      {parts.map((p, i) => (p.bold || p.italic ? (
        <Text key={i} className={`${p.bold ? 'font-bold' : ''} ${p.italic ? 'italic' : ''}`}>{p.text}</Text>
      ) : <Fragment key={i}>{p.text}</Fragment>))}
    </Text>
  );
}
