// Confronto originale (tools/web-ref, :5173) vs nativo (Expo web, :8081) sulla stessa pagina:
// screenshot affiancabili + posizione verticale dei testi comuni (scostamenti = spaziature diverse).
// Uso: node tools/compare/measure.mjs <cartella-output> [percorso=/clienti] [ruoli=pr,admin,super4] [passi]
// passi (separati da ";", eseguiti uguali sulle due app dopo il caricamento della pagina):
//   click:<testo>     tocca il primo elemento visibile con quel testo esatto (es. click:Gruppi)
//   click~<testo>     idem, testo contenuto (non esatto)
//   nth:<n>:<testo>   tocca l'n-esimo (da 0) elemento visibile con quel testo esatto
//   wait:<ms>         attende
//   scroll:<px>       scorre la pagina (window e scroller interni) di px
//   scrollto:<y>      porta la pagina (window o ScrollView principale) alla posizione y (screenshot più in basso)
//   key:<tasto>       preme un tasto (es. key:Escape)
//   type:<testo>      scrive nel campo che ha il fuoco
// es.: node tools/compare/measure.mjs out/gruppi /clienti pr "click:Gruppi;wait:1500"
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
// playwright installato globalmente nel container (npm root -g)
const { chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright');
import { mkdirSync, writeFileSync } from 'node:fs';
import { parseSteps, runSteps } from './steps.mjs';
const [out = 'compare-out', route = '/clienti', roles = 'pr,admin,super4', stepsArg = ''] = process.argv.slice(2);
const steps = parseSteps(stepsArg);
mkdirSync(out, { recursive: true });
const REF = 'http://127.0.0.1:5173', NAT = 'http://127.0.0.1:8081';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctxOpts = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 };

// testi foglia visibili con la loro posizione (rispetto alla pagina, scroll a 0)
const collect = () => {
  const seen = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    const t = n.textContent.trim().replace(/\s+/g, ' ');
    if (t.length < 2 || seen.has(t)) continue;
    const el = n.parentElement; const r = el.getBoundingClientRect();
    if (!r.width || !r.height || getComputedStyle(el).visibility === 'hidden') continue;
    seen.set(t, { y: Math.round(r.top), x: Math.round(r.left), h: Math.round(r.height) });
  }
  return Object.fromEntries(seen);
};

const report = {};
for (const role of roles.split(',')) {
  const ref = await (await browser.newContext(ctxOpts)).newPage();
  await ref.goto(`${REF}${route}?as=${role}`, { waitUntil: 'networkidle', timeout: 120000 });
  await ref.waitForTimeout(2500);
  const nat = await (await browser.newContext(ctxOpts)).newPage();
  await nat.goto(NAT, { waitUntil: 'networkidle', timeout: 180000 });
  await nat.getByLabel('Email').fill(`${role}@vibra.local`);
  await nat.getByLabel('Password').fill('vibra');
  await nat.getByRole('button', { name: 'Accedi' }).click();
  await nat.waitForTimeout(3000);
  await nat.goto(`${NAT}${route}`, { waitUntil: 'networkidle', timeout: 120000 });
  await nat.waitForTimeout(3500);
  await runSteps(ref, steps, 'ref'); await runSteps(nat, steps, 'nat');
  await ref.screenshot({ path: `${out}/${role}-ref.png` });
  await nat.screenshot({ path: `${out}/${role}-nat.png` });
  const a = await ref.evaluate(collect), b = await nat.evaluate(collect);
  const rows = Object.keys(a).filter((t) => t in b).map((t) => ({ t: t.slice(0, 40), ref: a[t].y, nat: b[t].y, dy: b[t].y - a[t].y, dx: b[t].x - a[t].x }))
    .sort((p, q) => p.ref - q.ref);
  report[role] = { common: rows.length, onlyRef: Object.keys(a).filter((t) => !(t in b)).slice(0, 30), rows };
  console.log(`\n== ${role}: ${rows.length} testi comuni, max |dy| ${Math.max(0, ...rows.filter((r) => r.ref < 844).map((r) => Math.abs(r.dy)))} (primo schermo)`);
  for (const r of rows.filter((r) => r.ref < 1600)) console.log(`${String(r.ref).padStart(5)} ${String(r.nat).padStart(5)} dy=${String(r.dy).padStart(4)} dx=${String(r.dx).padStart(4)}  ${r.t}`);
}
writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 1));
await browser.close();
