# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 8399 ms da app chiusa (di cui 2854 ms prima della prima riga di JS) · originale 4108 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 2071 | 2177 | ✅ | 151 | 998 | ✅ | 78.5% | –% |
| /clienti | 249 | 560 | ✅ | 70 | 1030 | ✅ | 84.3% | –% |
| /semine | 336 | 230 | ❌ | 62 | 1292 | ✅ | 76.2% | 92.2% |
| /notifiche | 54 | 202 | ✅ | 34 | 278 | ✅ | 77.3% | –% |
| /formazione | 1160 | 609 | ❌ | 141 | 357 | ✅ | 90.3% | –% |
| /download | 1265 | 346 | ❌ | 325 | 665 | ✅ | 85.7% | –% |
| /vibra-gpt | 452 | 1104 | ✅ | 282 | 350 | ✅ | 84.7% | 91.7% |
| /ricerca-ai | 144 | 712 | ✅ | 140 | 348 | ✅ | 84.4% | 91.7% |
| /messaggi | 1289 | 543 | ❌ | 210 | 375 | ✅ | –% | –% |
| /clienti-analytics | 997 | 1640 | ✅ | 953 | 308 | ❌ | 88.9% | –% |
| /academy | 416 | 1443 | ✅ | 429 | 992 | ✅ | 85.7% | –% |
| /il-mio-vibra | 140 | 1162 | ✅ | 154 | 735 | ✅ | 80.9% | –% |

Memoria (PSS): nativa 569 MB · originale (Chrome) 419 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 55 | 55,57,54 |
| view-classi | 86 | 86,71,88 |
| div | 102 | 106,102,87 |
| div-senza-classi | 67 | 67,67,66 |
| pressable-puro | 72 | 84,72,72 |
| pressable-classi | 103 | 103,102,104 |
| btn-vuoto | 119 | 101,119,136 |
| text-puro | 70 | 58,70,84 |
| text | 103 | 124,84,103 |
| span | 90 | 90,87,107 |
| btn | 186 | 157,188,186 |
| riga | 503 | 474,503,644 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    50084                          83936
         Native Heap:   290840                         294076
                Code:    24056                         148056
               Stack:     1848                           1852
            Graphics:        0                              0
       Private Other:   199408
              System:    16272
             Unknown:                                  205304
 
           TOTAL PSS:   582508            TOTAL RSS:   733224      TOTAL SWAP (KB):        0
```
