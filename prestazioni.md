## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 356 | 180 | 50.6% | 13.9 ms | 38.4 ms | 158.3 ms | 180 ms |
| husky-34-it-portrait | 337 | 59 | 17.5% | 20.1 ms | 37.9 ms | 184.9 ms | 207 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 10-19 15:36:27 | 13 | 13 | 14.6 ms | 15.1 ms | 18 ms | wait=0,in=0,anim=7,layout=1,draw=0,sync=4,cmd=3,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-19 15:35:01 | 13 | 11 | 18.1 ms | 18.5 ms | 25 ms | wait=0,in=0,anim=11,layout=2,draw=0,sync=5,cmd=4,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-19 15:33:41 | 12 | 9 | 46.4 ms | 48.3 ms | 51 ms | wait=0,in=0,anim=1,layout=0,draw=0,sync=6,cmd=39,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-19 15:35:41 | 36 | 21 | 42.7 ms | 62.1 ms | 62 ms | wait=0,in=0,anim=33,layout=1,draw=15,sync=5,cmd=5,swap=0,gpu=3 |
| e3q-34-it-portrait | 10-19 15:34:16 | 31 | 15 | 43.7 ms | 78.6 ms | 81 ms | wait=49,in=0,anim=3,layout=1,draw=2,sync=3,cmd=6,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-19 15:37:27 | 25 | 12 | 12.9 ms | 14.6 ms | 17 ms | wait=0,in=0,anim=6,layout=1,draw=3,sync=3,cmd=3,swap=1,gpu=1 |
| e3q-34-it-portrait | 10-19 15:32:56 | 41 | 19 | 51.1 ms | 101.8 ms | 104 ms | wait=55,in=0,anim=3,layout=1,draw=1,sync=4,cmd=5,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-19 15:31:36 | 155 | 64 | 39.1 ms | 88.8 ms | 121 ms | wait=94,in=0,anim=0,layout=9,draw=0,sync=1,cmd=16,swap=1,gpu=2 |
| husky-34-it-portrait | 10-19 15:37:04 | 30 | 12 | 52.7 ms | 119.7 ms | 120 ms | wait=0,in=0,anim=54,layout=1,draw=43,sync=6,cmd=7,swap=0,gpu=7 |
| husky-34-it-portrait | 10-19 15:33:49 | 65 | 13 | 29.9 ms | 146.8 ms | 166 ms | wait=55,in=0,anim=25,layout=1,draw=49,sync=9,cmd=19,swap=0,gpu=6 |
| husky-34-it-portrait | 10-19 15:35:39 | 11 | 2 | 75.5 ms | 75.5 ms | 80 ms | wait=58,in=0,anim=1,layout=0,draw=0,sync=3,cmd=7,swap=0,gpu=4 |
| husky-34-it-portrait | 10-19 15:31:24 | 160 | 23 | 51.8 ms | 98.4 ms | 122 ms | wait=50,in=0,anim=3,layout=0,draw=1,sync=0,cmd=38,swap=0,gpu=3 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=e3q, Version=34 | - | - | - | - | - | - | - | - | - | - | - |
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/6363777997741538222
