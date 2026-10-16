## Fluidità misurata dall'app (FrameMetrics di Android, finestre di 5 s)

Frame "perso" = oltre la scadenza del display (16,7 ms a 60 Hz, 8,3 ms a 120 Hz).

| dispositivo | frame | persi | % persi | p50 mediano | p90 medio | p99 peggiore | frame più lungo |
|---|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 446 | 186 | 41.7% | 11.0 ms | 32.5 ms | 138.8 ms | 219 ms |
| husky-34-it-portrait | 462 | 59 | 12.8% | 11.1 ms | 47.6 ms | 226.3 ms | 228 ms |

### Finestre peggiori (da guardare nel video del dispositivo)

| dispositivo | ora (logcat) | frame | persi | p90 | p99 | più lungo |
|---|---|---|---|---|---|---|
| e3q-34-it-portrait | 10-15 19:23:20 | 64 | 55 | 14.3 ms | 30.7 ms | 57 ms |
| e3q-34-it-portrait | 10-15 19:24:45 | 12 | 8 | 26.7 ms | 103.6 ms | 114 ms |
| e3q-34-it-portrait | 10-15 19:23:45 | 12 | 8 | 42.9 ms | 92.1 ms | 116 ms |
| e3q-34-it-portrait | 10-15 19:24:30 | 14 | 9 | 12.8 ms | 12.9 ms | 26 ms |
| e3q-34-it-portrait | 10-15 19:25:00 | 11 | 7 | 13.2 ms | 13.2 ms | 18 ms |
| e3q-34-it-portrait | 10-15 19:24:00 | 14 | 8 | 21.5 ms | 27.7 ms | 40 ms |
| e3q-34-it-portrait | 10-15 19:24:15 | 18 | 10 | 63.4 ms | 69.5 ms | 108 ms |
| e3q-34-it-portrait | 10-15 19:27:35 | 13 | 7 | 32.0 ms | 107.6 ms | 114 ms |
| e3q-34-it-portrait | 10-15 19:26:40 | 16 | 7 | 18.1 ms | 60.4 ms | 67 ms |
| e3q-34-it-portrait | 10-15 19:24:40 | 12 | 5 | 37.7 ms | 41.6 ms | 42 ms |
| e3q-34-it-portrait | 10-15 19:27:20 | 18 | 6 | 16.6 ms | 34.4 ms | 41 ms |
| e3q-34-it-portrait | 10-15 19:24:10 | 10 | 3 | 53.3 ms | 53.3 ms | 64 ms |

# Prestazioni su telefoni veri (Test Lab)

Dati di Android per tutta l'esplorazione: un frame "perso" supera i 16 ms (60 Hz).

| dispositivo | frame | persi | % persi | p50 | p90 | p95 | p99 | UI lento | disegno lento | FPS medio | FPS min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Model=husky, Version=34 | - | - | - | - | - | - | - | - | - | - | - |
| Model=e3q, Version=34 | - | - | - | - | - | - | - | - | - | - | - |

Console: https://console.firebase.google.com/project/vibra-test-9bb5e/testlab/histories/bh.c5b79a5e3a50e7aa/matrices/7714437708948661327
