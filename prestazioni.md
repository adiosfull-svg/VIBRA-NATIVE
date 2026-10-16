## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| husky-34-it-portrait | 660 | 69 | 10.5% | 10.7 ms | 38.5 ms | 247.7 ms | 254 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| husky-34-it-portrait | 10-15 19:49:20 | 14 | 8 | 101.2 ms | 148.3 ms | 172 ms | in=0,anim=3,layout=0,draw=27,sync=3,cmd=7,swap=0,gpu=3 |
| husky-34-it-portrait | 10-15 19:48:20 | 10 | 2 | 247.7 ms | 247.7 ms | 254 ms | in=0,anim=31,layout=3,draw=84,sync=10,cmd=120,swap=0,gpu=5 |
| husky-34-it-portrait | 10-15 19:48:40 | 46 | 9 | 84.1 ms | 166.9 ms | 170 ms | in=0,anim=44,layout=0,draw=55,sync=3,cmd=63,swap=0,gpu=4 |
| husky-34-it-portrait | 10-15 19:48:10 | 119 | 21 | 67.0 ms | 166.4 ms | 238 ms | in=0,anim=6,layout=0,draw=78,sync=2,cmd=5,swap=0,gpu=3 |
| husky-34-it-portrait | 10-15 19:50:10 | 44 | 7 | 49.5 ms | 158.6 ms | 172 ms | in=0,anim=3,layout=0,draw=29,sync=2,cmd=5,swap=0,gpu=3 |
| husky-34-it-portrait | 10-15 19:53:11 | 18 | 2 | 16.9 ms | 79.4 ms | 85 ms | in=0,anim=36,layout=1,draw=33,sync=5,cmd=5,swap=0,gpu=4 |
| husky-34-it-portrait | 10-15 19:48:05 | 54 | 5 | 34.9 ms | 89.2 ms | 139 ms | in=0,anim=3,layout=1,draw=18,sync=1,cmd=67,swap=0,gpu=4 |
| husky-34-it-portrait | 10-15 19:54:46 | 45 | 2 | 26.1 ms | 89.7 ms | 93 ms | in=0,anim=40,layout=1,draw=33,sync=7,cmd=7,swap=0,gpu=4 |
| husky-34-it-portrait | 10-15 19:51:45 | 47 | 2 | 10.8 ms | 87.1 ms | 90 ms | in=0,anim=4,layout=1,draw=2,sync=4,cmd=8,swap=1,gpu=4 |
| husky-34-it-portrait | 10-15 19:54:31 | 50 | 2 | 12.6 ms | 37.2 ms | 73 ms | in=0,anim=4,layout=0,draw=1,sync=2,cmd=5,swap=0,gpu=3 |
| husky-34-it-portrait | 10-15 19:52:45 | 27 | 1 | 13.9 ms | 225.9 ms | 226 ms | in=0,anim=39,layout=4,draw=122,sync=22,cmd=34,swap=1,gpu=2 |
| husky-34-it-portrait | 10-15 19:49:25 | 28 | 1 | 13.3 ms | 17.1 ms | 17 ms | in=0,anim=0,layout=0,draw=0,sync=4,cmd=8,swap=1,gpu=3 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/8222088774261398975
