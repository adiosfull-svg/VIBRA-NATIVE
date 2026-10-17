#!/usr/bin/env python3
"""Analisi dei video della gara della barra (tools/gara/navbar.mjs): per ogni app legge il video frame per
frame (ffmpeg) e misura, con lo stesso metodo per nativa e originale:
  - tocco: primo frame in cui compare il pallino di «Mostra tocchi» nel punto toccato;
  - pillola: centro dei pixel viola nella barra (finestra larga quanto la pillola con più pixel viola);
  - pagina: firma ridotta in grigio della zona sopra la barra;
  - menu: zona del pannello (e la sua parte alta, col logo) confrontata con il menu fermo.
Uso: python3 navbar_analisi.py <cartella-uscita>  (legge navbar-eventi.json, scrive navbar.json e navbar.md)
"""
import json
import statistics
import subprocess
import sys

import numpy as np

OUT = sys.argv[1]
dati = json.load(open(f'{OUT}/navbar-eventi.json'))


def frames(path):
    info = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries',
                                      'frame=pts_time,best_effort_timestamp_time,width,height', '-of', 'json', path],
                                     capture_output=True, text=True).stdout)['frames']
    w, h = int(info[0]['width']), int(info[0]['height'])
    ts = [float(fr.get('pts_time') or fr.get('best_effort_timestamp_time')) for fr in info]
    proc = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-fps_mode', 'passthrough', '-f', 'rawvideo',
                             '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    size = w * h * 3
    for t in ts:
        buf = proc.stdout.read(size)
        if len(buf) < size:
            break
        yield t, np.frombuffer(buf, np.uint8).reshape(h, w, 3)
    proc.stdout.close()
    proc.wait()


