// Gara sullo stesso emulatore: app nativa (APK di prova) contro app web ORIGINALE (build di
// produzione in Chrome), stessi dati e stesso utente. Vedi docs/PIANO-PRESTAZIONI.md.
// Uso (emulatore acceso, APK installato, originale servito su :5173 con tools/gara/serve.mjs):
//   node tools/gara/gara.mjs <utente> <file-pagine> <cartella-uscita>
// Scrive <uscita>/gara.json e <uscita>/gara.md (tabella nativa contro originale).
import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const [utente, pagineFile, OUT] = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });
const PKG = 'com.vibra.mobile';
const ORIGINE = 'http://127.0.0.1:5173';
const pagine = readFileSync(pagineFile, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const adb = (...a) => execFileSync('adb', a, { encoding: 'utf8', maxBuffer: 64 << 20 });
const sh = (cmd) => adb('shell', cmd);
const log = (...a) => console.log('[gara]', ...a);
const risultati = { utente, avvio: { nativa: [], originale: [] }, pagine: {}, memoria: {}, note: [] };
const riga = (p) => (risultati.pagine[p] ??= { nativa: {}, originale: {} });

// ── logcat in streaming (orari epoch del telefono) ──
const logLines = [];
let waiters = [];
function startLogcat() {
  sh('logcat -c');
  const lc = spawn('adb', ['logcat', '-v', 'epoch', 'ActivityManager:I', 'ReactNativeJS:I', '*:S']);
  let buf = '';
  lc.stdout.on('data', (d) => {
    buf += d;
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i);
      buf = buf.slice(i + 1);
      const m = line.match(/^\s*(\d+\.\d+)\s+\d+\s+\d+\s+\w\s+([^:]+?)\s*:\s(.*)$/);
      if (!m) continue;
      const e = { t: Math.round(parseFloat(m[1]) * 1000), tag: m[2], msg: m[3] };
      logLines.push(e);
      waiters = waiters.filter((w) => (w.re.test(e.msg) ? (w.resolve(e), false) : true));
    }
  });
  return lc;
}
function waitLog(re, ms) {
  return new Promise((resolve) => {
    const w = { re, resolve };
    waiters.push(w);
    setTimeout(() => { waiters = waiters.filter((x) => x !== w); resolve(null); }, ms);
  });
}
const kv = (msg) => Object.fromEntries([...msg.matchAll(/(\w+)=(\S+)/g)].map(([, k, v]) => [k, Number(v)]));

// ── scorrimento: frame del livello dell'app da SurfaceFlinger ──
function sfLayers(match) {
  return sh('dumpsys SurfaceFlinger --list').split('\n').map((l) => l.trim()).filter((l) => l && match(l));
}
function sfStats(layer) {
  const out = sh(`dumpsys SurfaceFlinger --latency '${layer.replace(/'/g, "'\\''")}'`).trim().split('\n');
  const period = Number(out[0]) / 1e6 || 16.67;
  const present = out.slice(1).map((l) => l.trim().split(/\s+/).map(Number))
    .filter((r) => r.length === 3 && r[1] > 0 && r[1] < 9e18).map((r) => r[1] / 1e6).sort((a, b) => a - b);
  // intervalli tra frame consecutivi dentro uno scorrimento (oltre 250 ms = pausa tra due scorrimenti)
  const gaps = [];
  for (let i = 1; i < present.length; i++) { const d = present[i] - present[i - 1]; if (d < 250) gaps.push(d); }
  return { layer, period, frame: present.length, gaps };
}
async function scorri() {
  // tutti i livelli: durante lo scorrimento disegna solo l'app in primo piano (per Chrome il contenuto
  // sta in un livello di SurfaceControl con un nome che non contiene "chrome")
  const layers = sfLayers(() => true);
  sh('dumpsys SurfaceFlinger --latency-clear');
  for (let i = 0; i < 5; i++) { sh('input swipe 540 1750 540 650 220'); await sleep(450); }
  await sleep(1200);
  for (let i = 0; i < 5; i++) { sh('input swipe 540 650 540 1750 220'); await sleep(450); }
  await sleep(1200);
  // il livello con più frame è quello che disegna il contenuto
  const all = layers.map((l) => { try { return sfStats(l); } catch { return { layer: l, frame: 0, gaps: [] }; } }).sort((a, b) => b.frame - a.frame);
  const best = all[0];
  const candidati = all.slice(0, 4).map((x) => `${x.frame} ${x.layer}`);
  if (!best || best.gaps.length < 5) return { frame: best?.frame ?? 0, nota: 'pochi frame (la pagina non scorre?)', candidati };
  const g = [...best.gaps].sort((a, b) => a - b);
  const q = (x) => Math.round(g[Math.min(g.length - 1, Math.floor(x * g.length))] * 10) / 10;
  const persi = best.gaps.reduce((s, d) => s + Math.max(0, Math.round(d / best.period) - 1), 0);
  return { frame: best.frame, persiPct: Math.round((persi / (persi + best.gaps.length)) * 1000) / 10, p50: q(0.5), p90: q(0.9), p99: q(0.99), livello: best.layer, candidati };
}

