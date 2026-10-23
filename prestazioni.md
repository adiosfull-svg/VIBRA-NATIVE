## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 1357 | 317 | 23.4% | 10.9 ms | 23.4 ms | 344.0 ms | 345 ms |
| husky-34-it-portrait | 2002 | 62 | 3.1% | 8.1 ms | 20.1 ms | 183.8 ms | 195 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo | fasi del più lungo (ms) |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 10-22 18:29:02 | 13 | 10 | 12.9 ms | 17.5 ms | 20 ms | wait=0,in=0,anim=10,layout=0,draw=0,sync=2,cmd=5,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-22 18:28:32 | 13 | 10 | 12.0 ms | 14.1 ms | 20 ms | wait=0,in=0,anim=9,layout=0,draw=0,sync=3,cmd=5,swap=1,gpu=2 |
| e3q-34-it-portrait | 10-22 18:28:02 | 13 | 10 | 15.7 ms | 19.6 ms | 23 ms | wait=0,in=0,anim=1,layout=0,draw=0,sync=1,cmd=12,swap=1,gpu=9 |
| e3q-34-it-portrait | 10-22 18:29:47 | 37 | 23 | 12.1 ms | 130.9 ms | 133 ms | wait=0,in=0,anim=66,layout=1,draw=34,sync=22,cmd=10,swap=1,gpu=1 |
| e3q-34-it-portrait | 10-22 18:30:52 | 53 | 27 | 26.5 ms | 48.8 ms | 65 ms | wait=0,in=0,anim=27,layout=0,draw=21,sync=3,cmd=12,swap=0,gpu=1 |
| e3q-34-it-portrait | 10-22 18:32:47 | 19 | 8 | 58.0 ms | 70.2 ms | 78 ms | wait=1,in=0,anim=0,layout=0,draw=24,sync=22,cmd=27,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-22 18:27:42 | 46 | 19 | 20.6 ms | 83.5 ms | 87 ms | wait=0,in=0,anim=28,layout=0,draw=20,sync=2,cmd=33,swap=0,gpu=2 |
| e3q-34-it-portrait | 10-22 18:28:42 | 47 | 19 | 17.8 ms | 50.9 ms | 61 ms | wait=7,in=0,anim=13,layout=0,draw=19,sync=12,cmd=7,swap=1,gpu=3 |
| e3q-34-it-portrait | 10-22 18:30:02 | 29 | 10 | 14.5 ms | 34.3 ms | 70 ms | wait=0,in=0,anim=52,layout=0,draw=11,sync=5,cmd=1,swap=0,gpu=1 |
| e3q-34-it-portrait | 10-22 18:33:12 | 10 | 3 | 49.6 ms | 49.6 ms | 68 ms | wait=27,in=0,anim=28,layout=0,draw=5,sync=2,cmd=5,swap=0,gpu=2 |
| e3q-34-it-portrait | 10-22 18:28:12 | 54 | 16 | 14.9 ms | 50.3 ms | 54 ms | wait=0,in=0,anim=22,layout=0,draw=15,sync=3,cmd=10,swap=1,gpu=2 |
| husky-34-it-portrait | 10-22 18:31:49 | 51 | 14 | 42.0 ms | 59.3 ms | 97 ms | wait=0,in=0,anim=40,layout=0,draw=29,sync=2,cmd=23,swap=0,gpu=3 |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=e3q, Version=34 | - | - | - | - | - | - | - | - | - | - | - |
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/4890613743653601960
