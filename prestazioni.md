## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 404 | 192 | 47.5% | 13.3 ms | 27.3 ms | 101.5 ms | 197 ms |
| husky-34-it-portrait | 420 | 83 | 19.8% | 16.3 ms | 36.7 ms | 124.6 ms | 202 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 10-19 18:39:30 | 13 | 13 | 16.1 ms | 16.2 ms | 16 ms | wait=0,in=0,anim=2,layout=0,draw=0,sync=3,cmd=4,swap=1,gpu=7 |
| e3q-34-it-portrait | 10-19 18:40:45 | 13 | 11 | 15.7 ms | 21.3 ms | 22 ms | wait=0,in=0,anim=10,layout=1,draw=0,sync=4,cmd=4,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-19 18:38:15 | 13 | 11 | 16.1 ms | 25.4 ms | 26 ms | wait=2,in=0,anim=13,layout=1,draw=0,sync=5,cmd=4,swap=1,gpu=2 |
| husky-34-it-portrait | 10-19 18:37:57 | 26 | 13 | 94.7 ms | 99.2 ms | 104 ms | wait=0,in=0,anim=29,layout=1,draw=29,sync=4,cmd=31,swap=0,gpu=9 |
| e3q-34-it-portrait | 10-19 18:36:15 | 145 | 71 | 42.3 ms | 87.7 ms | 149 ms | wait=119,in=0,anim=0,layout=11,draw=0,sync=0,cmd=16,swap=1,gpu=1 |
| e3q-34-it-portrait | 10-19 18:41:45 | 28 | 13 | 10.4 ms | 13.9 ms | 19 ms | wait=6,in=0,anim=0,layout=0,draw=0,sync=3,cmd=2,swap=1,gpu=7 |
| husky-34-it-portrait | 10-19 18:39:12 | 12 | 5 | 55.6 ms | 61.0 ms | 67 ms | wait=41,in=0,anim=1,layout=0,draw=0,sync=5,cmd=9,swap=0,gpu=3 |
| e3q-34-it-portrait | 10-19 18:40:05 | 49 | 18 | 19.2 ms | 51.3 ms | 56 ms | wait=4,in=0,anim=11,layout=0,draw=21,sync=11,cmd=5,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-19 18:37:30 | 47 | 17 | 18.9 ms | 92.9 ms | 93 ms | wait=38,in=0,anim=2,layout=1,draw=1,sync=3,cmd=5,swap=0,gpu=3 |
| e3q-34-it-portrait | 10-19 18:42:55 | 22 | 7 | 16.6 ms | 37.2 ms | 37 ms | wait=0,in=0,anim=2,layout=1,draw=0,sync=2,cmd=30,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-19 18:38:50 | 46 | 14 | 19.2 ms | 35.3 ms | 52 ms | wait=7,in=0,anim=11,layout=0,draw=14,sync=13,cmd=4,swap=1,gpu=2 |
| husky-34-it-portrait | 10-19 18:42:28 | 50 | 15 | 30.5 ms | 70.4 ms | 74 ms | wait=48,in=0,anim=2,layout=0,draw=1,sync=4,cmd=7,swap=0,gpu=4 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=e3q, Version=34 | - | - | - | - | - | - | - | - | - | - | - |
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/5108722497706983663
