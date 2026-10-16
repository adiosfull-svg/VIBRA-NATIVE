## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| husky-34-it-portrait | 819 | 76 | 9.3% | 10.0 ms | 26.5 ms | 262.3 ms | 266 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| husky-34-it-portrait | 10-16 07:55:48 | 33 | 9 | 73.1 ms | 89.4 ms | 151 ms | wait=47,in=0,anim=15,layout=1,draw=76,sync=2,cmd=5,swap=0,gpu=4 |
| husky-34-it-portrait | 10-16 07:56:13 | 10 | 2 | 20.3 ms | 20.3 ms | 21 ms | wait=0,in=0,anim=10,layout=0,draw=0,sync=3,cmd=4,swap=0,gpu=2 |
| husky-34-it-portrait | 10-16 07:55:08 | 55 | 10 | 20.9 ms | 137.1 ms | 140 ms | wait=0,in=0,anim=8,layout=0,draw=114,sync=2,cmd=7,swap=0,gpu=6 |
| husky-34-it-portrait | 10-16 07:59:54 | 17 | 3 | 16.8 ms | 17.0 ms | 21 ms | wait=9,in=0,anim=1,layout=0,draw=0,sync=2,cmd=5,swap=0,gpu=3 |
| husky-34-it-portrait | 10-16 07:54:03 | 102 | 16 | 70.6 ms | 129.7 ms | 150 ms | wait=59,in=0,anim=1,layout=0,draw=0,sync=1,cmd=40,swap=0,gpu=1 |
| husky-34-it-portrait | 10-16 07:54:28 | 47 | 7 | 78.6 ms | 205.1 ms | 213 ms | wait=142,in=0,anim=2,layout=0,draw=1,sync=1,cmd=18,swap=0,gpu=3 |
| husky-34-it-portrait | 10-16 07:54:08 | 14 | 2 | 87.7 ms | 177.0 ms | 183 ms | wait=0,in=0,anim=27,layout=3,draw=60,sync=6,cmd=83,swap=0,gpu=4 |
| husky-34-it-portrait | 10-16 07:55:53 | 13 | 1 | 24.6 ms | 25.3 ms | 123 ms | wait=97,in=0,anim=0,layout=0,draw=0,sync=4,cmd=13,swap=1,gpu=7 |
| husky-34-it-portrait | 10-16 07:59:38 | 42 | 3 | 25.2 ms | 158.8 ms | 160 ms | wait=130,in=0,anim=1,layout=0,draw=0,sync=2,cmd=8,swap=0,gpu=2 |
| husky-34-it-portrait | 10-16 07:53:58 | 45 | 3 | 30.5 ms | 99.3 ms | 124 ms | wait=22,in=0,anim=2,layout=1,draw=23,sync=1,cmd=73,swap=0,gpu=3 |
| husky-34-it-portrait | 10-16 07:57:13 | 44 | 2 | 14.0 ms | 116.5 ms | 118 ms | wait=0,in=0,anim=14,layout=1,draw=67,sync=4,cmd=28,swap=1,gpu=4 |
| husky-34-it-portrait | 10-16 07:59:28 | 49 | 2 | 11.3 ms | 50.7 ms | 71 ms | wait=57,in=0,anim=3,layout=0,draw=1,sync=1,cmd=4,swap=0,gpu=5 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/5660339225288414878
