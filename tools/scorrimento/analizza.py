#!/usr/bin/env python3
"""Lavoro del JS per sezione durante prove/scorrimento.yaml.

Uso: analizza.py <cartella risultati (branch emulatore-risultati-<run>-<utente>)>
Le sezioni sono delimitate dagli screenshot "scorri-*" (timestamp in maestro-debug/*/scorrimento/commands.json);
"fermo" = battiti tra lo screenshot e il primo swipe, "scorre" = dal primo swipe a 3 s dopo l'ultimo.
Per ogni sezione: frameMax più lungo, render di div/btn/text, tempi dei corpi e dello scroll, eventi di scroll.
"""
import glob, json, re, sys, datetime as dt

root = sys.argv[1]
cmds = json.load(open(glob.glob(f'{root}/maestro-debug/*/scorrimento/commands.json')[0]))
shots, swipes = [], []
for c in cmds:
    cmd, md = c.get('command', {}), c.get('metadata', {})
    if md.get('status') != 'COMPLETED': continue
    if 'takeScreenshotCommand' in cmd and cmd['takeScreenshotCommand']['path'].startswith('scorri-'):
        shots.append((md['timestamp'] / 1000, cmd['takeScreenshotCommand']['path'][7:]))
    if 'swipeCommand' in cmd: swipes.append((md['timestamp'] + md.get('duration', 0)) / 1000)
shots.sort()
year = dt.datetime.fromtimestamp(shots[0][0], dt.timezone.utc).year if shots else 2026
beats = []
for line in open(f'{root}/logcat-app.txt', errors='replace'):
    if 'VIBRA diag battito' not in line: continue
    t = dt.datetime.strptime(f'{year}-{line[:18]}', '%Y-%m-%d %H:%M:%S.%f').replace(tzinfo=dt.timezone.utc).timestamp()
    body = line.split('battito ', 1)[1].strip()
    kv = dict(re.findall(r'([\w@:-]+)=(-?\d+)', body.split('|')[0]))
    times = dict((k, int(v)) for k, v in re.findall(r'([\w@-]+):(\d+)ms', body.split('|')[1] if '|' in body else ''))
    beats.append((t, kv, times, body))
print('| sezione | fase | battiti | frameMax max | ritardo max | div | btn | text | eventi scroll | corpi div+text ms | scroll-pagina ms |')
print('|---|---|---|---|---|---|---|---|---|---|---|')
for i, (t0, name) in enumerate(shots):
    t1 = shots[i + 1][0] if i + 1 < len(shots) else t0 + 120
    sw = [x for x in swipes if t0 < x < t1]
    if not sw: continue
    for fase, a, b in (('fermo', t0, sw[0] - 1), ('scorre', sw[0] - 1, sw[-1] + 3)):
        bs = [x for x in beats if a <= x[0] < b]
        if not bs: continue
        s = lambda k: sum(int(x[1].get(k, 0)) for x in bs)
        st = lambda k: sum(x[2].get(k, 0) for x in bs)
        fm = max(int(x[1].get('frameMax', 0)) for x in bs)
        rit = max(int(x[1].get('ritardo', 0)) for x in bs)
        print(f"| {name} | {fase} | {len(bs)} | {fm} | {rit} | {s('div')} | {s('btn')} | {s('text')} | {s('evento-scroll')} | {st('div-corpo') + st('text-corpo')} | {st('scroll-pagina')} |")
if '-v' in sys.argv:
    for t0, name in shots:
        print('\n##', name)
        for x in beats:
            if t0 <= x[0] < t0 + 40: print(f'  +{x[0] - t0:5.1f}s {x[3][:220]}')
