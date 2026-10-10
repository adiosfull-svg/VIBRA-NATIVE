// Converte un componente React web dell'app Base44 nell'equivalente React Native mantenendo
// codice, logica, testi e classi identici. Trasformazioni meccaniche:
//  - tag HTML → primitive native (app/src/ui/html.tsx, elements.tsx)
//  - import → moduli compatibili (base44, router, auth, ui, utils copiate)
//  - attributi/eventi solo-web → rimossi o tradotti; le API del browser segnalate con PORT-TODO
// Uso: node scripts/port/codemod.mjs <file-originale> <file-destinazione> [--src <radice-src-originale>]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import * as babel from '@babel/parser';
import * as recast from 'recast';

const b = recast.types.builders;
const parser = { parse: (s) => babel.parse(s, { sourceType: 'module', plugins: ['jsx'], tokens: true }) };

// ── mappe ────────────────────────────────────────────────────────────────────
/** Tag HTML in una stringa usata come componente → primitiva equivalente (come per <tag>). */
function dynamicTag(tag) {
  if (BOX.has(tag)) return 'Div';
  if (tag === 'button') return 'Btn';
  if (['span', 'label', 'strong', 'em', 'small', 'b', 'i'].includes(tag)) return 'Span';
  if (tag === 'p') return 'P';
  if (/^h[1-6]$/.test(tag)) return 'H';
  return null;
}

const BOX = new Set(['div', 'section', 'header', 'footer', 'nav', 'main', 'aside', 'ul', 'ol', 'li', 'figure', 'article', 'fieldset']);
const TEXT = { span: 'Span', p: 'P', small: 'Span', code: 'Span', pre: 'Span', b: 'Span', strong: 'Span', em: 'Span', i: 'Span', h1: 'H', h2: 'H', h3: 'H', h4: 'H', h5: 'H', h6: 'H' };
const TEXT_EXTRA = { b: 'font-bold', strong: 'font-bold', em: 'italic', i: 'italic', code: 'font-mono', pre: 'font-mono' };
const ELEMENTS = {
  img: 'Img', a: 'A', table: 'Table', thead: 'Thead', tbody: 'Tbody', tfoot: 'Tfoot', tr: 'Tr', td: 'Td', th: 'Th',
  form: 'Form', input: 'HtmlInput', textarea: 'HtmlTextarea', select: 'HtmlSelect', option: 'HtmlOption', hr: 'Hr', label: 'Label',
  svg: 'Svg', path: 'Path', circle: 'Circle', rect: 'Rect', line: 'Line', g: 'G', defs: 'Defs', stop: 'Stop',
  linearGradient: 'SvgLinearGradient', text: 'SvgText', polygon: 'Polygon', polyline: 'Polyline', foreignObject: 'ForeignObject',
};
const DROP_ATTR = /^(data-.*|aria-hidden|aria-expanded|aria-busy|aria-describedby|role|tabIndex|id|draggable|htmlFor|crossOrigin|decoding|xmlns|suppressContentEditableWarning|contentEditable|onContextMenu|onDragStart|onLostPointerCapture|onPointerDownCapture|toast-close)$/;
const SVG_ID_TAGS = new Set(['linearGradient', 'radialGradient', 'clipPath', 'pattern', 'mask', 'filter', 'symbol', 'path', 'g']);
const GESTURE_ATTR = /^on(Mouse|Pointer|Touch)\w*$|^onWheel$/;

const UI_MAP = {
  button: 'button', card: 'card', badge: 'badge', input: 'input', textarea: 'input', dialog: 'dialog',
  'alert-dialog': 'dialog', 'dropdown-menu': 'menu', select: 'menu', popover: 'menu', tabs: 'menu', switch: 'menu',
  tooltip: 'menu', slider: 'menu', progress: 'misc', skeleton: 'misc', label: 'misc',
};

