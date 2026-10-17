# Gara barra in basso e menu — utente admin

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 1366 (1649) | 1242 (1976) |
| tocco → la pillola arriva (tocchi lenti) | 1366 (1649) | – |
| tocco → la pagina cambia (tocchi lenti) | 1021 (1904) | 1534 (1762) |
| frame al secondo della pillola in corsa | 11 (11) | – |
| tocco → la pillola parte (tocchi veloci di fila) | 1454 (1454) | 995 (995) |
| tocco → la pillola arriva (tocchi veloci di fila) | 2211 (2211) | – |
| tocco → la pagina cambia (tocchi veloci di fila) | 468 (468) | 113 (113) |
| trascinamento: pillola dietro al dito | 598 (598) | 63 (63) |
| trascinamento: spostamenti della pillola al secondo | 0 (0) | 1 (1) |
| menu, 1ª apertura: tocco → il menu si muove | 906 (906) | 402 (402) |
| menu, 1ª apertura: tocco → menu completo | 1274 (1274) | 1177 (1177) |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | 1274 (1274) | 1177 (1177) |
| menu, 2ª apertura: tocco → il menu si muove | 860 (860) | 665 (665) |
| menu, 2ª apertura: tocco → menu completo | 1253 (1253) | 1242 (1242) |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | 1253 (1253) | 1242 (1242) |

nativa: 666 frame nel video (13.0 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 73 (1.4 al secondo) nel livello com.vibra.mobile/com.vibra.mobile.MainActivity#134
- frame disegnati dal sistema: 19 (0.4 al secondo) nel livello StatusBar#91

originale: 576 frame nel video (13.7 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 51 (1.2 al secondo) nel livello com.android.chrome/ChromeChildSurface#181
- frame disegnati dal sistema: 9 (0.2 al secondo) nel livello com.android.chrome/org.chromium.chrome.browser.ChromeTabbedActivity#170

Righe complete in navbar.json; video in video/.
