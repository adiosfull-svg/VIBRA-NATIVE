# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 6028 ms da app chiusa (di cui 1141 ms prima della prima riga di JS) · originale 1818 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 436 | 3224 | ✅ | 197 | 1618 | ✅ | 90.1% | –% |
| /clienti | 122 | 2090 | ✅ | 60 | 1109 | ✅ | 89.3% | –% |
| /semine | 98 | 289 | ✅ | 55 | 1360 | ✅ | 81.9% | 87.2% |
| /notifiche | 568 | 174 | ❌ | 212 | 371 | ✅ | 85.3% | –% |
| /formazione | 156 | 742 | ✅ | 162 | 726 | ✅ | 89.1% | –% |
| /download | 214 | 1484 | ✅ | 300 | 470 | ✅ | 90.2% | –% |
| /vibra-gpt | 121 | 1101 | ✅ | 368 | 597 | ✅ | 81.2% | –% |
| /ricerca-ai | 121 | 906 | ✅ | 196 | 495 | ✅ | 79.1% | –% |
| /messaggi | 764 | 1001 | ✅ | 339 | 1370 | ✅ | 85.7% | –% |
| /clienti-analytics | 1049 | 1427 | ✅ | 1160 | 1606 | ✅ | 86.6% | –% |
| /academy | 285 | 1127 | ✅ | 331 | 593 | ✅ | 88.2% | –% |
| /il-mio-vibra | 142 | 2761 | ✅ | 70 | 831 | ✅ | 88.2% | –% |

Memoria (PSS): nativa 620 MB · originale (Chrome) 838 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 38 | 38,38,37 |
| view-classi | 53 | 103,53,50 |
| div | 69 | 69,69,69 |
| div-senza-classi | 51 | 50,51,84 |
| pressable-puro | 55 | 72,55,55 |
| pressable-classi | 122 | 71,122,136 |
| btn-vuoto | 86 | 86,86,86 |
| text-puro | 49 | 48,49,63 |
| text | 75 | 75,77,51 |
| span | 76 | 77,76,76 |
| btn | 128 | 131,128,128 |
| riga | 401 | 458,401,343 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    59128                          92980
         Native Heap:   336172                         339372
                Code:    47504                         171756
               Stack:     2168                           2172
            Graphics:        0                              0
       Private Other:   172816
              System:    16757
             Unknown:                                  178788
 
           TOTAL PSS:   634545            TOTAL RSS:   785068      TOTAL SWAP (KB):        0
```