def analizza(app):
    s = app['scala']
    bar = app['barra']
    y = bar['y'] * s
    xs = [x * s for x in bar['xs']]
    item_w = (xs[1] - xs[0])
    dens = app['dens'] * s
    band = (int(y - 22 * dens), int(y + 22 * dens))  # altezza della pillola (46dp) attorno al centro
    pill_w = int(75 * dens)
    page = (int(80 * dens), int(band[0] - 30 * dens))  # sopra la barra, sotto l'intestazione di sistema
    panel_w = int(256 * dens)
    r = int(14 * dens)  # raggio della zona del tocco
    boxes = {}
    for e in app['eventi']:
        key = (int(e['x'] * s), int(e['y'] * s))
        boxes[key] = (slice(max(0, key[1] - r), key[1] + r), slice(max(0, key[0] - r), key[0] + r))

    T, PX, PAGE, PANEL, PANEL_TOP, BAND, BOX = [], [], [], [], [], [], {k: [] for k in boxes}
    prev = None
    for t, f in frames(f"{OUT}/{app['video']}"):
        g = f.mean(axis=2, dtype=np.float32)
        # pillola
        b = f[band[0]:band[1]].astype(np.int16)
        purple = (b[:, :, 2] > 45) & (b[:, :, 2] > b[:, :, 0] + 15) & (b[:, :, 0] > b[:, :, 1] + 12)
        cols = purple.sum(axis=0).astype(np.float64)
        if cols.sum() > 50:
            win = np.convolve(cols, np.ones(pill_w), 'valid')
            PX.append(float(np.argmax(win) + pill_w / 2))
        else:
            PX.append(None)
        PAGE.append(g[page[0]:page[1]:8, ::8].copy())
        PANEL.append(g[:, :panel_w][::8, ::8].copy())
        PANEL_TOP.append(g[: int(300 * dens), :panel_w][::4, ::4].copy())
        # cambiamento medio di tutta la barra: il pallino del tocco è locale, un cambio di pagina dietro al
        # vetro o la pillola in corsa no
        BAND.append(0.0 if prev is None else float(np.abs(g[band[0]:band[1]] - prev[band[0]:band[1]]).mean()))
        for k, (sy, sx) in boxes.items():
            BOX[k].append(0.0 if prev is None else float(np.abs(g[sy, sx] - prev[sy, sx]).mean()))
        T.append(t)
        prev = g
    T = np.array(T)
    n = len(T)

    def idx_at(t):
        return int(np.searchsorted(T, t))

    def tap_frame(e, t_from, t_to, soglia=6.0):
        key = (int(e['x'] * s), int(e['y'] * s))
        d = BOX[key]
        for i in range(max(1, idx_at(t_from)), min(n, idx_at(t_to))):
            if d[i] > soglia and d[i] > 2.5 * BAND[i]:
                return i
        return None

    ev = app['eventi']
    # scostamento tra l'orologio dello script e il video: dal primo tocco
    first = tap_frame(ev[0], ev[0]['t'] - 0.5, ev[0]['t'] + 3.0)
    off = (T[first] - ev[0]['t']) if first is not None else 0.25
    righe = []
    for k, e in enumerate(ev):
        if e['kind'] == 'chiudi':
            continue
        i = tap_frame(e, e['t'] + off - 0.4, e['t'] + off + 1.2)
        riga = {'kind': e['kind'], 'voce': e.get('voce'), 'apertura': e.get('apertura')}
        righe.append(riga)
        if i is None:
            riga['errore'] = 'tocco non visto nel video'
            continue
        t_tap = T[i]
        riga['t'] = round(float(t_tap), 3)
        # l'orologio dello script e quello del video scivolano un po': si riallinea a ogni tocco visto
        off = 0.7 * off + 0.3 * (t_tap - e['t'])
        nxt = ev[k + 1]['t'] + off - 0.35 if k + 1 < len(ev) else T[-1]
        end = min(n, idx_at(nxt))
        if e['kind'] in ('lento', 'veloce'):
            target = xs[e['voce']]
            before = next((PX[j] for j in range(i - 1, -1, -1) if PX[j] is not None), None)
            if before is not None and abs(before - target) > 4:
                start = next((j for j in range(i, end) if PX[j] is not None and abs(PX[j] - before) > 3), None)
                arr = next((j for j in range(start or i, end) if PX[j] is not None and abs(PX[j] - target) <= 3), None)
                if start is not None:
                    riga['pillola_ms'] = round((T[start] - t_tap) * 1000)
                if arr is not None:
                    riga['arrivata_ms'] = round((T[arr] - t_tap) * 1000)
                    if start is not None and arr > start:
                        riga['fps_animazione'] = round((arr - start) / max(1e-3, T[arr] - T[start]), 1)
            ref = PAGE[i - 1]
            pg = next((j for j in range(i, end) if np.abs(PAGE[j] - ref).mean() > 4), None)
            if pg is not None:
                riga['pagina_ms'] = round((T[pg] - t_tap) * 1000)
        elif e['kind'] == 'trascina':
            x0, x2, dur = e['x'] * s, e['x2'] * s, e['durata']
            v = (x2 - x0) / dur  # px/s del dito
            lag, mosse, last = [], 0, None
            for j in range(i, min(end, idx_at(t_tap + dur))):
                fx = x0 + v * (T[j] - t_tap)
                if fx - x0 < 20 * dens or PX[j] is None:
                    continue
                lag.append((fx - PX[j]) / v * 1000)
                if last is not None and abs(PX[j] - last) > 1:
                    mosse += 1
                last = PX[j]
            if lag:
                riga['ritardo_dito_ms'] = round(statistics.median(lag))
                riga['aggiornamenti_s'] = round(mosse / dur, 1)
            arr = next((j for j in range(i, end) if PX[j] is not None and abs(PX[j] - xs[4]) <= 3 and T[j] > t_tap + dur), None)
            if arr is not None:
                riga['arrivata_dopo_rilascio_ms'] = round((T[arr] - t_tap - dur) * 1000)
        elif e['kind'] == 'menu':
            fin = min(end, idx_at(t_tap + 1.5)) - 1
            for nome, arr_ in (('menu_completo_ms', PANEL), ('logo_ms', PANEL_TOP)):
                ref = arr_[fin]
                # primo frame da cui in poi la zona resta uguale al menu fermo
                ok = None
                for j in range(fin, i - 1, -1):
                    if (np.abs(arr_[j] - ref) > 20).mean() > 0.01:
                        break
                    ok = j
                if ok is not None:
                    riga[nome] = round((T[ok] - t_tap) * 1000)
            mv = next((j for j in range(i, fin) if (np.abs(PANEL[j] - PANEL[i - 1]) > 20).mean() > 0.01), None)
            if mv is not None:
                riga['menu_si_muove_ms'] = round((T[mv] - t_tap) * 1000)
    fps = (n - 1) / (T[-1] - T[0]) if n > 1 else 0
    return {'righe': righe, 'frame': n, 'fps_video': round(fps, 1), 'scostamento_s': round(float(off), 3),
            'livelli': app.get('livelli', [])}


