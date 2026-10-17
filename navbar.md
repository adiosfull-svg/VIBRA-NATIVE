# Gara barra in basso e menu — utente admin

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 685 (959) | 1019 (1666) |
| tocco → la pillola arriva (tocchi lenti) | 1102 (1556) | 901 (901) |
| tocco → la pagina cambia (tocchi lenti) | 2134 (2206) | 774 (1221) |
| frame al secondo della pillola in corsa | 10 (15) | – |
| tocco → la pillola parte (tocchi veloci di fila) | 540 (540) | 0 (0) |
| tocco → la pillola arriva (tocchi veloci di fila) | 1060 (1060) | – |
| tocco → la pagina cambia (tocchi veloci di fila) | 540 (540) | – |
| trascinamento: pillola dietro al dito | 493 (493) | -419 (-419) |
| trascinamento: spostamenti della pillola al secondo | 0 (0) | 0 (0) |
| menu, 1ª apertura: tocco → il menu si muove | – | 585 (585) |
| menu, 1ª apertura: tocco → menu completo | 128 (128) | 585 (585) |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | 128 (128) | 585 (585) |
| menu, 2ª apertura: tocco → il menu si muove | 739 (739) | 306 (306) |
| menu, 2ª apertura: tocco → menu completo | 1436 (1436) | 880 (880) |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | 1436 (1436) | 880 (880) |

nativa: 655 frame nel video (12.9 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 81 (1.6 al secondo) nel livello com.vibra.mobile/com.vibra.mobile.MainActivity#134
- frame disegnati dal sistema: 6 (0.1 al secondo) nel livello StatusBar#92

originale: 589 frame nel video (13.5 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 47 (1.1 al secondo) nel livello com.android.chrome/ChromeChildSurface#172
- frame disegnati dal sistema: 9 (0.2 al secondo) nel livello com.android.chrome/org.chromium.chrome.browser.ChromeTabbedActivity#159

Righe complete in navbar.json; video in video/.