function rewriteImport(src) {
  if (src === 'lucide-react') return '@/ui/icons.generated';
  if (src === '@/api/base44Client') return '@/lib/base44';
  if (src === 'react-router-dom') return '@/web/router';
  if (src === '@/lib/AuthContext') return '@/lib/auth';
  if (src === '@/lib/viewAsPromoterContext') return '@/lib/viewAs';
  if (src === '@/lib/utils') return '@/ui/cn';
  // doc.save() salva/condivide anche sul telefono
  if (src === 'jspdf') return '@/web/shims/jspdf';
  if (src === 'framer-motion') return '@/ui/motion';
  if (src === 'sonner') return '@/ui/sonner';
  if (src === 'recharts') return '@/ui/recharts';
  if (src === '@/lib/layoutUIContext') return '@/web/lib/layoutUI';
  if (src === '@/hooks/useRoleAccess') return '@/lib/useRoleAccess';
  if (src === 'react-dom') return '@/web/shims/react-dom';
  let m;
  if ((m = src.match(/^@\/components\/ui\/([\w-]+)$/))) return `@/ui/${UI_MAP[m[1]] ?? m[1]}`;
  if ((m = src.match(/^@\/utils\/([\w-]+)$/))) return `@/legacy/utils/${m[1]}`;
  if ((m = src.match(/^@\/(components|hooks|lib|pages)\/(.+)$/))) return `@/web/${m[1]}/${m[2]}`;
  return src;
}

// ── API del browser → shim (app/src/web/shims/dom: veri oggetti sul web, equivalenti nativi sul telefono)
const DOM_SHIMS = { window: 'webWindow', document: 'webDocument', navigator: 'webNavigator', localStorage: 'webStorage', sessionStorage: 'webSessionStorage', URL: 'webURL' };
const SHIM_EXPORT = { webWindow: 'win', webDocument: 'doc', webNavigator: 'nav', webStorage: 'storage', webSessionStorage: 'sessionStore', WebCustomEvent: 'CustomEvt', webURL: 'url' };
// new X(...) di classi del browser che sul telefono non esistono
const NEW_SHIMS = { CustomEvent: 'WebCustomEvent' };

/** Nome dichiarato localmente? (ast-types non sa leggere i buchi negli array: const [, b] = ...) */
function shadowed(p, name) {
  try { return !!p.scope?.lookup(name); } catch { return false; }
}

/** window.x / document.x / navigator.x / localStorage.x → webWindow.x ... + import da @/web/shims/dom. */
export function applyDomShims(ast) {
  const used = new Set();
  recast.visit(ast, {
    visitImportDeclaration(p) {
      if (p.node.source.value === 'react-dom') p.node.source = b.stringLiteral('@/web/shims/react-dom');
      return false;
    },
    visitNewExpression(p) {
      const c = p.node.callee;
      if (c.type === 'Identifier' && NEW_SHIMS[c.name] && !shadowed(p, c.name)) {
        used.add(NEW_SHIMS[c.name]);
        p.node.callee = b.identifier(NEW_SHIMS[c.name]);
      }
      this.traverse(p);
    },
    visitMemberExpression(p) {
      const o = p.node.object;
      if (o.type === 'Identifier' && DOM_SHIMS[o.name] && !shadowed(p, o.name)) {
        used.add(DOM_SHIMS[o.name]);
        p.node.object = b.identifier(DOM_SHIMS[o.name]);
      }
      this.traverse(p);
    },
  });
  if (!used.size) return used;
  const body = ast.program.body;
  const existing = body.find((n) => n.type === 'ImportDeclaration' && n.source.value === '@/web/shims/dom');
  const have = new Set(existing ? existing.specifiers.map((sp) => sp.local.name) : []);
  const specs = [...used].filter((n) => !have.has(n)).sort().map((n) => b.importSpecifier(b.identifier(SHIM_EXPORT[n]), b.identifier(n)));
  if (existing) existing.specifiers.push(...specs);
  else {
    const lastImport = body.reduce((i, n, idx) => (n.type === 'ImportDeclaration' ? idx : i), -1);
    body.splice(lastImport + 1, 0, b.importDeclaration(specs, b.stringLiteral('@/web/shims/dom')));
  }
  return used;
}

