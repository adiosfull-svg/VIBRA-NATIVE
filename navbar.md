# Gara barra in basso e menu — utente admin

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 516 (713) | 935 (1705) |
| tocco → la pillola arriva (tocchi lenti) | 1475 (1944) | – |
| tocco → la pagina cambia (tocchi lenti) | 612 (1616) | 1140 (2124) |
| frame al secondo della pillola in corsa | 12 (15) | – |
| tocco → la pillola parte (tocchi veloci di fila) | 366 (366) | 2180 (2180) |
| tocco → la pillola arriva (tocchi veloci di fila) | 2191 (2191) | 2180 (2180) |
| tocco → la pagina cambia (tocchi veloci di fila) | 366 (366) | 2180 (2180) |
| trascinamento: pillola dietro al dito | 351 (351) | 469 (469) |
| trascinamento: spostamenti della pillola al secondo | 1 (1) | 0 (0) |
| menu, 1ª apertura: tocco → il menu si muove | – | – |
| menu, 1ª apertura: tocco → menu completo | 87 (87) | 32 (32) |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | 87 (87) | 32 (32) |
| menu, 2ª apertura: tocco → il menu si muove | 620 (620) | 49 (49) |
| menu, 2ª apertura: tocco → menu completo | 1399 (1399) | 693 (693) |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | 1399 (1399) | 693 (693) |

nativa: 635 frame nel video (13.9 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 88 (1.9 al secondo) nel livello com.vibra.mobile/com.vibra.mobile.MainActivity#133
- frame disegnati dal sistema: 18 (0.4 al secondo) nel livello StatusBar#91

originale: 602 frame nel video (14.3 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 43 (1 al secondo) nel livello com.android.chrome/ChromeChildSurface#170
- frame disegnati dal sistema: 9 (0.2 al secondo) nel livello com.android.chrome/org.chromium.chrome.browser.ChromeTabbedActivity#159

Righe complete in navbar.json; video in video/.
