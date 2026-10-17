// Gara della barra in basso e del menu laterale: app nativa (APK di prova) contro ORIGINALE in Chrome,
// sullo stesso emulatore, con gli stessi tocchi (adb input) e lo stesso metodo di misura: un video dello
// schermo con «Mostra tocchi» attivo, analizzato frame per frame da navbar_analisi.py.
//   - tocco → la pillola si muove / arriva / la pagina cambia (tocchi lenti e tocchi veloci di fila)
//   - trascinamento sulla barra: quanto la pillola resta indietro rispetto al dito
//   - menu laterale (burger): tocco → menu completo, logo compreso (due aperture)
// Uso (emulatore acceso, APK di prova con EXPO_PUBLIC_TEST_GARA=1 installato, originale su :5173):
//   node tools/gara/navbar.mjs <utente> <cartella-uscita>
import { spawn, execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const [utente = 'pr', OUT = 'out'] = process.argv.slice(2);
mkdirSync(`${OUT}/video`, { recursive: true });
const PKG = 'com.vibra.mobile';
const ORIGINE = 'http://127.0.0.1:5173';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const adb = (...a) => execFileSync('adb', a, { encoding: 'utf8', maxBuffer: 64 << 20 });
const adbBuf = (...a) => execFileSync('adb', a, { maxBuffer: 256 << 20 });
const sh = (cmd) => adb('shell', cmd);
const log = (...a) => console.log('[navbar]', ...a);
const SCALA = 0.5; // video a metà risoluzione
const note = [];

const [W, H] = sh('wm size').match(/(\d+)x(\d+)/g).pop().split('x').map(Number);
const DENS = Number(sh('wm density').match(/(\d+)\s*$/m)[1]) / 160;
const dp = (v) => Math.round(v * DENS);

// ── pillola sullo schermo (pixel viola nella parte bassa) ──
function screencap() {
  const buf = adbBuf('exec-out', 'screencap');
  const w = buf.readUInt32LE(0);
  const h = buf.readUInt32LE(4);
  const head = buf.length - w * h * 4;
  return { w, h, px: buf.subarray(head) };
}
const isPurple = (r, g, b) => b > 45 && b > r + 15 && r > g + 12;
function findPill() {
  const { w, h, px } = screencap();
  let n = 0; let sx = 0; let sy = 0;
  for (let y = Math.floor(h * 0.8); y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const i = (y * w + x) * 4;
      if (isPurple(px[i], px[i + 1], px[i + 2])) { n++; sx += x; sy += y; }
    }
  }
  return n > 200 ? { x: Math.round(sx / n), y: Math.round(sy / n), n } : null;
}

// ── registrazione ──
// Prima scelta: registrazione dell'EMULATORE (lato host, frame a intervalli regolari): screenrecord sul
// telefono emulato passa da un display virtuale e un codificatore software e dava ~3 frame al secondo.
let rec = null;
let host = false;
let ext = 'webm';
function startRec(nome) {
  const size = `${Math.round(W * SCALA)}x${Math.round(H * SCALA)}`;
  try {
    const r = adb('emu', 'screenrecord', 'start', '--fps', '30', '--size', size, '--bit-rate', '6000000', resolve(OUT, 'video', `nav-${nome}.webm`));
    host = !/KO|unknown|error/i.test(r);
  } catch (e) { host = false; note.push(`registrazione dell'emulatore non disponibile: ${String(e).slice(0, 120)}`); }
  if (!host) {
    ext = 'mp4';
    sh(`rm -f /sdcard/nav-${nome}.mp4`);
    rec = spawn('adb', ['shell', 'screenrecord', '--bit-rate', '3000000', '--size', size, `/sdcard/nav-${nome}.mp4`]);
  } else ext = 'webm';
  return Date.now();
}
async function stopRec(nome) {
  if (host) {
    adb('emu', 'screenrecord', 'stop');
    await sleep(4000);
    return;
  }
  sh('pkill -INT screenrecord || true');
  await new Promise((r) => { rec.on('exit', r); setTimeout(r, 5000); });
  await sleep(1500);
  adb('pull', `/sdcard/nav-${nome}.mp4`, `${OUT}/video/nav-${nome}.mp4`);
}
// frame davvero disegnati sullo schermo (SurfaceFlinger) durante la sequenza, per livello
function timestats() {
  const dump = sh('dumpsys SurfaceFlinger --timestats -dump');
  sh('dumpsys SurfaceFlinger --timestats -disable');
  return dump.split(/layerName = /).slice(1).map((b) => ({ nome: b.split('\n')[0].trim(), frame: Number(b.match(/totalFrames = (\d+)/)?.[1] ?? 0) }))
    .sort((x, y) => y.frame - x.frame).slice(0, 4);
}

