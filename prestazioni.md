## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 1103 | 281 | 25.5% | 10.8 ms | 27.9 ms | 139.4 ms | 155 ms |
| husky-34-it-portrait | 661 | 72 | 10.9% | 10.8 ms | 51.4 ms | 299.4 ms | 326 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 10-16 01:23:29 | 13 | 10 | 11.3 ms | 12.1 ms | 19 ms | wait=0,in=0,anim=9,layout=0,draw=0,sync=3,cmd=4,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-16 01:26:04 | 15 | 11 | 15.5 ms | 83.2 ms | 89 ms | wait=0,in=0,anim=35,layout=1,draw=26,sync=19,cmd=5,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-16 01:25:04 | 17 | 11 | 13.2 ms | 42.2 ms | 50 ms | wait=0,in=0,anim=20,layout=0,draw=12,sync=9,cmd=4,swap=0,gpu=3 |
| e3q-34-it-portrait | 10-16 01:23:04 | 13 | 8 | 9.7 ms | 10.3 ms | 11 ms | wait=0,in=0,anim=4,layout=0,draw=0,sync=2,cmd=3,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-16 01:22:19 | 30 | 16 | 99.8 ms | 130.0 ms | 155 ms | wait=115,in=0,anim=4,layout=0,draw=23,sync=5,cmd=4,swap=0,gpu=3 |
| e3q-34-it-portrait | 10-16 01:27:34 | 11 | 5 | 45.7 ms | 45.7 ms | 52 ms | wait=0,in=0,anim=46,layout=0,draw=1,sync=1,cmd=2,swap=1,gpu=1 |
| e3q-34-it-portrait | 10-16 01:28:09 | 18 | 8 | 15.6 ms | 15.9 ms | 16 ms | wait=1,in=0,anim=0,layout=2,draw=1,sync=0,cmd=1,swap=2,gpu=10 |
| e3q-34-it-portrait | 10-16 01:23:14 | 40 | 17 | 40.9 ms | 128.6 ms | 130 ms | wait=114,in=0,anim=3,layout=0,draw=4,sync=2,cmd=3,swap=0,gpu=3 |
| e3q-34-it-portrait | 10-16 01:22:34 | 12 | 5 | 10.0 ms | 22.2 ms | 27 ms | wait=2,in=0,anim=1,layout=0,draw=0,sync=2,cmd=19,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-16 01:21:54 | 149 | 58 | 50.0 ms | 88.3 ms | 115 ms | wait=58,in=0,anim=1,layout=0,draw=47,sync=2,cmd=4,swap=0,gpu=3 |
| e3q-34-it-portrait | 10-16 01:28:04 | 16 | 6 | 20.5 ms | 20.7 ms | 30 ms | wait=1,in=0,anim=27,layout=1,draw=0,sync=0,cmd=1,swap=1,gpu=1 |
| e3q-34-it-portrait | 10-16 01:22:44 | 40 | 13 | 27.9 ms | 117.6 ms | 131 ms | wait=103,in=0,anim=2,layout=0,draw=19,sync=2,cmd=3,swap=0,gpu=2 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |
| Model=e3q, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/7520548616720731916
