// Confronto grafico sullo stesso emulatore: per ogni pagina, schermate dell'app nativa (APK di prova) e
// dell'ORIGINALE in Chrome, alla stessa larghezza e alle stesse posizioni di scorrimento. Serve a trovare
// le differenze di disegno che si vedono solo sul telefono (testo che va a capo, barre, ombre...).
// Uso (emulatore acceso, APK installato, originale servito su :5173 con tools/gara/serve.mjs):
//   node tools/gara/confronto.mjs <utente> <file-pagine> <cartella-uscita>
// Pagine: una per riga, `percorso [schermate]` (default 4 schermate, una ogni ~mezzo schermo).
// Scrive <uscita>/confronto/<pagina>-<n>-{nat,ref}.png e confronto.md; affianca.py le mette fianco a fianco.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const [utente, pagineFile, OUT] = process.argv.slice(2);
const DIR = `${OUT}/confronto`;
mkdirSync(DIR, { recursive: true });
const PKG = 'com.vibra.mobile';
const ORIGINE = 'http://127.0.0.1:5173';
const pagine = readFileSync(pagineFile, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
  .map((l) => { const [p, n] = l.split(/\s+/); return { p, n: Number(n) || 4 }; });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const adb = (...a) => execFileSync('adb', a, { maxBuffer: 64 << 20 });
const sh = (cmd) => adb('shell', cmd).toString();
const log = (...a) => console.log('[confronto]', ...a);
const nome = (p) => (p.replace(/^\//, '').replace(/[^a-zA-Z0-9]+/g, '_') || 'home');
const note = [];
// TAB della barra in basso: non si torna indietro
const TAB = new Set(['/', '/dashboard', '/programmazione', '/clienti', '/semine', '/il-mio-vibra']);

const size = sh('wm size').match(/(\d+)x(\d+)/);
const W = Number(size?.[1] ?? 1080);
const H = Number(size?.[2] ?? 2400);
const shot = (file) => writeFileSync(file, adb('exec-out', 'screencap', '-p'));
// trascinamento lento (niente lancio): ~metà schermo, uguale per le due app
const scorri = () => sh(`input swipe ${W / 2} ${Math.round(H * 0.75)} ${W / 2} ${Math.round(H * 0.3)} 1500`);

async function serie(p, n, chi) {
  for (let i = 0; i < n; i++) {
    if (i > 0) { scorri(); await sleep(1400); }
    shot(`${DIR}/${nome(p)}-${i}-${chi}.png`);
  }
}

// ── nativa: link vibra://, attesa della pagina ferma (sonda della gara nel logcat) ──
async function nativa() {
  sh(`am force-stop ${PKG}`);
  sh('logcat -c');
  sh(`monkey -p ${PKG} -c android.intent.category.LAUNCHER 1`);
  // avvio, login di prova e precaricamento delle tab
  await sleep(25000);
  for (const { p, n } of pagine) {
    sh('logcat -c');
    sh(`am start -a android.intent.action.VIEW -d 'vibra:/${p}' ${PKG}`);
    let pronta = false;
    for (let t = 0; t < 40 && !pronta; t++) {
      await sleep(500);
      pronta = sh('logcat -d -s ReactNativeJS:I').includes(`VIBRA gara pronta ${p} `);
    }
    if (!pronta) note.push(`nativa ${p}: pronta non arrivata (schermata dopo 20 s)`);
    // conteggi (1,2 s) e animazioni d'entrata finite
    await sleep(2500);
    await serie(p, n, 'nat');
    log('nativa', p);
    if (!TAB.has(p)) { sh('input keyevent 4'); await sleep(1200); }
  }
  sh(`am force-stop ${PKG}`);
}

// inviti di Chrome sopra la pagina (notifiche, accesso): tocco su «No thanks» se c'è
async function chiudiInviti() {
  for (let i = 0; i < 3; i++) {
    await sleep(1500);
    let xml = '';
    try { xml = adb('exec-out', 'uiautomator', 'dump', '/dev/tty').toString(); } catch { return; }
    const m = xml.match(/text="(?:No thanks|No, thanks|Not now)"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
    if (!m) return;
    sh(`input tap ${(Number(m[1]) + Number(m[3])) >> 1} ${(Number(m[2]) + Number(m[4])) >> 1}`);
    note.push('originale: invito di Chrome chiuso');
  }
}

// ── originale in Chrome (Playwright sull'emulatore) ──
async function originale() {
  const require = createRequire(import.meta.url);
  const { _android } = require('playwright-core');
  const [device] = await _android.devices();
  if (!device) { note.push('originale: nessun dispositivo per Playwright'); return; }
  sh('am force-stop com.android.chrome');
  sh('pm clear com.android.chrome');
  // senza permesso Chrome apre il suo invito alle notifiche sopra la pagina (coprirebbe tutte le schermate)
  try { sh('pm grant com.android.chrome android.permission.POST_NOTIFICATIONS'); } catch { /* Android < 13 */ }
  const context = await device.launchBrowser({ args: ['--disable-fre', '--no-first-run', '--no-default-browser-check', '--disable-notifications'] });
  const page = await context.newPage();
  await page.goto(`${ORIGINE}/?as=${utente}`, { timeout: 90000 });
  await chiudiInviti();
  await page.evaluate(() => window.__gara.avvio());
  await page.waitForTimeout(4000);
  for (const { p, n } of pagine) {
    try {
      await page.evaluate((x) => window.__gara.nav(x), p);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(2500);
      if (p === pagine[0].p) await chiudiInviti();
      await serie(p, n, 'ref');
      log('originale', p);
      if (!TAB.has(p)) { await page.evaluate(() => history.back()); await page.waitForTimeout(1200); }
    } catch (e) {
      note.push(`originale ${p}: ${String(e).slice(0, 160)}`);
    }
  }
  await context.close();
}

try { await nativa(); } catch (e) { note.push(`nativa: ${String(e).slice(0, 200)}`); }
try { await originale(); } catch (e) { note.push(`originale: ${String(e).slice(0, 300)}`); }
const md = [`# Confronto grafico — utente ${utente}`, '', `Schermo ${W}x${H}, densità ${sh('wm density').trim()}`, '',
  ...pagine.map(({ p, n }) => `- ${p}: ${n} schermate (${nome(p)}-N-ref/nat)`),
  ...(note.length ? ['', '## Note', ...note.map((x) => `- ${x}`)] : [])].join('\n');
writeFileSync(`${OUT}/confronto.md`, md + '\n');
console.log(md);
process.exit(0);
