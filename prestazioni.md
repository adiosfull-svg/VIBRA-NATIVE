## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 2910 | 392 | 13.5% | 10.9 ms | 19.7 ms | 79.0 ms | 105 ms |
| husky-34-it-portrait | 1440 | 91 | 6.3% | 10.5 ms | 17.9 ms | 155.1 ms | 236 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 10-27 14:10:09 | 10 | 10 | 38.5 ms | 38.5 ms | 39 ms | wait=0,in=0,anim=0,layout=3,draw=1,sync=7,cmd=15,swap=1,gpu=11 |
| e3q-34-it-portrait | 10-27 14:10:04 | 11 | 11 | 35.9 ms | 35.9 ms | 38 ms | wait=0,in=0,anim=0,layout=3,draw=1,sync=6,cmd=14,swap=1,gpu=12 |
| e3q-34-it-portrait | 10-27 14:09:54 | 10 | 10 | 24.8 ms | 24.8 ms | 25 ms | wait=0,in=0,anim=0,layout=1,draw=0,sync=2,cmd=9,swap=1,gpu=12 |
| e3q-34-it-portrait | 10-27 14:08:54 | 10 | 9 | 12.6 ms | 12.6 ms | 13 ms | wait=1,in=0,anim=1,layout=0,draw=0,sync=1,cmd=7,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-27 14:09:59 | 20 | 17 | 24.5 ms | 27.7 ms | 37 ms | wait=0,in=0,anim=0,layout=2,draw=1,sync=6,cmd=15,swap=1,gpu=12 |
| e3q-34-it-portrait | 10-27 14:09:49 | 13 | 11 | 25.3 ms | 30.1 ms | 32 ms | wait=0,in=0,anim=0,layout=3,draw=1,sync=6,cmd=11,swap=1,gpu=10 |
| e3q-34-it-portrait | 10-27 14:10:14 | 12 | 10 | 25.6 ms | 25.7 ms | 27 ms | wait=19,in=0,anim=0,layout=0,draw=0,sync=1,cmd=3,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-27 14:04:48 | 22 | 18 | 32.4 ms | 35.6 ms | 48 ms | wait=1,in=0,anim=0,layout=3,draw=1,sync=7,cmd=23,swap=2,gpu=12 |
| e3q-34-it-portrait | 10-27 14:09:34 | 10 | 8 | 25.6 ms | 25.6 ms | 28 ms | wait=0,in=0,anim=0,layout=3,draw=1,sync=2,cmd=9,swap=1,gpu=10 |
| e3q-34-it-portrait | 10-27 14:05:08 | 14 | 11 | 13.7 ms | 20.7 ms | 32 ms | wait=1,in=0,anim=15,layout=0,draw=6,sync=3,cmd=4,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-27 14:10:19 | 25 | 19 | 23.7 ms | 24.3 ms | 24 ms | wait=0,in=0,anim=0,layout=1,draw=0,sync=2,cmd=9,swap=1,gpu=11 |
| e3q-34-it-portrait | 10-27 14:10:24 | 12 | 9 | 21.7 ms | 35.1 ms | 35 ms | wait=0,in=0,anim=0,layout=2,draw=1,sync=6,cmd=14,swap=1,gpu=11 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |
| Model=e3q, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/7636482395974873156
