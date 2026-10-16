#!/usr/bin/env python3
"""Tabella delle prestazioni di un test Firebase Test Lab (workflow .github/workflows/testlab.yml).

Legge dal log di `gcloud firebase test android run` (out/testlab.log) gli id di storia ed esecuzione,
poi chiede alla Tool Results API, per ogni dispositivo: graphicsStats (frame totali, frame persi,
percentili dei tempi per frame, frame lenti per thread UI/disegno) e la serie degli FPS.
Uso: prestazioni.py <cartella out>  → Markdown su stdout.
"""
import json
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


def main(out):
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
            g = get(f'{base}/perfMetricsSummary', tok).get('graphicsStats', {})
        except Exception as e:  # noqa: BLE001
            g = {}
            print(f'<!-- perfMetricsSummary {sid}: {e} -->')
        fps = []
        try:
            for s in get(f'{base}/perfSampleSeries', tok).get('perfSampleSeries', []):
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