ris = {'utente': dati.get('utente'), 'app': {}, 'note': dati.get('note', [])}
for nome, app in (dati.get('app') or {}).items():
    if not app:
        continue
    try:
        ris['app'][nome] = analizza(app)
    except Exception as ex:  # noqa: BLE001
        ris['note'].append(f'{nome}: analisi fallita: {ex}')
json.dump(ris, open(f'{OUT}/navbar.json', 'w'), indent=1)


def val(nome, kind, campo, f=statistics.median, **filtro):
    a = ris['app'].get(nome)
    if not a:
        return None
    xs = [r[campo] for r in a['righe'] if r['kind'] == kind and campo in r and all(r.get(k) == v for k, v in filtro.items())]
    return round(f(xs)) if xs else None


L = [f"# Gara barra in basso e menu — utente {ris['utente']}", '',
     'Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco '
     '(più basso = meglio). Mediana, tra parentesi il peggiore.', '',
     '| misura | nativa | originale |', '|---|---|---|']


def cella(nome, kind, campo, **filtro):
    m = val(nome, kind, campo, **filtro)
    w = val(nome, kind, campo, max, **filtro)
    return '–' if m is None else f'{m} ({w})'


for titolo, kind, campo in (
    ('tocco → la pillola parte (tocchi lenti)', 'lento', 'pillola_ms'),
    ('tocco → la pillola arriva (tocchi lenti)', 'lento', 'arrivata_ms'),
    ('tocco → la pagina cambia (tocchi lenti)', 'lento', 'pagina_ms'),
    ('frame al secondo della pillola in corsa', 'lento', 'fps_animazione'),
    ('tocco → la pillola parte (tocchi veloci di fila)', 'veloce', 'pillola_ms'),
    ('tocco → la pillola arriva (tocchi veloci di fila)', 'veloce', 'arrivata_ms'),
    ('tocco → la pagina cambia (tocchi veloci di fila)', 'veloce', 'pagina_ms'),
    ('trascinamento: pillola dietro al dito', 'trascina', 'ritardo_dito_ms'),
    ('trascinamento: spostamenti della pillola al secondo', 'trascina', 'aggiornamenti_s'),
):
    L.append(f"| {titolo} | {cella('nativa', kind, campo)} | {cella('originale', kind, campo)} |")
for k in (1, 2):
    for titolo, campo in (('il menu si muove', 'menu_si_muove_ms'), ('menu completo', 'menu_completo_ms'), ('logo del menu fermo e visibile', 'logo_ms')):
        L.append(f"| menu, {k}ª apertura: tocco → {titolo} | {cella('nativa', 'menu', campo, apertura=k)} | {cella('originale', 'menu', campo, apertura=k)} |")
for nome, a in ris['app'].items():
    L.append('')
    L.append(f"{nome}: {a['frame']} frame nel video ({a['fps_video']} al secondo in media), scostamento orologio {a['scostamento_s']} s")
    for lv in a.get('livelli', [])[:2]:
        L.append(f"- frame disegnati dal sistema: {lv['frame']} ({lv['al_secondo']} al secondo) nel livello {lv['nome'][:80]}")
    persi = [r for r in a['righe'] if 'errore' in r]
    if persi:
        L.append(f"- tocchi non visti: {len(persi)} ({', '.join(r['kind'] for r in persi)})")
if ris['note']:
    L += ['', '## Note'] + [f'- {x}' for x in ris['note']]
L += ['', 'Righe complete in navbar.json; video in video/.']
open(f'{OUT}/navbar.md', 'w').write('\n'.join(L) + '\n')
print('\n'.join(L))
