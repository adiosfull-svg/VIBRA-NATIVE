#!/usr/bin/env python3
"""Cosa fa il thread JS dopo ogni cambio di tab dalla barra (profilo del campionatore di Hermes).

Il profilo viene da plugins/withJsProfiler.js (emulatore con `profilo_js: si`). Nelle build col profilo
navProbeStart (lib/testDiag.ts) esegue VIBRA_MARCA_NAV per qualche ms: i campioni con quella funzione
segnano il rilascio del dito. Per le FINESTRA_MS successive a ogni segno somma le funzioni presenti negli
stack (inclusivo) e quelle in cima (esclusivo). Uso: analizza.py <profilo.json> [titolo] → markdown.
"""
import collections
import json
import sys

FINESTRA_MS = 600
MARCA = 'VIBRA_MARCA_NAV'


def main(path, titolo=''):
    d = json.load(open(path))
    frames = d.get('stackFrames', {})
    samples = sorted(d.get('samples', []), key=lambda s: float(s['ts']))
    name = {k: str(v.get('name', '?')) for k, v in frames.items()}
    parent = {k: v.get('parent') for k, v in frames.items()}

    def stack(sf):
        out = []
        while sf is not None and str(sf) in frames and len(out) < 400:
            out.append(name[str(sf)])
            sf = parent.get(str(sf))
        return out  # dalla cima (foglia) alla radice

    ts = [float(s['ts']) / 1000 for s in samples]  # µs → ms
    stacks = [stack(s.get('sf')) for s in samples]
    gaps = sorted(b - a for a, b in zip(ts, ts[1:]) if b > a)
    step = gaps[len(gaps) // 2] if gaps else 0
    marks = []
    for t, st in zip(ts, stacks):
        if any(MARCA in f for f in st) and (not marks or t - marks[-1] > 150):
            marks.append(t)
    print(f'\n## Profilo JS {titolo}\n')
    print(f'{len(samples)} campioni (uno ogni ~{step:.1f} ms), {len(marks)} cambi di tab segnati; finestra {FINESTRA_MS} ms dopo il rilascio\n')
    incl = collections.Counter()
    leaf = collections.Counter()
    tot = 0
    righe = []
    for m in marks:
        n = busy = 0
        last_busy = 0.0
        for t, st in zip(ts, stacks):
            if t < m or t > m + FINESTRA_MS:
                continue
            n += 1
            real = [f for f in st if f not in ('[root]', '(root)', '[idle]', '(idle)', '(program)')]
            if not real or any(MARCA in f for f in real):
                continue
            busy += 1
            last_busy = t - m
            tot += 1
            leaf[real[0]] += 1
            for f in set(real):
                incl[f] += 1
        righe.append(f'- rilascio a {m / 1000:.1f} s: JS occupato {busy * step:.0f} ms su {FINESTRA_MS} (ultimo campione occupato a {last_busy:.0f} ms)')
    print('\n'.join(righe))
    if not tot:
        return
    print(f'\n### Funzioni (inclusivo: la funzione o chi ha chiamato), {tot} campioni occupati\n')
    print('| campioni | % | funzione |\n|---|---|---|')
    for f, v in incl.most_common(45):
        print(f'| {v} | {100 * v / tot:.0f} | `{f[:110]}` |')
    print('\n### In cima allo stack (esclusivo)\n')
    print('| campioni | % | funzione |\n|---|---|---|')
    for f, v in leaf.most_common(25):
        print(f'| {v} | {100 * v / tot:.0f} | `{f[:110]}` |')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else '')