// PSS (MB) dei processi scelti: solo la sezione "Total PSS by process" (le altre sezioni ripetono
// gli stessi processi raggruppati); elenco dei processi contati in risultati.memoria.processi
function pss(filter, chi) {
  const out = sh('dumpsys meminfo');
  const start = out.indexOf('Total PSS by process');
  const end = out.indexOf('Total PSS by OOM adjustment');
  const section = start >= 0 ? out.slice(start, end > start ? end : undefined) : '';
  let kb = 0;
  const contati = [];
  for (const m of section.matchAll(/^\s*([\d,]+)K: (\S+)/gm)) {
    if (!filter(m[2])) continue;
    kb += Number(m[1].replace(/,/g, ''));
    contati.push(`${m[2]} ${Math.round(Number(m[1].replace(/,/g, '')) / 1024)}MB`);
  }
  (risultati.memoria.processi ??= {})[chi] = contati;
  return Math.round(kb / 1024);
}

// ── app nativa ──
async function nativa() {
  log('nativa: avvio');
  for (let i = 0; i < 3; i++) {
    sh(`am force-stop ${PKG}`);
    await sleep(1500);
    const start = waitLog(new RegExp(`Start proc \\d+:${PKG.replace(/\./g, '\\.')}/`), 20000);
    const jsStart = waitLog(/VIBRA gara js-inizio /, 60000);
    const ready = waitLog(/VIBRA gara pronta avvio /, 60000);
    sh(`monkey -p ${PKG} -c android.intent.category.LAUNCHER 1`);
    const [s, j, r] = await Promise.all([start, jsStart, ready]);
    if (!s || !r) { risultati.note.push(`nativa avvio ${i + 1}: ${!s ? 'processo non visto' : 'pronta non arrivata'}`); continue; }
    const v = kv(r.msg);
    // jsInizio: processo → prima riga di JS (nativo + bundle); pronta: processo → prima pagina ferma
    risultati.avvio.nativa.push({ pronta: v.fine - s.t, jsInizio: j ? kv(j.msg).fine - s.t : null, primo: v.primo, nonSiFerma: /NONSIFERMA/.test(r.msg) });
    await sleep(9000); // precaricamento delle tab finito prima della misura successiva
  }
  for (const giro of [1, 2]) {
    for (const p of pagine) {
      const ready = waitLog(new RegExp(`VIBRA gara pronta ${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} `), 30000);
      sh(`am start -a android.intent.action.VIEW -d 'vibra:/${p}' ${PKG}`);
      const r = await ready;
      const dest = riga(p).nativa;
      if (!r) { dest[`giro${giro}`] = { errore: 'pronta non arrivata' }; continue; }
      const v = kv(r.msg);
      dest[`giro${giro}`] = { primo: v.primo, pronta: v.pronta, render: v.render, rete: v.rete, nonSiFerma: /NONSIFERMA/.test(r.msg) };
      await sleep(600);
      if (giro === 1) dest.scorrimento = await scorri();
      log('nativa', giro, p, JSON.stringify(dest[`giro${giro}`]));
    }
  }
  risultati.memoria.nativa = pss((n) => n.startsWith(PKG), 'nativa');
  sh(`am force-stop ${PKG}`);
}

