// <ReactMarkdown className="...">{testo}</ReactMarkdown> dell'app web (react-markdown 9) → elementi
// nativi. Il testo è analizzato con marked (lexer) e reso con P/Span/Div come gli elementi HTML che
// produce react-markdown, con gli stili di base del preflight di Tailwind (nell'originale le classi
// `prose` non fanno nulla: il plugin typography non è installato):
//  - p, h1–h6, ul, ol, blockquote, pre senza margini, titoli con dimensione e peso ereditati;
//  - li senza pallino (salvo `list-disc`), strong in grassetto, em in corsivo, code monospazio;
// le varianti di classe della pagina si applicano agli elementi giusti:
//  `[&>p]:mb-2` (figlio diretto), `[&>ul>li]:ml-4` (catena di figli), `[&_li]:list-disc` (discendente),
//  `[&>*:first-child]:mt-0`, `[&>*:last-child]:mb-0`.
import { marked, type Token, type Tokens } from 'marked';
import { Fragment, useMemo, type ReactNode } from 'react';
import { Linking, View } from 'react-native';
import { cn } from './cn';
import { Div, P, Span } from './html';

type Rule = { chain: string[]; descendant: boolean; pseudo?: 'first-child' | 'last-child'; classes: string };

/** Separa le classi normali (sul contenitore) dalle varianti [&...]:classe. */
function parseClassName(className = ''): { base: string; rules: Rule[] } {
  const base: string[] = [];
  const rules: Rule[] = [];
  for (const tok of className.split(/\s+/).filter(Boolean)) {
    const m = tok.match(/^\[&([^\]]+)\]:(.+)$/);
    if (!m) { base.push(tok); continue; }
    const sel = m[1];
    const classes = m[2];
    if (sel.startsWith('_')) { rules.push({ chain: [sel.slice(1)], descendant: true, classes }); continue; }
    if (!sel.startsWith('>')) continue;
    const parts = sel.slice(1).split('>');
    const lastPart = parts[parts.length - 1];
    const pm = lastPart.match(/^(.*?):(first-child|last-child)$/);
    if (pm) parts[parts.length - 1] = pm[1];
    rules.push({ chain: parts, descendant: false, pseudo: pm?.[2] as Rule['pseudo'], classes });
  }
  return { base: base.join(' '), rules };
}

type Pos = { path: string[]; first: boolean; last: boolean };

function classesFor(rules: Rule[], tag: string, pos: Pos): string {
  const full = [...pos.path, tag];
  const out: string[] = [];
  for (const r of rules) {
    if (r.descendant) { if (r.chain[0] === tag) out.push(r.classes); continue; }
    if (r.chain.length !== full.length) continue;
    if (!r.chain.every((c, i) => c === '*' || c === full[i])) continue;
    if (r.pseudo === 'first-child' && !pos.first) continue;
    if (r.pseudo === 'last-child' && !pos.last) continue;
    out.push(r.classes);
  }
  return out.join(' ');
}

const HEADING = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

function renderInline(tokens: Token[] | undefined, rules: Rule[], path: string[]): ReactNode {
  if (!tokens) return null;
  return tokens.map((t, i) => {
    const pos = { path, first: i === 0, last: i === tokens.length - 1 };
    switch (t.type) {
      case 'strong':
        return <Span key={i} className={cn('font-bold', classesFor(rules, 'strong', pos))}>{renderInline((t as Tokens.Strong).tokens, rules, [...path, 'strong'])}</Span>;
      case 'em':
        return <Span key={i} className={cn('italic', classesFor(rules, 'em', pos))}>{renderInline((t as Tokens.Em).tokens, rules, [...path, 'em'])}</Span>;
      case 'del':
        return <Span key={i} className={cn('line-through', classesFor(rules, 'del', pos))}>{renderInline((t as Tokens.Del).tokens, rules, [...path, 'del'])}</Span>;
      case 'codespan':
        return <Span key={i} className={cn('font-mono', classesFor(rules, 'code', pos))}>{decode((t as Tokens.Codespan).text)}</Span>;
      case 'link': {
        const href = (t as Tokens.Link).href;
        return <Span key={i} className={classesFor(rules, 'a', pos)} onPress={() => { Linking.openURL(href).catch(() => {}); }}>{renderInline((t as Tokens.Link).tokens, rules, [...path, 'a'])}</Span>;
      }
      case 'br':
        return '\n';
      case 'text': {
        const tt = t as Tokens.Text;
        return tt.tokens ? <Fragment key={i}>{renderInline(tt.tokens, rules, path)}</Fragment> : decode(tt.text);
      }
      case 'escape':
        return (t as Tokens.Escape).text;
      default:
        return 'text' in t ? decode(String((t as { text: unknown }).text)) : null;
    }
  });
}

