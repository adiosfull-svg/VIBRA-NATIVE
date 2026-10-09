import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import * as recast from 'recast';
import * as babel from '@babel/parser';
const parser = { parse: (s) => babel.parse(s, { sourceType: 'module', plugins: ['jsx'], tokens: true }) };
const walk = (d, o = []) => { for (const f of readdirSync(d)) { const p = path.join(d, f); statSync(p).isDirectory() ? walk(p, o) : /\.jsx?$/.test(f) && o.push(p); } return o; };
const tags = {}, attrs = {}, globals = {};
for (const f of walk(process.argv[2])) {
  const ast = recast.parse(readFileSync(f, 'utf8'), { parser });
  recast.visit(ast, {
    visitJSXOpeningElement(p) {
      const n = p.node.name;
      if (n.type === 'JSXIdentifier' && /^[a-z]/.test(n.name)) {
        tags[n.name] = (tags[n.name] || 0) + 1;
        for (const a of p.node.attributes) if (a.type === 'JSXAttribute') { const k = `${a.name.name}`; attrs[k] = (attrs[k] || 0) + 1; }
      }
      this.traverse(p);
    },
    visitMemberExpression(p) {
      const o = p.node.object;
      if (o.type === 'Identifier' && ['window', 'document', 'localStorage', 'sessionStorage', 'navigator', 'history'].includes(o.name)) globals[o.name] = (globals[o.name] || 0) + 1;
      this.traverse(p);
    },
  });
}
const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);
console.log('TAGS', JSON.stringify(top(tags)));
console.log('ATTRS', JSON.stringify(top(attrs)));
console.log('GLOBALS', JSON.stringify(top(globals)));
