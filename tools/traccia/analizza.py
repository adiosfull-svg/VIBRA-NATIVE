#!/usr/bin/env python3
"""Cosa occupa il thread UI dell'app in una traccia Perfetto (tests/emulatore/run.sh con TRACE=1).

Per ogni intervallo in cui il thread principale di com.vibra.mobile resta occupato più di SOGLIA ms
(una fetta di primo livello: Choreographer#doFrame, un messaggio del Looper, il montaggio di Fabric...)
elenca le operazioni annidate che pesano di più, così si vede la causa di uno scatto invece di
indovinarla. Uso: analizza.py <traccia.pftrace> [soglia_ms]  → testo su stdout.
Richiede il pacchetto python `perfetto` (pip install perfetto); TP_BIN = trace_processor_shell già
scaricato (es. dalle release di github.com/google/perfetto) se get.perfetto.dev non è raggiungibile.
"""
import os
import sys

from perfetto.trace_processor import TraceProcessor, TraceProcessorConfig

PKG = 'com.vibra.mobile'


def main(path, soglia=40):
    binp = os.environ.get('TP_BIN')
    tp = TraceProcessor(trace=path, config=TraceProcessorConfig(bin_path=binp) if binp else None)
    # il thread principale si chiama come il pacchetto (troncato a 15 caratteri: "om.vibra.mobile");
    # il processo può risultare "<pre-initialized>" se è nato dallo zygote dopo l'inizio della traccia
    main_tid = tp.query(f"""
        select t.utid from thread t join thread_track tt using(utid) join slice s on s.track_id = tt.id
        left join process p on t.upid = p.upid
        where ('{PKG}' like '%' || t.name) or (p.name like '{PKG}%' and t.tid = p.pid) group by t.utid order by count(*) desc limit 1""").as_pandas_dataframe()
    if main_tid.empty:
        print('thread principale dell\'app non trovato')
        return
    utid = int(main_tid.utid[0])
    top = tp.query(f"""
        select s.id, s.ts, s.dur, s.name from slice s join thread_track t on s.track_id = t.id
        where t.utid = {utid} and s.depth = 0 and s.dur > {soglia} * 1e6
        order by s.ts""").as_pandas_dataframe()
    t0 = tp.query('select start_ts from trace_bounds').as_pandas_dataframe().start_ts[0]
    print(f'{len(top)} intervalli del thread UI oltre {soglia} ms\n')
    for _, r in top.iterrows():
        print(f"[{(r.ts - t0) / 1e9:7.2f}s] {r.dur / 1e6:6.1f} ms  {r['name']}")
        kids = tp.query(f"""
            select name, count(*) n, sum(dur) tot, max(dur) mx from descendant_slice({int(r.id)})
            group by name order by tot desc limit 12""").as_pandas_dataframe()
        for _, k in kids.iterrows():
            print(f"      {k.tot / 1e6:6.1f} ms  ×{int(k.n):<4} {k['name'][:110]}")


if __name__ == '__main__':
    main(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 40)