/** Entità HTML che marked lascia nel testo. */
function decode(s: string) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function renderBlocks(tokens: Token[], rules: Rule[], path: string[]): ReactNode {
  const blocks = tokens.filter((t) => t.type !== 'space');
  return blocks.map((t, i) => {
    const pos = { path, first: i === 0, last: i === blocks.length - 1 };
    switch (t.type) {
      case 'paragraph':
        return <P key={i} className={classesFor(rules, 'p', pos)}>{renderInline((t as Tokens.Paragraph).tokens, rules, [...path, 'p'])}</P>;
      case 'heading': {
        const tag = HEADING[(t as Tokens.Heading).depth - 1];
        return <P key={i} className={classesFor(rules, tag, pos)}>{renderInline((t as Tokens.Heading).tokens, rules, [...path, tag])}</P>;
      }
      case 'list': {
        const list = t as Tokens.List;
        const tag = list.ordered ? 'ol' : 'ul';
        return (
          <Div key={i} className={classesFor(rules, tag, pos)}>
            {list.items.map((item, j) => {
              const liPos = { path: [...path, tag], first: j === 0, last: j === list.items.length - 1 };
              const liClass = classesFor(rules, 'li', liPos);
              const disc = /(^|\s)list-disc(\s|$)/.test(liClass);
              const decimal = /(^|\s)list-decimal(\s|$)/.test(liClass);
              const marker = disc ? '•' : decimal ? `${(Number(list.start) || 1) + j}.` : null;
              // tight: il testo sta direttamente nel <li>; loose: paragrafi
              const inner = item.tokens.length === 1 && item.tokens[0].type === 'text'
                ? <P>{renderInline((item.tokens[0] as Tokens.Text).tokens ?? [item.tokens[0]], rules, [...path, tag, 'li'])}</P>
                : renderBlocks(item.tokens.map((x) => (x.type === 'text' ? { ...x, type: 'paragraph' } as Token : x)), rules, [...path, tag, 'li']);
              return (
                <Div key={j} className={liClass}>
                  {/* il pallino del list-item sta fuori dal contenuto, nel margine a sinistra */}
                  {marker && <View pointerEvents="none" style={{ position: 'absolute', left: -14, top: 0 }}><P>{marker}</P></View>}
                  {inner}
                </Div>
              );
            })}
          </Div>
        );
      }
      case 'blockquote':
        return <Div key={i} className={classesFor(rules, 'blockquote', pos)}>{renderBlocks((t as Tokens.Blockquote).tokens, rules, [...path, 'blockquote'])}</Div>;
      case 'code':
        return (
          <Div key={i} className={classesFor(rules, 'pre', pos)}>
            <P className={cn('font-mono', classesFor(rules, 'code', { path: [...path, 'pre'], first: true, last: true }))}>{(t as Tokens.Code).text}</P>
          </Div>
        );
      case 'hr':
        return <Div key={i} className={cn('border-t border-border', classesFor(rules, 'hr', pos))} />;
      case 'html':
        return <P key={i} className={classesFor(rules, 'p', pos)}>{(t as Tokens.HTML).text}</P>;
      case 'table': {
        const tb = t as Tokens.Table;
        return (
          <Div key={i} className={classesFor(rules, 'table', pos)}>
            {[tb.header, ...tb.rows].map((row, r) => (
              <Div key={r} className="flex flex-row">
                {row.map((cell, c) => <P key={c} className={cn('flex-1', r === 0 && 'font-bold')}>{renderInline(cell.tokens, rules, [...path, 'table'])}</P>)}
              </Div>
            ))}
          </Div>
        );
      }
      default:
        return 'text' in t ? <P key={i}>{decode(String((t as { text: unknown }).text))}</P> : null;
    }
  });
}

export default function ReactMarkdown({ children, className }: { children?: string | null; className?: string; components?: unknown; remarkPlugins?: unknown }) {
  const text = typeof children === 'string' ? children : '';
  const tokens = useMemo(() => marked.lexer(text), [text]);
  const { base, rules } = useMemo(() => parseClassName(className), [className]);
  return <Div className={base}>{renderBlocks(tokens, rules, [])}</Div>;
}
