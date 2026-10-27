## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 1121 | 296 | 26.4% | 11.9 ms | 25.5 ms | 135.1 ms | 149 ms |
| husky-34-it-portrait | 12837 | 78 | 0.6% | 7.4 ms | 13.0 ms | 248.6 ms | 268 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 10-27 14:32:02 | 13 | 12 | 14.8 ms | 15.6 ms | 18 ms | wait=0,in=0,anim=1,layout=0,draw=0,sync=2,cmd=5,swap=1,gpu=9 |
| e3q-34-it-portrait | 10-27 14:31:27 | 13 | 12 | 15.0 ms | 15.1 ms | 15 ms | wait=0,in=0,anim=0,layout=0,draw=0,sync=1,cmd=10,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-27 14:30:57 | 13 | 9 | 16.9 ms | 23.0 ms | 29 ms | wait=0,in=0,anim=1,layout=0,draw=0,sync=1,cmd=18,swap=1,gpu=7 |
| e3q-34-it-portrait | 10-27 14:36:47 | 10 | 6 | 14.4 ms | 14.4 ms | 27 ms | wait=0,in=0,anim=13,layout=1,draw=4,sync=2,cmd=4,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-27 14:34:12 | 49 | 24 | 42.3 ms | 62.4 ms | 101 ms | wait=0,in=0,anim=59,layout=0,draw=13,sync=9,cmd=18,swap=1,gpu=1 |
| e3q-34-it-portrait | 10-27 14:34:27 | 90 | 36 | 17.8 ms | 39.6 ms | 67 ms | wait=0,in=0,anim=49,layout=0,draw=7,sync=3,cmd=2,swap=1,gpu=5 |
| e3q-34-it-portrait | 10-27 14:37:02 | 48 | 18 | 22.1 ms | 44.4 ms | 49 ms | wait=1,in=0,anim=13,layout=0,draw=13,sync=13,cmd=5,swap=0,gpu=3 |
| e3q-34-it-portrait | 10-27 14:31:12 | 48 | 18 | 22.0 ms | 57.8 ms | 60 ms | wait=0,in=0,anim=23,layout=0,draw=19,sync=3,cmd=11,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-27 14:31:42 | 51 | 17 | 16.3 ms | 45.9 ms | 50 ms | wait=0,in=0,anim=22,layout=0,draw=16,sync=3,cmd=5,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-27 14:30:42 | 49 | 16 | 25.8 ms | 96.7 ms | 104 ms | wait=49,in=0,anim=2,layout=0,draw=1,sync=1,cmd=15,swap=0,gpu=2 |
| e3q-34-it-portrait | 10-27 14:30:12 | 148 | 44 | 43.2 ms | 95.2 ms | 112 ms | wait=0,in=0,anim=21,layout=0,draw=15,sync=3,cmd=68,swap=1,gpu=4 |
| e3q-34-it-portrait | 10-27 14:35:52 | 31 | 6 | 15.4 ms | 27.1 ms | 34 ms | wait=6,in=0,anim=1,layout=0,draw=1,sync=0,cmd=22,swap=1,gpu=2 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |
| Model=e3q, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/5992022570409268715
