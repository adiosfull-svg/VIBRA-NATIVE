# Gara barra in basso e menu — utente admin

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 1832 (2101) | 984 (1839) |
| tocco → la pillola arriva (tocchi lenti) | 1832 (2101) | – |
| tocco → la pagina cambia (tocchi lenti) | 328 (1599) | 1220 (1366) |
| frame al secondo della pillola in corsa | 13 (13) | – |
| tocco → la pillola parte (tocchi veloci di fila) | 321 (321) | 2356 (2356) |
| tocco → la pillola arriva (tocchi veloci di fila) | 2129 (2129) | 2356 (2356) |
| tocco → la pagina cambia (tocchi veloci di fila) | 2129 (2129) | 2356 (2356) |
| trascinamento: pillola dietro al dito | 355 (355) | 447 (447) |
| trascinamento: spostamenti della pillola al secondo | 1 (1) | 0 (0) |
| menu, 1ª apertura: tocco → il menu si muove | – | 321 (321) |
| menu, 1ª apertura: tocco → menu completo | 231 (231) | 321 (321) |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | 231 (231) | 321 (321) |
| menu, 2ª apertura: tocco → il menu si muove | – | 598 (598) |
| menu, 2ª apertura: tocco → menu completo | 8 (8) | 1057 (1057) |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | 8 (8) | 1057 (1057) |

nativa: 681 frame nel video (13.5 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 83 (1.6 al secondo) nel livello com.vibra.mobile/com.vibra.mobile.MainActivity#132
- frame disegnati dal sistema: 7 (0.1 al secondo) nel livello StatusBar#91

originale: 642 frame nel video (14.9 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 52 (1.2 al secondo) nel livello com.android.chrome/ChromeChildSurface#176
- frame disegnati dal sistema: 9 (0.2 al secondo) nel livello com.android.chrome/org.chromium.chrome.browser.ChromeTabbedActivity#162

Righe complete in navbar.json; video in video/.
