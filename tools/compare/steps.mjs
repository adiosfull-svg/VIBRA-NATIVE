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
    const [kind, ...rest] = step.split(/(?<=^(?:click|nth|wait|scroll|key|type))[:~]/);
    const exact = !step.startsWith('click~');
    let arg = rest.join(':'), nth = 0;
    if (kind === 'nth') { const i = arg.indexOf(':'); nth = Number(arg.slice(0, i)); arg = arg.slice(i + 1); }
    if (kind === 'wait') await page.waitForTimeout(Number(arg));
    else if (kind === 'key') await page.keyboard.press(arg);
    else if (kind === 'type') { await page.keyboard.type(arg, { delay: 30 }); await page.waitForTimeout(600); }
    else if (kind === 'scroll') {
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
