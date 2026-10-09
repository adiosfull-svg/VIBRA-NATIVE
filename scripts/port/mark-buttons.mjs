// Segna `button` sui <Btn> dei file già convertiti che nell'originale erano <button> (non div cliccabili),
// abbinandoli in ordine di apparizione. Il codemod nuovo lo fa da solo; questo serve per i file vecchi.
// Uso: node scripts/port/mark-buttons.mjs <src-originale> <file-convertiti...>
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import * as babel from '@babel/parser';
import * as recast from 'recast';

const BOX = new Set(['div', 'section', 'header', 'footer', 'nav', 'main', 'aside', 'ul', 'ol', 'li', 'figure', 'article', 'fieldset']);
const parse = (code, ts) => recast.parse(code, { parser: { parse: (s) => babel.parse(s, { sourceType: 'module', plugins: ts ? ['jsx', 'typescript'] : ['jsx'], tokens: true }) } });
const attr = (el, n) => el.attributes.some((a) => a.type === 'JSXAttribute' && a.name.name === n);

const [srcRoot, ...files] = process.argv.slice(2);
for (const file of files) {
  const rel = path.relative(path.resolve('app/src/web'), path.resolve(file));
  let original;
  try { original = readFileSync(path.join(srcRoot, rel), 'utf8'); } catch { console.log(`${file}: nessun originale`); continue; }
  // originale: sequenza dei Btn (true = <button>)
  const want = [];
  recast.visit(parse(original), {
    visitJSXOpeningElement(p) {
      const n = p.node.name;
      if (n.type === 'JSXIdentifier') {
        if (n.name === 'button') want.push(true);
        else if (BOX.has(n.name) && attr(p.node, 'onClick')) want.push(false);
      }
      this.traverse(p);
    },
  });
  const code = readFileSync(file, 'utf8');
  const ast = parse(code, file.endsWith('.tsx'));
  const btns = [];
  recast.visit(ast, {
    visitJSXOpeningElement(p) {
      if (p.node.name.type === 'JSXIdentifier' && p.node.name.name === 'Btn') btns.push(p.node);
      this.traverse(p);
    },
  });
  if (btns.length !== want.length) { console.log(`${file}: ${btns.length} Btn ma ${want.length} nell'originale, da fare a mano`); continue; }
  let marked = 0;
  btns.forEach((el, i) => {
    if (want[i] && !attr(el, 'button')) { el.attributes.unshift(recast.types.builders.jsxAttribute(recast.types.builders.jsxIdentifier('button'))); marked++; }
  });
  if (marked) writeFileSync(file, recast.print(ast).code);
  console.log(`${file}: ${marked} segnati`);
}
