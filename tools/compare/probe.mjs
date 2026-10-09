// Stili calcolati della catena di antenati di un testo, originale vs nativo (per trovare la causa
// di uno scostamento visto con measure.mjs).
// Uso: node tools/compare/probe.mjs <ruolo> <percorso> "<testo>" [livelli=8]
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const { chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright');
const [role = 'pr', route = '/clienti', text = 'Gruppi', levels = '8'] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctxOpts = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 };
const chain = ([text, levels]) => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let el = null;
  for (let n; (n = w.nextNode());) if (n.textContent.trim() === text && n.parentElement.getBoundingClientRect().height) { el = n.parentElement; break; }
  const out = [];
  for (let i = 0; el && i < levels; i++, el = el.parentElement) {
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    const prev = el.previousElementSibling && el.previousElementSibling.getBoundingClientRect();
    out.push(`${String(Math.round(r.top)).padStart(5)} h=${String(Math.round(r.height)).padStart(4)} prevBottom=${prev ? Math.round(prev.bottom) : '-'} mt=${s.marginTop} mb=${s.marginBottom} pt=${s.paddingTop} pb=${s.paddingBottom} gap=${s.rowGap} disp=${s.display}/${s.flexDirection} cls=${(el.getAttribute('class') || '').slice(0, 90)}`);
  }
  return out.join('\n');
};
const ref = await (await browser.newContext(ctxOpts)).newPage();
await ref.goto(`http://127.0.0.1:5173${route}?as=${role}`, { waitUntil: 'networkidle' });
await ref.waitForTimeout(2500);
const nat = await (await browser.newContext(ctxOpts)).newPage();
await nat.goto('http://127.0.0.1:8081', { waitUntil: 'networkidle', timeout: 180000 });
await nat.getByLabel('Email').fill(`${role}@vibra.local`);
await nat.getByLabel('Password').fill('vibra');
await nat.getByRole('button', { name: 'Accedi' }).click();
await nat.waitForTimeout(3000);
await nat.goto(`http://127.0.0.1:8081${route}`, { waitUntil: 'networkidle' });
await nat.waitForTimeout(3500);
console.log('== ORIGINALE\n' + await ref.evaluate(chain, [text, +levels]));
console.log('== NATIVO\n' + await nat.evaluate(chain, [text, +levels]));
await browser.close();
