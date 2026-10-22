## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 1317 | 370 | 28.1% | 12.3 ms | 28.5 ms | 364.5 ms | 367 ms |
| husky-34-it-portrait | 943 | 103 | 10.9% | 10.9 ms | 25.2 ms | 187.0 ms | 214 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 10-21 18:20:28 | 13 | 12 | 15.3 ms | 22.7 ms | 24 ms | wait=0,in=0,anim=1,layout=0,draw=0,sync=1,cmd=14,swap=1,gpu=7 |
| e3q-34-it-portrait | 10-21 18:21:03 | 10 | 9 | 14.9 ms | 14.9 ms | 23 ms | wait=1,in=0,anim=13,layout=1,draw=0,sync=2,cmd=4,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-21 18:21:33 | 13 | 10 | 14.5 ms | 15.6 ms | 16 ms | wait=0,in=0,anim=1,layout=0,draw=0,sync=1,cmd=4,swap=1,gpu=10 |
| e3q-34-it-portrait | 10-21 18:23:43 | 17 | 11 | 14.9 ms | 37.7 ms | 41 ms | wait=0,in=0,anim=25,layout=0,draw=5,sync=4,cmd=4,swap=0,gpu=3 |
| e3q-34-it-portrait | 10-21 18:25:28 | 16 | 10 | 92.4 ms | 98.6 ms | 101 ms | wait=38,in=0,anim=3,layout=1,draw=1,sync=2,cmd=25,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-21 18:23:23 | 51 | 31 | 38.6 ms | 61.3 ms | 67 ms | wait=0,in=0,anim=37,layout=0,draw=10,sync=5,cmd=13,swap=0,gpu=2 |
| e3q-34-it-portrait | 10-21 18:25:13 | 68 | 33 | 17.5 ms | 46.2 ms | 73 ms | wait=0,in=0,anim=41,layout=1,draw=10,sync=11,cmd=5,swap=1,gpu=5 |
| husky-34-it-portrait | 10-21 18:24:31 | 19 | 9 | 45.0 ms | 60.4 ms | 74 ms | wait=3,in=0,anim=29,layout=0,draw=32,sync=2,cmd=4,swap=0,gpu=3 |
| e3q-34-it-portrait | 10-21 18:25:08 | 13 | 6 | 68.8 ms | 364.5 ms | 367 ms | wait=337,in=0,anim=3,layout=0,draw=2,sync=5,cmd=4,swap=0,gpu=2 |
| e3q-34-it-portrait | 10-21 18:21:13 | 46 | 20 | 18.6 ms | 51.3 ms | 52 ms | wait=0,in=0,anim=31,layout=0,draw=8,sync=3,cmd=6,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-21 18:23:38 | 74 | 31 | 21.9 ms | 40.2 ms | 69 ms | wait=0,in=0,anim=46,layout=0,draw=7,sync=6,cmd=6,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-21 18:19:33 | 138 | 54 | 49.6 ms | 80.5 ms | 91 ms | wait=18,in=0,anim=2,layout=1,draw=14,sync=3,cmd=51,swap=1,gpu=1 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=e3q, Version=34 | - | - | - | - | - | - | - | - | - | - | - |
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/7254139847873789814
