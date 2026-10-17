## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 1462 | 260 | 17.8% | 9.0 ms | 18.4 ms | 116.2 ms | 121 ms |
| husky-34-it-portrait | 866 | 67 | 7.7% | 9.9 ms | 19.5 ms | 168.1 ms | 172 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 10-17 01:26:42 | 13 | 11 | 11.7 ms | 11.8 ms | 13 ms | wait=0,in=0,anim=7,layout=0,draw=0,sync=1,cmd=2,swap=0,gpu=2 |
| e3q-34-it-portrait | 10-17 01:25:52 | 13 | 9 | 22.9 ms | 24.5 ms | 28 ms | wait=1,in=0,anim=2,layout=0,draw=0,sync=1,cmd=21,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-17 01:26:17 | 13 | 7 | 11.5 ms | 11.5 ms | 13 ms | wait=0,in=0,anim=0,layout=0,draw=0,sync=3,cmd=6,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-17 01:26:27 | 47 | 19 | 17.0 ms | 38.6 ms | 41 ms | wait=0,in=0,anim=23,layout=0,draw=8,sync=3,cmd=3,swap=0,gpu=2 |
| e3q-34-it-portrait | 10-17 01:25:07 | 144 | 57 | 37.6 ms | 79.6 ms | 116 ms | wait=91,in=0,anim=0,layout=8,draw=0,sync=0,cmd=15,swap=1,gpu=1 |
| e3q-34-it-portrait | 10-17 01:27:57 | 13 | 5 | 25.7 ms | 116.2 ms | 121 ms | wait=0,in=0,anim=22,layout=2,draw=49,sync=17,cmd=28,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-17 01:26:02 | 46 | 17 | 22.4 ms | 54.1 ms | 71 ms | wait=41,in=0,anim=14,layout=0,draw=0,sync=1,cmd=13,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-17 01:29:42 | 11 | 4 | 28.7 ms | 28.7 ms | 31 ms | wait=4,in=0,anim=2,layout=1,draw=8,sync=1,cmd=11,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-17 01:25:37 | 43 | 15 | 27.0 ms | 78.5 ms | 83 ms | wait=0,in=0,anim=29,layout=0,draw=11,sync=3,cmd=37,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-17 01:29:37 | 10 | 3 | 26.0 ms | 26.0 ms | 30 ms | wait=10,in=0,anim=0,layout=0,draw=14,sync=1,cmd=2,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-17 01:30:57 | 122 | 31 | 14.8 ms | 33.8 ms | 55 ms | wait=9,in=0,anim=3,layout=0,draw=12,sync=6,cmd=21,swap=1,gpu=4 |
| husky-34-it-portrait | 10-17 01:25:39 | 52 | 13 | 43.8 ms | 131.8 ms | 133 ms | wait=60,in=0,anim=1,layout=0,draw=1,sync=2,cmd=7,swap=0,gpu=5 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=e3q, Version=34 | - | - | - | - | - | - | - | - | - | - | - |
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/4619992838163824883