// ── la sequenza, identica per le due app ──
// voci della barra: 0 Semine/Dashboard, 1 Weekend, 2 Clienti, 3 Cerca, 4 Il Mio (si parte da Il Mio)
async function sequenza(nome, burger) {
  writeFileSync(`${OUT}/navbar-${nome}-inizio.png`, adbBuf('exec-out', 'screencap', '-p'));
  const pill = findPill();
  if (!pill) { note.push(`${nome}: pillola non trovata sullo schermo (vedi navbar-${nome}-inizio.png)`); return null; }
  const y = pill.y;
  const xs = [0, 1, 2, 3, 4].map((i) => Math.round((W * (i + 0.5)) / 5));
  const eventi = [];
  sh('dumpsys SurfaceFlinger --timestats -enable -clear');
  const t0 = startRec(nome);
  await sleep(2500);
  const at = () => (Date.now() - t0) / 1000;
  const tap = async (kind, i, pausa) => {
    eventi.push({ kind, voce: i, x: xs[i], y, t: at() });
    sh(`input tap ${xs[i]} ${y}`);
    await sleep(pausa);
  };
  // tocchi lenti: la barra è ferma prima di ogni tocco
  for (const i of [2, 1, 0, 2, 4, 1, 4]) await tap('lento', i, 2600);
  // tocchi veloci di fila (il JS è occupato con la pagina appena aperta); la voce successiva non è mai
  // sul percorso della pillola precedente, così il tocco si riconosce nel video
  for (const i of [2, 1, 0]) await tap('veloce', i, 450);
  await sleep(2600);
  // trascinamento dalla prima all'ultima voce
  eventi.push({ kind: 'trascina', voce: 0, x: xs[0], y, x2: xs[4], durata: 0.9, t: at() });
  sh(`input swipe ${xs[0]} ${y} ${xs[4]} ${y} 900`);
  await sleep(3500);
  // menu laterale: due aperture (la seconda dice se il menu si ricostruisce a ogni apertura)
  if (burger) {
    for (const k of [1, 2]) {
      eventi.push({ kind: 'menu', apertura: k, x: burger.x, y: burger.y, t: at() });
      sh(`input tap ${burger.x} ${burger.y}`);
      await sleep(2800);
      eventi.push({ kind: 'chiudi', x: W - dp(30), y: Math.round(H / 2), t: at() });
      sh(`input tap ${W - dp(30)} ${Math.round(H / 2)}`);
      await sleep(2200);
    }
  } else note.push(`${nome}: pulsante del menu non trovato`);
  const durata = at();
  await stopRec(nome);
  const livelli = timestats().map((l) => ({ ...l, al_secondo: Math.round((l.frame / durata) * 10) / 10 }));
  return { nome, scala: SCALA, W, H, dens: DENS, barra: { y, xs, pill }, eventi, livelli, video: `video/nav-${nome}.${ext}` };
}

function burgerNativa() {
  const xml = adb('exec-out', 'uiautomator', 'dump', '/dev/tty');
  const m = xml.match(/content-desc="Menu"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/)
    || xml.match(/bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"[^>]*content-desc="Menu"/);
  if (!m) return null;
  const [x1, y1, x2, y2] = m.slice(1).map(Number);
  return { x: Math.round((x1 + x2) / 2), y: Math.round((y1 + y2) / 2) };
}

async function nativa() {
  sh(`am force-stop ${PKG}`);
  sh('logcat -c');
  await sleep(1000);
  sh(`monkey -p ${PKG} -c android.intent.category.LAUNCHER 1`);
  // precaricamento delle tab finito (build di test: riga «VIBRA gara precarica fine»)
  for (let i = 0; i < 90; i++) {
    await sleep(1000);
    if (/VIBRA gara precarica fine/.test(adb('logcat', '-d', '-s', 'ReactNativeJS:I'))) break;
  }
  sh(`am start -a android.intent.action.VIEW -d 'vibra://il-mio-vibra' ${PKG}`);
  await sleep(6000);
  const r = await sequenza('nativa', burgerNativa());
  sh(`am force-stop ${PKG}`);
  return r;
}

async function originale() {
  const require = createRequire(import.meta.url);
  const { _android } = require('playwright-core');
  const [device] = await _android.devices();
  if (!device) { note.push('originale: nessun dispositivo per Playwright'); return null; }
  sh('am force-stop com.android.chrome');
  sh('pm clear com.android.chrome');
  const context = await device.launchBrowser({ args: ['--disable-fre', '--no-first-run', '--no-default-browser-check'] });
  const page = await context.newPage();
  await page.goto(`${ORIGINE}/?as=${utente}`, { timeout: 90000 });
  await page.waitForTimeout(4000);
  await page.goto(`${ORIGINE}/il-mio-vibra`, { timeout: 90000 });
  await page.waitForTimeout(6000);
  // posizione del burger sullo schermo: rettangolo CSS × dpr + scostamento del contenuto di Chrome
  // (ricavato dalla pillola: centro sullo schermo contro centro CSS)
  const pill = findPill();
  const css = await page.evaluate(() => {
    const b = document.querySelector('[aria-label="Menu"]')?.getBoundingClientRect();
    const nav = document.querySelector('[data-mobile-nav] .rounded-full')?.getBoundingClientRect();
    return { dpr: devicePixelRatio, b: b && { x: b.x + b.width / 2, y: b.y + b.height / 2 }, p: nav && { y: nav.y + nav.height / 2 } };
  });
  let burger = null;
  if (pill && css.b && css.p) {
    const off = pill.y - css.p.y * css.dpr;
    burger = { x: Math.round(css.b.x * css.dpr), y: Math.round(css.b.y * css.dpr + off) };
  }
  const r = await sequenza('originale', burger);
  await context.close();
  return r;
}

// animazioni attive (il job dell'emulatore le spegne) e tocchi visibili nel video
sh('settings put system show_touches 1');
for (const k of ['window_animation_scale', 'transition_animation_scale', 'animator_duration_scale']) sh(`settings put global ${k} 1`);

const risultati = { utente, app: {} };
try { risultati.app.nativa = await nativa(); } catch (e) { note.push(`nativa: ${String(e).slice(0, 300)}`); }
try { risultati.app.originale = await originale(); } catch (e) { note.push(`originale: ${String(e).slice(0, 300)}`); }
risultati.note = note;
writeFileSync(`${OUT}/navbar-eventi.json`, JSON.stringify(risultati, null, 2));
log('eventi registrati', note);
process.exit(0);
