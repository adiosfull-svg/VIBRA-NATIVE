## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| husky-34-it-portrait | 622 | 48 | 7.7% | 9.6 ms | 29.6 ms | 258.8 ms | 266 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| husky-34-it-portrait | 10-16 07:27:46 | 155 | 18 | 56.1 ms | 138.6 ms | 226 ms | wait=93,in=0,anim=14,layout=0,draw=108,sync=3,cmd=4,swap=0,gpu=5 |
| husky-34-it-portrait | 10-16 07:30:11 | 41 | 4 | 82.2 ms | 132.7 ms | 220 ms | wait=80,in=0,anim=9,layout=1,draw=113,sync=3,cmd=8,swap=0,gpu=6 |
| husky-34-it-portrait | 10-16 07:28:31 | 42 | 4 | 87.7 ms | 258.8 ms | 266 ms | wait=198,in=0,anim=2,layout=0,draw=1,sync=1,cmd=17,swap=0,gpu=2 |
| husky-34-it-portrait | 10-16 07:28:11 | 44 | 3 | 15.5 ms | 250.2 ms | 257 ms | wait=0,in=0,anim=29,layout=3,draw=96,sync=8,cmd=112,swap=0,gpu=7 |
| husky-34-it-portrait | 10-16 07:34:16 | 18 | 1 | 15.8 ms | 64.6 ms | 65 ms | wait=0,in=0,anim=21,layout=1,draw=28,sync=6,cmd=6,swap=0,gpu=1 |
| husky-34-it-portrait | 10-16 07:34:36 | 48 | 2 | 10.8 ms | 62.4 ms | 72 ms | wait=64,in=0,anim=2,layout=0,draw=1,sync=1,cmd=2,swap=0,gpu=2 |
| husky-34-it-portrait | 10-16 07:29:26 | 50 | 2 | 15.0 ms | 23.2 ms | 196 ms | wait=182,in=0,anim=2,layout=0,draw=3,sync=2,cmd=4,swap=0,gpu=3 |
| husky-34-it-portrait | 10-16 07:33:16 | 51 | 2 | 14.0 ms | 93.9 ms | 95 ms | wait=80,in=0,anim=1,layout=0,draw=0,sync=3,cmd=6,swap=0,gpu=2 |
| husky-34-it-portrait | 10-16 07:32:51 | 42 | 1 | 15.2 ms | 206.9 ms | 211 ms | wait=161,in=0,anim=1,layout=0,draw=1,sync=3,cmd=8,swap=0,gpu=3 |
| husky-34-it-portrait | 10-16 07:31:51 | 49 | 1 | 9.5 ms | 125.4 ms | 130 ms | wait=0,in=0,anim=20,layout=2,draw=78,sync=5,cmd=20,swap=0,gpu=2 |
| husky-34-it-portrait | 10-16 07:34:21 | 34 | 0 | 10.4 ms | 14.5 ms | 15 ms | wait=1,in=0,anim=0,layout=0,draw=0,sync=1,cmd=5,swap=0,gpu=4 |
| husky-34-it-portrait | 10-16 07:30:16 | 13 | 0 | 9.4 ms | 9.7 ms | 10 ms | wait=0,in=0,anim=0,layout=0,draw=0,sync=2,cmd=4,swap=0,gpu=3 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/6218818908928211195
