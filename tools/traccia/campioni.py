#!/usr/bin/env python3
"""Funzioni che occupano il thread UI nei blocchi lunghi (campioni linux.perf di una traccia Perfetto).

Per i frame del thread principale di com.vibra.mobile più lunghi di SOGLIA ms conta, sui campioni
caduti dentro quei frame, le funzioni presenti nello stack (tempo "inclusivo": la funzione o qualcosa
che ha chiamato) e quelle in cima allo stack ("esclusivo"). Così si vede quale codice c'è dietro la
fase "draw"/"anim" di uno scatto. Uso: campioni.py <traccia.pftrace> [soglia_ms] [quante]
TP_BIN come in analizza.py.
"""
import collections
import os
import sys

from perfetto.trace_processor import TraceProcessor, TraceProcessorConfig

PKG = 'com.vibra.mobile'


def main(path, soglia=150, quante=40):
    binp = os.environ.get('TP_BIN')
    tp = TraceProcessor(trace=path, config=TraceProcessorConfig(bin_path=binp) if binp else None)
    q = lambda s: tp.query(s).as_pandas_dataframe()  # noqa: E731
    m = q(f"""select t.utid from thread t join thread_track tt using(utid) join slice s on s.track_id = tt.id
              where '{PKG}' like '%' || t.name group by t.utid order by count(*) desc limit 1""")
    if m.empty:
        print('thread principale non trovato'); return
    utid = int(m.utid[0])
    frames = q(f"""select s.ts, s.dur from slice s join thread_track tt on s.track_id = tt.id
                   where tt.utid = {utid} and s.depth = 0 and s.dur > {soglia} * 1e6""")
    samples = q(f'select ts, callsite_id from perf_sample where utid = {utid} and callsite_id is not null')
    print(f'{len(frames)} frame oltre {soglia} ms, {len(samples)} campioni del thread UI in tutta la traccia')
    if samples.empty:
        print('nessun campione: linux.perf non attivo o app non profileable'); return
    cs = q('select c.id, c.parent_id, f.name from stack_profile_callsite c join stack_profile_frame f on c.frame_id = f.id')
    parent = dict(zip(cs.id, cs.parent_id))
    name = dict(zip(cs.id, cs.name))
    inside = []
    for ts, dur in zip(frames.ts, frames.dur):
        inside.append(samples[(samples.ts >= ts) & (samples.ts < ts + dur)])
    sel = [x for df in inside for x in df.callsite_id]
    print(f'{len(sel)} campioni dentro quei frame\n')
    incl, excl = collections.Counter(), collections.Counter()
    for c in sel:
        c = int(c)
        excl[name.get(c, '?')] += 1
        seen = set()
        while c is not None and c == c:
            n = name.get(c, '?')
            if n not in seen:
                incl[n] += 1
                seen.add(n)
            p = parent.get(c)
            c = int(p) if p is not None and p == p else None
    tot = max(1, len(sel))
    print('## In cima allo stack (dove il tempo è speso davvero)')
    for n, k in excl.most_common(quante):
        print(f'  {100 * k / tot:5.1f}%  {n[:150]}')
    print('\n## Nello stack (funzione o ciò che ha chiamato)')
    for n, k in incl.most_common(quante * 2):
        print(f'  {100 * k / tot:5.1f}%  {n[:150]}')


if __name__ == '__main__':
    a = sys.argv
    main(a[1], float(a[2]) if len(a) > 2 else 150, int(a[3]) if len(a) > 3 else 40)
