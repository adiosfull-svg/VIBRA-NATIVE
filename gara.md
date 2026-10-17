# Gara barra in basso e menu — utente pr

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 748 (932) | 1179 (2146) |
| tocco → la pillola arriva (tocchi lenti) | 1218 (1683) | – |
| tocco → la pagina cambia (tocchi lenti) | 2213 (2219) | 1556 (1556) |
| frame al secondo della pillola in corsa | 10 (14) | – |
| tocco → la pillola parte (tocchi veloci di fila) | 56 (56) | 1368 (1368) |
| tocco → la pillola arriva (tocchi veloci di fila) | 1935 (1935) | 1368 (1368) |
| tocco → la pagina cambia (tocchi veloci di fila) | 1090 (1090) | – |
| trascinamento: pillola dietro al dito | 558 (558) | 275 (275) |
| trascinamento: spostamenti della pillola al secondo | 0 (0) | 2 (2) |
| menu, 1ª apertura: tocco → il menu si muove | 1410 (1410) | 912 (912) |
| menu, 1ª apertura: tocco → menu completo | 1410 (1410) | 912 (912) |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | 1410 (1410) | 912 (912) |
| menu, 2ª apertura: tocco → il menu si muove | 708 (708) | – |
| menu, 2ª apertura: tocco → menu completo | 1181 (1181) | 50 (50) |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | 1181 (1181) | 50 (50) |

nativa: 701 frame nel video (14.2 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 85 (1.7 al secondo) nel livello com.vibra.mobile/com.vibra.mobile.MainActivity#136
- frame disegnati dal sistema: 3 (0.1 al secondo) nel livello StatusBar#92

originale: 640 frame nel video (15.5 al secondo in media), scostamento orologio 0.0 s
- frame disegnati dal sistema: 56 (1.4 al secondo) nel livello com.android.chrome/ChromeChildSurface#174
- frame disegnati dal sistema: 9 (0.2 al secondo) nel livello com.android.chrome/org.chromium.chrome.browser.ChromeTabbedActivity#162

Righe complete in navbar.json; video in video/.
