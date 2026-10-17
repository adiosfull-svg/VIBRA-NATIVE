# Gara barra in basso e menu — utente pr

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 586 (923) | – |
| tocco → la pillola arriva (tocchi lenti) | 1665 (2241) | – |
| tocco → la pagina cambia (tocchi lenti) | 1077 (1932) | – |
| frame al secondo della pillola in corsa | 11 (16) | – |
| tocco → la pillola parte (tocchi veloci di fila) | 340 (340) | – |
| tocco → la pillola arriva (tocchi veloci di fila) | 1286 (1286) | – |
| tocco → la pagina cambia (tocchi veloci di fila) | 340 (340) | 765 (765) |
| trascinamento: pillola dietro al dito | 379 (379) | -310 (-310) |
| trascinamento: spostamenti della pillola al secondo | 1 (1) | 1 (1) |
| menu, 1ª apertura: tocco → il menu si muove | – | 168 (168) |
| menu, 1ª apertura: tocco → menu completo | – | 168 (168) |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | – | 168 (168) |
| menu, 2ª apertura: tocco → il menu si muove | – | – |
| menu, 2ª apertura: tocco → menu completo | – | 17 (17) |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | – | 17 (17) |

nativa: 418 frame nel video (12.2 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 61 (1.8 al secondo) nel livello com.vibra.mobile/com.vibra.mobile.MainActivity#141
- frame disegnati dal sistema: 5 (0.1 al secondo) nel livello StatusBar#92

originale: 569 frame nel video (13.6 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 34 (0.8 al secondo) nel livello com.android.chrome/ChromeChildSurface#179
- frame disegnati dal sistema: 9 (0.2 al secondo) nel livello com.android.chrome/org.chromium.chrome.browser.ChromeTabbedActivity#167

## Note
- nativa: pulsante del menu non trovato

Righe complete in navbar.json; video in video/.
