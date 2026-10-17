# Gara barra in basso e menu — utente pr

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 1104 (1353) | 1086 (2003) |
| tocco → la pillola arriva (tocchi lenti) | 1104 (1353) | – |
| tocco → la pagina cambia (tocchi lenti) | 2127 (2232) | 786 (2003) |
| frame al secondo della pillola in corsa | 18 (18) | – |
| tocco → la pillola parte (tocchi veloci di fila) | 977 (977) | 2087 (2087) |
| tocco → la pillola arriva (tocchi veloci di fila) | 977 (977) | – |
| tocco → la pagina cambia (tocchi veloci di fila) | 478 (478) | 2087 (2087) |
| trascinamento: pillola dietro al dito | 571 (571) | -521 (-521) |
| trascinamento: spostamenti della pillola al secondo | 0 (0) | 0 (0) |
| menu, 1ª apertura: tocco → il menu si muove | – | 657 (657) |
| menu, 1ª apertura: tocco → menu completo | 204 (204) | 657 (657) |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | 204 (204) | 11 (11) |
| menu, 2ª apertura: tocco → il menu si muove | – | – |
| menu, 2ª apertura: tocco → menu completo | 29 (29) | 54 (54) |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | 29 (29) | 54 (54) |

nativa: 805 frame nel video (17.8 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 110 (2.4 al secondo) nel livello com.vibra.mobile/com.vibra.mobile.MainActivity#137
- frame disegnati dal sistema: 5 (0.1 al secondo) nel livello StatusBar#90

originale: 877 frame nel video (20.9 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 73 (1.7 al secondo) nel livello com.android.chrome/ChromeChildSurface#173
- frame disegnati dal sistema: 9 (0.2 al secondo) nel livello com.android.chrome/org.chromium.chrome.browser.ChromeTabbedActivity#163

Righe complete in navbar.json; video in video/.