/** Applica solo gli shim a un file già portato (anche ritoccato a mano) e pulisce i PORT-TODO risolti. */
export function shimFile(code) {
  const ast = recast.parse(code, { parser: { parse: (s) => babel.parse(s, { sourceType: 'module', plugins: ['jsx', 'typescript'], tokens: true }) } });
  applyDomShims(ast);
  let out = recast.print(ast, { quote: 'single', wrapColumn: 160 }).code;
  const lines = out.split('\n');
  const resolved = /^\/\/ {2}- (window|document|navigator|localStorage|sessionStorage)\.|^\/\/ {2}- createPortal/;
  const kept = lines.filter((l) => !resolved.test(l));
  const i = kept.findIndex((l) => l.startsWith('// PORT-TODO'));
  if (i >= 0 && !(kept[i + 1] ?? '').startsWith('//  - ')) kept.splice(i, 1);
  return kept.join('\n');
}

// ── trasformazione ───────────────────────────────────────────────────────────
export function transform(code, originalPath = '') {
  const ast = recast.parse(code, { parser });
  // nomi già usati nel file (import e dichiarazioni): le primitive in conflitto vengono rinominate
  const taken = new Set();
  recast.visit(ast, {
    visitImportSpecifier(p) { taken.add(p.node.local.name); return false; },
    visitImportDefaultSpecifier(p) { taken.add(p.node.local.name); return false; },
    visitFunctionDeclaration(p) { if (p.node.id) taken.add(p.node.id.name); this.traverse(p); },
    visitVariableDeclarator(p) { if (p.node.id.type === 'Identifier') taken.add(p.node.id.name); this.traverse(p); },
  });
  const local = (n) => (taken.has(n) ? `Html${n}` : n);
  const usedHtml = new Set();
  const usedElements = new Set();
  const todos = [];
  let usesHtmlText = false;

  const attrName = (a) => (a.type === 'JSXAttribute' ? (a.name.type === 'JSXNamespacedName' ? `${a.name.namespace.name}:${a.name.name.name}` : a.name.name) : null);
  const hasAttr = (el, n) => el.attributes.some((a) => attrName(a) === n);

  recast.visit(ast, {
    visitImportDeclaration(p) {
      const src = p.node.source.value;
      const next = rewriteImport(src);
      if (next !== src) p.node.source = b.stringLiteral(next);
      if (src === 'uplot') todos.push('uplot: grafico da rifare con @/ui/recharts');
      if (src === 'react-leaflet' || src === 'leaflet') todos.push('mappa: react-native-maps');
      if (src === '@hello-pangea/dnd') todos.push('drag & drop: react-native-draggable-flatlist');
      if (src === 'html2canvas') todos.push('immagine: react-native-view-shot');
      if (src === 'react-markdown') todos.push('markdown: react-native-markdown-display');
      if (/\.css$/.test(src)) { p.prune(); return false; }
      return false;
    },

    // export { x } from '...' / export * from '...': stessi percorsi degli import
    visitExportNamedDeclaration(p) {
      const src = p.node.source?.value;
      if (src) { const next = rewriteImport(src); if (next !== src) p.node.source = b.stringLiteral(next); }
      this.traverse(p);
    },
    visitExportAllDeclaration(p) {
      const src = p.node.source?.value;
      if (src) { const next = rewriteImport(src); if (next !== src) p.node.source = b.stringLiteral(next); }
      return false;
    },

    // import() dinamici (React.lazy)
    visitCallExpression(p) {
      const n = p.node;
      if (n.callee.type === 'Import' && n.arguments[0]?.type === 'StringLiteral') {
        const next = rewriteImport(n.arguments[0].value);
        if (next !== n.arguments[0].value) n.arguments[0] = b.stringLiteral(next);
      }
      this.traverse(p);
    },
    visitImportExpression(p) {
      const src = p.node.source;
      if (src?.type === 'StringLiteral') {
        const next = rewriteImport(src.value);
        if (next !== src.value) p.node.source = b.stringLiteral(next);
      }
      this.traverse(p);
    },

    visitJSXElement(p) {
      const el = p.node.openingElement;
      if (el.name.type !== 'JSXIdentifier' || !/^[a-z]/.test(el.name.name)) { this.traverse(p); return; }
      const tag = el.name.name;

      // dentro un altro elemento JSX serve un {container}; altrove (return, ternari) un'espressione
      const inJsx = ['JSXElement', 'JSXFragment'].includes(p.parent.node.type);
      const replaceWith = (expr) => p.replace(inJsx ? b.jsxExpressionContainer(expr) : expr);
      // <br/> → "\n"
      if (tag === 'br') { replaceWith(b.stringLiteral('\n')); return false; }
      if (tag === 'style' || tag === 'datalist') {
        todos.push(`<${tag}> rimosso`);
        replaceWith(b.nullLiteral());
        return false;
      }

      // dangerouslySetInnerHTML → <HtmlText html=... />
      const dsh = el.attributes.find((a) => attrName(a) === 'dangerouslySetInnerHTML');
      if (dsh) {
        const obj = dsh.value.expression;
        const html = obj.properties?.find((pr) => (pr.key.name ?? pr.key.value) === '__html')?.value ?? b.identifier('undefined');
        const keep = el.attributes.filter((a) => ['className', 'key', 'style'].includes(attrName(a)));
        usesHtmlText = true;
        p.replace(b.jsxElement(b.jsxOpeningElement(b.jsxIdentifier('HtmlText'), [...keep, b.jsxAttribute(b.jsxIdentifier('html'), b.jsxExpressionContainer(html))], true), null, []));
        return false;
      }

      // nome del componente nativo
      let name;
      const clickable = hasAttr(el, 'onClick');
      if (BOX.has(tag)) name = clickable ? 'Btn' : 'Div';
      else if (tag === 'button') name = 'Btn';
      else if (TEXT[tag]) name = TEXT[tag];
      else if (ELEMENTS[tag]) name = ELEMENTS[tag];
      else { todos.push(`tag <${tag}> non mappato`); name = 'Div'; }
      (['Div', 'Btn', 'Span', 'P', 'H'].includes(name) ? usedHtml : usedElements).add(name);

      // attributi
      const removedGestures = [];
      const attrs = [];
      let ariaLabel = null;
      for (const a of el.attributes) {
        if (a.type !== 'JSXAttribute') { attrs.push(a); continue; }
        const n = attrName(a);
        // id negli SVG serve (fill="url(#grad)", clipPath...): si tiene; altrove non ha equivalente
        if (DROP_ATTR.test(n) && !(n === 'id' && SVG_ID_TAGS.has(tag))) continue;
        // touch/pointer/mouse/wheel: supportati da Div e Btn (ui/gestures.ts), rimossi altrove
        if (GESTURE_ATTR.test(n) && !['Div', 'Btn'].includes(name)) { removedGestures.push(n); continue; }
        // onKeyDown dei campi di testo è supportato (ui/keyEvents.ts: Invio/Esc anche sul telefono)
        if (n === 'onKeyDown' && (tag === 'input' || tag === 'textarea')) { attrs.push(a); continue; }
        // <form onSubmit>: Form invia con i pulsanti type="submit" e l'Invio nei campi (ui/form.tsx)
        if (n === 'onSubmit' && tag === 'form') { attrs.push(a); continue; }
        if (n === 'onKeyDown' || n === 'onPaste' || n === 'onInput' || n === 'onSubmit') { removedGestures.push(n); continue; }
        if (n === 'aria-label') { ariaLabel = a.value; continue; }
        if (n === 'title' && !['Svg', 'Path'].includes(name)) { ariaLabel = ariaLabel ?? a.value; continue; }
        // type="submit" serve a Form; "button"/"reset" non servono
        if (n === 'type' && name === 'Btn' && a.value?.value !== 'submit') continue;
        if (n === 'loading' && name === 'Img') continue;
        if (n === 'onClick' && ['Span', 'P', 'H'].includes(name)) { a.name = b.jsxIdentifier('onPress'); attrs.push(a); continue; }
        if (n === 'checked' || (n === 'type' && name === 'HtmlInput' && a.value?.value && ['checkbox', 'radio', 'color', 'range'].includes(a.value.value))) {
          todos.push(`<input ${n === 'checked' ? 'checked' : `type="${a.value.value}"`}> da sostituire con il controllo nativo`);
        }
        // class → className (non dovrebbe esserci, per sicurezza)
        if (n === 'class') a.name = b.jsxIdentifier('className');
        attrs.push(a);
      }
      if (ariaLabel) attrs.push(b.jsxAttribute(b.jsxIdentifier('accessibilityLabel'), ariaLabel));

      // <b>/<strong>/<em>: aggiunge la classe equivalente
      if (TEXT_EXTRA[tag]) {
        const cls = attrs.find((a) => a.type === 'JSXAttribute' && attrName(a) === 'className');
        if (!cls) attrs.push(b.jsxAttribute(b.jsxIdentifier('className'), b.stringLiteral(TEXT_EXTRA[tag])));
        else if (cls.value.type === 'StringLiteral') cls.value = b.stringLiteral(`${TEXT_EXTRA[tag]} ${cls.value.value}`);
      }

      // <button> vero (non un div cliccabile): Btn applica i default del browser (testo centrato, in linea)
      if (tag === 'button') attrs.unshift(b.jsxAttribute(b.jsxIdentifier('button')));
      el.attributes = attrs;
      el.name = b.jsxIdentifier(local(name));
      if (p.node.closingElement) p.node.closingElement.name = b.jsxIdentifier(local(name));
      if (removedGestures.length) todos.push(`<${tag}> gesture/eventi web rimossi: ${[...new Set(removedGestures)].join(', ')}`);
      this.traverse(p);
    },

    // tag scelto a runtime: const Comp = onClick ? 'button' : 'div' → Btn / Div (una stringa
    // come componente funziona solo sul web: sul telefono "View config ... `div`")
    visitVariableDeclarator(p) {
      const { id, init } = p.node;
      if (id.type === 'Identifier' && /^[A-Z]/.test(id.name) && init) {
        recast.visit(init, {
          visitStringLiteral(sp) {
            const name = dynamicTag(sp.node.value);
            if (name) { (['Div', 'Btn', 'Span', 'P', 'H'].includes(name) ? usedHtml : usedElements).add(name); sp.replace(b.identifier(local(name))); }
            return false;
          },
        });
      }
      this.traverse(p);
    },

  });

  applyDomShims(ast);

  // import delle primitive usate
  const body = ast.program.body;
  const lastImport = body.reduce((i, n, idx) => (n.type === 'ImportDeclaration' ? idx : i), -1);
  const add = [];
  const spec = (n) => (taken.has(n) ? b.importSpecifier(b.identifier(n), b.identifier(local(n))) : b.importSpecifier(b.identifier(n)));
  if (usedHtml.size) add.push(b.importDeclaration([...usedHtml].sort().map(spec), b.stringLiteral('@/ui/html')));
  if (usedElements.has('Form')) {
    usedElements.delete('Form');
    add.push(b.importDeclaration([spec('Form')], b.stringLiteral('@/ui/form')));
  }
  if (usedElements.size) add.push(b.importDeclaration([...usedElements].sort().map(spec), b.stringLiteral('@/ui/elements')));
  if (usesHtmlText) add.push(b.importDeclaration([b.importSpecifier(b.identifier('HtmlText'))], b.stringLiteral('@/ui/htmlText')));
  body.splice(lastImport + 1, 0, ...add);

  let out = recast.print(ast, { quote: 'single' }).code;
  const uniq = [...new Set(todos)];
  const header = [
    `// Port di ${originalPath || 'file originale'} (convertito da scripts/port/codemod.mjs).`,
    ...(uniq.length ? ['// PORT-TODO (da sistemare a mano):', ...uniq.map((t) => `//  - ${t}`)] : []),
    '',
  ].join('\n');
  out = header + out;
  return { code: out, todos: uniq };
}

// ── CLI ──────────────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}` && process.argv[2] === '--shims') {
  // node scripts/port/codemod.mjs --shims <file...>: aggiorna in place i file già portati
  for (const f of process.argv.slice(3)) {
    const before = readFileSync(f, 'utf8');
    const after = shimFile(before);
    if (after !== before) { writeFileSync(f, after); console.log(`shim: ${f}`); }
  }
} else if (import.meta.url === `file://${process.argv[1]}`) {
  const [input, output] = process.argv.slice(2);
  const srcIdx = process.argv.indexOf('--src');
  const root = srcIdx > 0 ? process.argv[srcIdx + 1] : path.dirname(input);
  const { code, todos } = transform(readFileSync(input, 'utf8'), `src/${path.relative(root, input)}`);
  mkdirSync(path.dirname(output), { recursive: true });
  writeFileSync(output, code);
  console.log(`${output}: ${todos.length} PORT-TODO`);
}
