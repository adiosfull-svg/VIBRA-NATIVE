# Gara barra in basso e menu — utente admin

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 140 (723) | 1122 (1695) |
| tocco → la pillola arriva (tocchi lenti) | 690 (1355) | 2038 (2183) |
| tocco → la pagina cambia (tocchi lenti) | 315 (943) | 1278 (2183) |
| frame al secondo della pillola in corsa | 18 (21) | 18 (22) |
| tocco → la pillola parte (tocchi veloci di fila) | 349 (349) | 495 (495) |
| tocco → la pillola arriva (tocchi veloci di fila) | 583 (583) | 1943 (1943) |
| tocco → la pagina cambia (tocchi veloci di fila) | 583 (583) | 24 (24) |
| trascinamento: pillola dietro al dito | 330 (330) | 464 (464) |
| trascinamento: spostamenti della pillola al secondo | 3 (3) | 0 (0) |
| menu, 1ª apertura: tocco → il menu si muove | 210 (210) | 465 (465) |
| menu, 1ª apertura: tocco → menu completo | 1037 (1037) | 1350 (1350) |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | 1037 (1037) | 1350 (1350) |
| menu, 2ª apertura: tocco → il menu si muove | 278 (278) | 493 (493) |
| menu, 2ª apertura: tocco → menu completo | 699 (699) | 1292 (1292) |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | 699 (699) | 1292 (1292) |

nativa: 930 frame nel video (21.9 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 110 (2.6 al secondo) nel livello com.vibra.mobile/com.vibra.mobile.MainActivity#136
- frame disegnati dal sistema: 1 (0 al secondo) nel livello StatusBar#91

originale: 939 frame nel video (23.0 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 69 (1.7 al secondo) nel livello com.android.chrome/ChromeChildSurface#181
- frame disegnati dal sistema: 9 (0.2 al secondo) nel livello com.android.chrome/org.chromium.chrome.browser.ChromeTabbedActivity#169

Righe complete in navbar.json; video in video/.
