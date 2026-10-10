// Interlinea ereditata come in CSS (funzioni pure, usate da text.tsx e html.tsx).
import { cn } from './cn.ts';

const LEADING = /(^|\s)leading-/;

// Interlinea delle classi di dimensione di Tailwind: px assoluti, o moltiplicatore (5xl+ = 1)
const NAMED_LEADING: Record<string, number> = { xs: 16, sm: 20, base: 24, lg: 28, xl: 28, '2xl': 32, '3xl': 36, '4xl': 40 };
const UNITLESS_LEADING: Record<string, number> = { none: 1, tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625, loose: 2 };

/**
 * Interlinea che un elemento con dimensione `size` eredita in CSS dalle classi del contenitore
 * (`inherited`): text-xs dà 16px assoluti anche a un figlio text-[10px]; leading-tight resta un
 * moltiplicatore. Senza indicazioni vale il preflight di Tailwind (1.5).
 */
export function inheritedLineHeight(inherited: string, size: number): number {
  let lh: number | null = null;
  for (const c of inherited.split(/\s+/)) {
    // vince l'ultima classe (tailwind-merge toglie un leading-* che precede una dimensione)
    let m;
    if ((m = c.match(/^text-(xs|sm|base|lg|xl|[2-9]xl)$/))) lh = NAMED_LEADING[m[1]] ?? size;
    else if ((m = c.match(/^leading-\[(\d+(?:\.\d+)?)px\]$/))) lh = Number(m[1]);
    else if ((m = c.match(/^leading-(\d+(?:\.\d+)?)$/))) lh = Number(m[1]) * 4;
    else if ((m = c.match(/^leading-(none|tight|snug|normal|relaxed|loose)$/))) lh = UNITLESS_LEADING[m[1]] * size;
  }
  return Math.round((lh ?? size * 1.5) * 100) / 100;
}

export const ARB_SIZE = /(?:^|\s)text-\[(\d+(?:\.\d+)?)px\]/;

/**
 * Classi di testo da passare ai figli: con una dimensione arbitraria senza leading-* l'interlinea
 * ereditata va fissata in px, perché cn (tailwind-merge) toglierebbe quella del contenitore.
 */
const classesForCache = new Map<string, string>();

export function textClassesFor(inherited: string, own: string): string {
  const key = `${inherited}|${own}`;
  let out = classesForCache.get(key);
  if (out === undefined) {
    if (classesForCache.size > 5000) classesForCache.clear();
    out = computeClassesFor(inherited, own);
    classesForCache.set(key, out);
  }
  return out;
}

function computeClassesFor(inherited: string, own: string): string {
  const arb = own.match(ARB_SIZE);
  if (!arb || LEADING.test(own)) return cn(inherited, own);
  return cn(inherited, own, `leading-[${inheritedLineHeight(inherited, Number(arb[1]))}px]`);
}


const NAMED_SIZE_PX: Record<string, number> = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48, '6xl': 60, '7xl': 72, '8xl': 96, '9xl': 128 };

/** Dimensione del testo data da classi Tailwind (vince l'ultima; default 16px del body). */
export function fontSizeOf(classes: string): number {
  let size = 16;
  for (const c of classes.split(/\s+/)) {
    let m;
    if ((m = c.match(/^text-(xs|sm|base|lg|xl|[2-9]xl)$/))) size = NAMED_SIZE_PX[m[1]];
    else if ((m = c.match(/^text-\[(\d+(?:\.\d+)?)px\]$/))) size = Number(m[1]);
  }
  return size;
}

/** Interlinea data da classi Tailwind (ereditate comprese). */
export const lineHeightOf = (classes: string): number => inheritedLineHeight(classes, fontSizeOf(classes));

// Metriche di Inter (ascendente/discendente su unità em): l'area del contenuto è 1.21em
const ASC = 0.96875, DESC = 0.2421875;

/**
 * Elemento in linea (<span>, <label>) da solo dentro un blocco: in CSS la riga contiene anche lo
 * "strut" del contenitore (il suo font e la sua interlinea) e i due sono allineati sulla linea di
 * base. Restituisce l'altezza della riga e la distanza dall'alto del box dell'elemento (alto
 * quanto la sua interlinea, come il Text di RN).
 */
export function inlineLineBox(parentSize: number, parentLh: number, size: number, lh: number): { height: number; top: number } {
  const baseline = (parentLh - parentSize * (ASC + DESC)) / 2 + parentSize * ASC;
  const ownTop = baseline - ((lh - size * (ASC + DESC)) / 2 + size * ASC);
  const top = Math.min(0, ownTop);
  const bottom = Math.max(parentLh, ownTop + lh);
  const r = (n: number) => Math.round(n * 100) / 100;
  return { height: r(bottom - top), top: r(ownTop - top) };
}

/**
 * Spazio sotto un elemento in linea allineato sul fondo (una <textarea> in un blocco: la sua
 * linea di base è il bordo inferiore): la parte dello strut del contenitore sotto la linea di base.
 */
export function strutDescent(parentSize: number, parentLh: number): number {
  return Math.round(((parentLh - parentSize * (ASC + DESC)) / 2 + parentSize * DESC) * 100) / 100;
}

/**
 * Elemento a blocco in linea (inline-flex, inline-block, <button>) da solo in un blocco: la riga è
 * alta almeno quanto lo strut del contenitore e il box sta sulla linea di base (quella del suo testo,
 * cioè sopra il padding/bordo inferiore). Margini sopra/sotto che lo mettono al suo posto nella riga.
 */
export function inlineBlockMargins(parentSize: number, parentLh: number, size: number, lh: number, boxH: number, padBottom: number): { marginTop: number; marginBottom: number } {
  const parentBaseline = (parentLh - parentSize * (ASC + DESC)) / 2 + parentSize * ASC;
  const boxBaseline = boxH - padBottom - ((lh - size * (ASC + DESC)) / 2 + size * DESC);
  const ownTop = parentBaseline - boxBaseline;
  const top = Math.min(0, ownTop);
  const bottom = Math.max(parentLh, ownTop + boxH);
  const r = (n: number) => Math.round(n * 100) / 100;
  return { marginTop: r(ownTop - top), marginBottom: r(bottom - top - (ownTop - top) - boxH) };
}
