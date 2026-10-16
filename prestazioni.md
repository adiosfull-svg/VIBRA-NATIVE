## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| husky-34-it-portrait | 638 | 63 | 9.9% | 9.7 ms | 38.7 ms | 255.5 ms | 259 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| husky-34-it-portrait | 10-16 06:30:39 | 18 | 9 | 181.1 ms | 213.6 ms | 219 ms | wait=0,in=0,anim=53,layout=1,draw=47,sync=12,cmd=100,swap=0,gpu=6 |
| husky-34-it-portrait | 10-16 06:31:29 | 14 | 5 | 98.9 ms | 157.2 ms | 246 ms | wait=79,in=0,anim=8,layout=1,draw=146,sync=2,cmd=4,swap=0,gpu=6 |
| husky-34-it-portrait | 10-16 06:30:04 | 134 | 20 | 74.2 ms | 100.5 ms | 148 ms | wait=78,in=0,anim=7,layout=0,draw=54,sync=3,cmd=3,swap=1,gpu=3 |
| husky-34-it-portrait | 10-16 06:30:19 | 14 | 2 | 101.1 ms | 205.1 ms | 213 ms | wait=0,in=0,anim=35,layout=3,draw=66,sync=8,cmd=91,swap=0,gpu=10 |
| husky-34-it-portrait | 10-16 06:32:24 | 45 | 5 | 17.4 ms | 124.7 ms | 231 ms | wait=92,in=0,anim=11,layout=0,draw=115,sync=2,cmd=5,swap=0,gpu=6 |
| husky-34-it-portrait | 10-16 06:35:24 | 47 | 3 | 26.2 ms | 80.8 ms | 86 ms | wait=0,in=0,anim=35,layout=1,draw=33,sync=7,cmd=5,swap=0,gpu=4 |
| husky-34-it-portrait | 10-16 06:36:24 | 51 | 3 | 15.5 ms | 46.6 ms | 50 ms | wait=1,in=0,anim=18,layout=1,draw=20,sync=4,cmd=4,swap=0,gpu=3 |
| husky-34-it-portrait | 10-16 06:36:40 | 53 | 3 | 14.8 ms | 42.6 ms | 48 ms | wait=1,in=0,anim=18,layout=1,draw=19,sync=3,cmd=4,swap=0,gpu=2 |
| husky-34-it-portrait | 10-16 06:34:59 | 43 | 2 | 16.6 ms | 255.5 ms | 259 ms | wait=1,in=0,anim=62,layout=5,draw=120,sync=29,cmd=37,swap=0,gpu=5 |
| husky-34-it-portrait | 10-16 06:33:59 | 46 | 2 | 13.1 ms | 138.9 ms | 139 ms | wait=1,in=0,anim=30,layout=2,draw=78,sync=2,cmd=23,swap=1,gpu=4 |
| husky-34-it-portrait | 10-16 06:31:34 | 30 | 1 | 12.3 ms | 14.2 ms | 18 ms | wait=9,in=0,anim=0,layout=0,draw=0,sync=2,cmd=4,swap=0,gpu=2 |
| husky-34-it-portrait | 10-16 06:36:55 | 44 | 1 | 12.5 ms | 121.2 ms | 124 ms | wait=0,in=0,anim=43,layout=1,draw=50,sync=15,cmd=8,swap=0,gpu=4 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/5671716000264659207
