// Passi comuni a measure.mjs e probe.mjs: stesse azioni sull'originale e sul nativo
// (vedi l'intestazione di measure.mjs per la sintassi).
export const parseSteps = (arg = '') => arg.split(';').map((x) => x.trim()).filter(Boolean);

// elemento visibile più interno con quel testo (esatto o contenuto): stessa scelta sulle due app
const findText = ([text, exact, nth]) => {
  const norm = (t) => t.trim().replace(/\s+/g, ' ');
  const hits = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    const t = norm(n.textContent);
    if (!(exact ? t === text : t.includes(text))) continue;
    const el = n.parentElement; let r = el.getBoundingClientRect();
    if (!r.width || !r.height || getComputedStyle(el).visibility === 'hidden') continue;
    // fuori schermo in orizzontale (barra tab scorrevole): portalo in vista
    if (r.right > innerWidth || r.left < 0) { el.scrollIntoView({ block: 'nearest', inline: 'center' }); r = el.getBoundingClientRect(); }
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    hits.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }
  return hits[nth] || null;
};
export async function runSteps(page, steps, label) {
  for (const step of steps) {
    const [kind, ...rest] = step.split(/(?<=^(?:click|nth|wait|scrollto|scrollid|scroll|key|type))[:~]/);
    const exact = !step.startsWith('click~');
    let arg = rest.join(':'), nth = 0;
    if (kind === 'nth') { const i = arg.indexOf(':'); nth = Number(arg.slice(0, i)); arg = arg.slice(i + 1); }
    if (kind === 'wait') await page.waitForTimeout(Number(arg));
    else if (kind === 'key') await page.keyboard.press(arg);
    else if (kind === 'type') { await page.keyboard.type(arg, { delay: 30 }); await page.waitForTimeout(600); }
    else if (kind === 'scrollto') {
      await page.evaluate((y) => {
        window.scrollTo(0, y);
        // nativo sul web: la pagina è uno ScrollView (il più grande elemento scorrevole in verticale)
        let best = null;
        for (const el of document.querySelectorAll('div')) {
          const s = getComputedStyle(el);
          if (!/auto|scroll/.test(s.overflowY) || el.scrollHeight <= el.clientHeight + 1) continue;
          if (!best || el.clientHeight * el.scrollHeight > best.clientHeight * best.scrollHeight) best = el;
        }
        if (best && best.clientHeight > innerHeight / 2) best.scrollTop = y;
      }, Number(arg));
      await page.waitForTimeout(800);
    } else if (kind === 'scrollid') {
      // porta l'elemento con quell'id a 100px dall'alto (stesso punto sulle due app, senza scroll-margin):
      // scorre il primo antenato scorrevole (sul nativo web lo ScrollView della pagina), se no la finestra
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const dy = el.getBoundingClientRect().top - 100;
        for (let p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
          const s = getComputedStyle(p);
          if (/auto|scroll/.test(s.overflowY) && p.scrollHeight > p.clientHeight + 1) { p.scrollTop += dy; return; }
        }
        window.scrollBy(0, dy);
      }, arg);
      await page.waitForTimeout(800);
    } else if (kind === 'scroll') {
      await page.mouse.move(195, 500); await page.mouse.wheel(0, Number(arg)); await page.waitForTimeout(600);
    } else if (kind === 'click' || kind === 'nth') {
      let pt = null;
      for (let i = 0; i < 20 && !pt; i++) { pt = await page.evaluate(findText, [arg, exact, nth]); if (!pt) await page.waitForTimeout(250); }
      if (!pt) { console.log(`  [${label}] passo "${step}": testo non trovato`); continue; }
      await page.waitForTimeout(300); pt = (await page.evaluate(findText, [arg, exact, nth])) || pt;
      await page.mouse.click(pt.x, pt.y);
      await page.waitForTimeout(900);
    } else console.log(`  passo sconosciuto: ${step}`);
  }
  if (steps.length) await page.waitForTimeout(1500);
}
