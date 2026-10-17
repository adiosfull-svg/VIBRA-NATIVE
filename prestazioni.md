## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 2161 | 338 | 15.6% | 11.5 ms | 24.0 ms | 258.2 ms | 300 ms |
| husky-34-it-portrait | 1459 | 122 | 8.4% | 9.9 ms | 19.0 ms | 202.5 ms | 389 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 10-17 09:54:54 | 13 | 11 | 15.8 ms | 15.9 ms | 18 ms | wait=0,in=0,anim=6,layout=1,draw=0,sync=1,cmd=3,swap=1,gpu=7 |
| e3q-34-it-portrait | 10-17 10:00:00 | 17 | 12 | 29.2 ms | 80.2 ms | 83 ms | wait=0,in=0,anim=31,layout=0,draw=18,sync=8,cmd=22,swap=0,gpu=3 |
| e3q-34-it-portrait | 10-17 09:56:14 | 27 | 19 | 27.3 ms | 44.8 ms | 56 ms | wait=0,in=0,anim=35,layout=0,draw=11,sync=7,cmd=2,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-17 09:58:59 | 11 | 6 | 69.6 ms | 69.6 ms | 89 ms | wait=41,in=0,anim=7,layout=1,draw=18,sync=2,cmd=17,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-17 09:54:29 | 13 | 7 | 21.8 ms | 25.4 ms | 40 ms | wait=0,in=0,anim=5,layout=1,draw=0,sync=1,cmd=26,swap=1,gpu=7 |
| e3q-34-it-portrait | 10-17 09:57:04 | 42 | 22 | 32.2 ms | 70.5 ms | 119 ms | wait=0,in=0,anim=66,layout=0,draw=14,sync=9,cmd=13,swap=1,gpu=16 |
| e3q-34-it-portrait | 10-17 09:55:19 | 11 | 5 | 13.5 ms | 13.5 ms | 14 ms | wait=0,in=0,anim=1,layout=0,draw=0,sync=2,cmd=8,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-17 09:53:44 | 150 | 65 | 38.0 ms | 90.8 ms | 107 ms | wait=85,in=0,anim=0,layout=7,draw=0,sync=0,cmd=13,swap=1,gpu=1 |
| e3q-34-it-portrait | 10-17 09:55:04 | 49 | 20 | 19.3 ms | 50.9 ms | 55 ms | wait=0,in=0,anim=25,layout=0,draw=18,sync=4,cmd=5,swap=0,gpu=3 |
| e3q-34-it-portrait | 10-17 09:57:19 | 84 | 34 | 28.3 ms | 68.8 ms | 73 ms | wait=0,in=0,anim=54,layout=0,draw=7,sync=3,cmd=4,swap=1,gpu=4 |
| e3q-34-it-portrait | 10-17 09:59:39 | 10 | 4 | 42.0 ms | 42.0 ms | 56 ms | wait=0,in=0,anim=43,layout=0,draw=3,sync=3,cmd=3,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-17 09:54:39 | 48 | 17 | 18.9 ms | 52.3 ms | 55 ms | wait=30,in=0,anim=4,layout=0,draw=0,sync=1,cmd=13,swap=1,gpu=8 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=e3q, Version=34 | - | - | - | - | - | - | - | - | - | - | - |
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/7654619341100331673
