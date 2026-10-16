#!/usr/bin/env python3
"""Tabella delle prestazioni di un test Firebase Test Lab (workflow .github/workflows/testlab.yml).

Legge dal log di `gcloud firebase test android run` (out/testlab.log) gli id di storia ed esecuzione,
poi chiede alla Tool Results API, per ogni dispositivo: graphicsStats (frame totali, frame persi,
percentili dei tempi per frame, frame lenti per thread UI/disegno) e la serie degli FPS.
Uso: prestazioni.py <cartella out>  → Markdown su stdout.
"""
import glob
import json
import os
import re
import subprocess
import sys
import urllib.request

API = 'https://toolresults.googleapis.com/toolresults/v1beta3'


def token():
    return subprocess.check_output(['gcloud', 'auth', 'print-access-token'], text=True).strip()


def get(path, tok):
    req = urllib.request.Request(f'{API}/{path}', headers={'Authorization': f'Bearer {tok}'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


FRAMES = re.compile(r'^(\d\d-\d\d \d\d:\d\d:\d\d)\.\d+.*VIBRA_FRAMES.*n=(\d+) jank=(\d+) p50=([\d.]+) p90=([\d.]+) p99=([\d.]+) max=([\d.]+)(?: worst=(\S*))?')


def frames_from_logcat(out):
    """Righe VIBRA_FRAMES (plugins/withFrameMetrics.js) nel logcat di ogni dispositivo."""
    files = sorted(glob.glob(f'{out}/**/logcat', recursive=True))
    if not files:
        return
    print('## Fluidità misurata dall\'app (FrameMetrics di Android, finestre di 5 s)\n')
    print('Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).\n')
    print('| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |')
    print('|---|---|---|---|---|---|---|---|')
    worst = []
    for f in files:
        dev = os.path.basename(os.path.dirname(f))
        rows = []
        for line in open(f, encoding='utf-8', errors='replace'):
            m = FRAMES.search(line)
            if m:
                t, n, j, p50, p90, p99, mx, w = m.groups()
                rows.append((t, int(n), int(j), float(p50), float(p90), float(p99), float(mx), w or ''))
        if not rows:
            print(f'| {dev} | nessuna riga VIBRA_FRAMES (build senza VIBRA_FRAME_METRICS?) | | | | | | |')
            continue
        n = sum(r[1] for r in rows)
        j = sum(r[2] for r in rows)
        p50s = sorted(r[3] for r in rows)
        print(f'| {dev} | {n} | {j} | {100 * j / n:.1f}% | {p50s[len(p50s) // 2]:.1f} ms | {sum(r[4] for r in rows) / len(rows):.1f} ms | {max(r[5] for r in rows):.1f} ms | {max(r[6] for r in rows):.0f} ms |')
        start = rows[0][0]
        worst += [(r[2] / r[1], dev, r, start) for r in rows if r[1] >= 10]
    worst.sort(reverse=True)
    if worst:
        print('\n### Finestre peggiori (da guardare nel video del dispositivo)\n')
        print('| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |')
        print('|---|---|---|---|---|---|---|---|')
        for _, dev, r, _s in worst[:12]:
            print(f'| {dev} | {r[0]} | {r[1]} | {r[2]} | {r[4]:.1f} ms | {r[5]:.1f} ms | {r[6]:.0f} ms | {r[7]} |')
    print()


def main(out):
    frames_from_logcat(out)
    if not os.path.exists(f'{out}/testlab.log'):
        print('Test Lab non partito (manca testlab.log): vedi il log del job.')
        return
    log = open(f'{out}/testlab.log', encoding='utf-8', errors='replace').read()
    m = re.search(r'project/([^/]+)/testlab/histories/([^/]+)/matrices/([^/\]\s]+)', log)
    if not m:
        print('Nessun link ai risultati nel log di Test Lab (test non partito?).')
        return
    project, history, execution = m.groups()
    tok = token()
    print(f'# Prestazioni su telefoni veri (Test Lab)\n')
    print('Dati di Android per tutta l\'esplorazione: un frame "perso" supera i 16 ms (60 Hz).\n')
    print('| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |')
    print('|---|---|---|---|---|---|---|---|---|---|---|---|')
    steps = get(f'projects/{project}/histories/{history}/executions/{execution}/steps', tok).get('steps', [])
    for st in steps:
        sid = st['stepId']
        dev = ', '.join(f"{d['key']}={d['value']}" for d in st.get('dimensionValue', []) if d['key'] in ('Model', 'Version'))
        base = f'projects/{project}/histories/{history}/executions/{execution}/steps/{sid}'
        try:
            summary = get(f'{base}/perfMetricsSummary', tok)
            json.dump(summary, open(f'{out}/perf-summary-{sid}.json', 'w'), indent=1)
            g = summary.get('graphicsStats', {})
        except Exception as e:  # noqa: BLE001
            g = {}
            print(f'<!-- perfMetricsSummary {sid}: {e} -->')
        fps = []
        try:
            series = get(f'{base}/perfSampleSeries', tok).get('perfSampleSeries', [])
            json.dump(series, open(f'{out}/perf-series-{sid}.json', 'w'), indent=1)
            for s in series:
                if s.get('basicPerfSampleSeries', {}).get('sampleSeriesLabel') == 'graphicsFrameRate':
                    fps += [x['value'] for x in get(f"{base}/perfSampleSeries/{s['sampleSeriesId']}/samples", tok).get('perfSamples', [])]
        except Exception as e:  # noqa: BLE001
            print(f'<!-- perfSampleSeries {sid}: {e} -->')
        tot = int(g.get('totalFrames', 0) or 0)
        jank = int(g.get('jankyFrames', 0) or 0)
        pct = f'{100 * jank / tot:.1f}%' if tot else '-'
        ms = lambda k: f"{g[k]} ms" if k in g else '-'  # noqa: E731
        avg = f'{sum(fps) / len(fps):.0f}' if fps else '-'
        low = f'{min(fps):.0f}' if fps else '-'
        print(f"| {dev} | {tot or '-'} | {jank if tot else '-'} | {pct} | {ms('p50Millis')} | {ms('p90Millis')} | {ms('p95Millis')} | {ms('p99Millis')} | {g.get('slowUiThreadCount', '-')} | {g.get('slowDrawCount', '-')} | {avg} | {low} |")
    print(f'\nConsole: https://console.firebase.google.com/project/{project}/testlab/histories/{history}/matrices/{execution}')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'out')
