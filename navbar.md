# Gara barra in basso e menu — utente pr

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 1089 (1861) | 61 (1170) |
| tocco → la pillola arriva (tocchi lenti) | 1110 (1861) | – |
| tocco → la pagina cambia (tocchi lenti) | 1861 (2065) | 1170 (1170) |
| frame al secondo della pillola in corsa | – | – |
| tocco → la pillola parte (tocchi veloci di fila) | 999 (999) | – |
| tocco → la pillola arriva (tocchi veloci di fila) | 1909 (1909) | – |
| tocco → la pagina cambia (tocchi veloci di fila) | 372 (372) | 986 (1949) |
| trascinamento: pillola dietro al dito | 554 (554) | 282 (282) |
| trascinamento: spostamenti della pillola al secondo | 0 (0) | 0 (0) |
| menu, 1ª apertura: tocco → il menu si muove | 1325 (1325) | 905 (905) |
| menu, 1ª apertura: tocco → menu completo | 1325 (1325) | 905 (905) |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | 1325 (1325) | 905 (905) |
| menu, 2ª apertura: tocco → il menu si muove | 988 (988) | – |
| menu, 2ª apertura: tocco → menu completo | 1259 (1259) | 1382 (1382) |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | 1259 (1259) | 1382 (1382) |

nativa: 686 frame nel video (14.4 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 83 (1.7 al secondo) nel livello com.vibra.mobile/com.vibra.mobile.MainActivity#146
- frame disegnati dal sistema: 4 (0.1 al secondo) nel livello StatusBar#91

originale: 699 frame nel video (16.1 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 51 (1.2 al secondo) nel livello com.android.chrome/ChromeChildSurface#194
- frame disegnati dal sistema: 9 (0.2 al secondo) nel livello com.android.chrome/org.chromium.chrome.browser.ChromeTabbedActivity#183

Righe complete in navbar.json; video in video/.