// ── originale in Chrome ──
async function originale() {
  const require = createRequire(import.meta.url);
  const { _android } = require('playwright-core');
  const [device] = await _android.devices();
  if (!device) { risultati.note.push('originale: nessun dispositivo per Playwright'); return; }
  const chrome = sh('pm list packages').split('\n').find((l) => /com\.android\.chrome$/.test(l.trim()));
  if (!chrome) { risultati.note.push('originale: Chrome non installato sull\'emulatore'); return; }
  sh('am force-stop com.android.chrome');
  sh('pm clear com.android.chrome');
  const context = await device.launchBrowser({ args: ['--disable-fre', '--no-first-run', '--no-default-browser-check'] });
  log('originale: avvio');
  for (let i = 0; i < 3; i++) {
    const page = await context.newPage();
    await page.goto(`${ORIGINE}/?as=${utente}`, { timeout: 90000 });
    const r = await page.evaluate(() => window.__gara.avvio());
    risultati.avvio.originale.push({ ...r, cache: i === 0 ? 'vuota' : 'piena' });
    await page.waitForTimeout(3000);
    if (i < 2) await page.close();
  }
  const page = context.pages().at(-1);
  for (const giro of [1, 2]) {
    for (const p of pagine) {
      const dest = riga(p).originale;
      try {
        const r = await page.evaluate((x) => window.__gara.nav(x), p);
        dest[`giro${giro}`] = r;
        await page.waitForTimeout(600);
        if (giro === 1) dest.scorrimento = await scorri();
        log('originale', giro, p, JSON.stringify(r));
      } catch (e) {
        dest[`giro${giro}`] = { errore: String(e).slice(0, 120) };
      }
    }
  }
  risultati.memoria.originale = pss((n) => /chrome|webview|sandboxed_process|privileged_process/i.test(n), 'originale');
  await context.close();
}

function tabella() {
  const ms = (x) => (x == null ? '–' : x.errore ? 'errore' : `${x.pronta}${x.nonSiFerma ? '⚠' : ''}`);
  const verdetto = (n, o) => (n?.pronta == null || o?.pronta == null ? '' : n.pronta <= o.pronta ? '✅' : '❌');
  const avg = (a, k) => (a.length ? Math.round(a.reduce((s, x) => s + (x[k] ?? 0), 0) / a.length) : null);
  const L = [];
  L.push(`# Gara — utente ${utente}`, '');
  L.push('Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.', '');
  L.push(`Avvio: nativa ${avg(risultati.avvio.nativa, 'pronta')} ms da app chiusa (di cui ${avg(risultati.avvio.nativa, 'jsInizio')} ms prima della prima riga di JS) · originale ${avg(risultati.avvio.originale, 'pronta')} ms (pagina in Chrome già aperto)`, '');
  L.push('| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |', '|---|---|---|---|---|---|---|---|---|');
  for (const [p, r] of Object.entries(risultati.pagine)) {
    const n = r.nativa;
    const o = r.originale;
    L.push(`| ${p} | ${ms(n.giro1)} | ${ms(o.giro1)} | ${verdetto(n.giro1, o.giro1)} | ${ms(n.giro2)} | ${ms(o.giro2)} | ${verdetto(n.giro2, o.giro2)} | ${n.scorrimento?.persiPct ?? '–'}% | ${o.scorrimento?.persiPct ?? '–'}% |`);
  }
  L.push('', `Memoria (PSS): nativa ${risultati.memoria.nativa ?? '–'} MB · originale (Chrome) ${risultati.memoria.originale ?? '–'} MB`);
  if (risultati.note.length) L.push('', '## Note', ...risultati.note.map((n) => `- ${n}`));
  return L.join('\n') + '\n';
}

const lc = startLogcat();
try {
  await nativa();
} catch (e) { risultati.note.push(`nativa: ${String(e).slice(0, 200)}`); }
try {
  await originale();
} catch (e) { risultati.note.push(`originale: ${String(e).slice(0, 300)}`); }
lc.kill();
writeFileSync(`${OUT}/gara.json`, JSON.stringify(risultati, null, 2));
writeFileSync(`${OUT}/gara.md`, tabella());
console.log(tabella());
process.exit(0);
