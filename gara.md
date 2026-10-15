# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 5412 ms da app chiusa (di cui 1050 ms prima della prima riga di JS) · originale 361 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 535 | 1449 | ✅ | 15001⚠ | 1119 | ❌ | 78.1% | –% |
| /clienti | 15002⚠ | 394 | ❌ | 15013⚠ | 1435 | ❌ | 76.8% | –% |
| /semine | 15013⚠ | 330 | ❌ | 15012⚠ | 583 | ❌ | 85.9% | 89.8% |
| /notifiche | 29 | 166 | ✅ | 24 | 578 | ✅ | 84.5% | –% |
| /formazione | 180 | 1023 | ✅ | 129 | 603 | ✅ | 87.3% | –% |
| /download | 337 | 484 | ✅ | 254 | 740 | ✅ | 87.1% | –% |
| /vibra-gpt | 246 | 754 | ✅ | 360 | 516 | ✅ | 78% | –% |
| /ricerca-ai | 112 | 418 | ✅ | 149 | 361 | ✅ | 77.5% | –% |
| /messaggi | 657 | 1214 | ✅ | 409 | 779 | ✅ | 87.5% | –% |
| /clienti-analytics | 743 | 1564 | ✅ | 571 | 1809 | ✅ | 88.6% | –% |
| /academy | 307 | 1407 | ✅ | 291 | 567 | ✅ | 86.2% | –% |
| /il-mio-vibra | 219 | 5381 | ✅ | 15002⚠ | 318 | ❌ | 80% | –% |

Memoria (PSS): nativa 553 MB · originale (Chrome) 425 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 37 | 37,37,37 |
| view-classi | 52 | 52,53,52 |
| div | 69 | 85,69,69 |
| div-senza-classi | 50 | 50,50,50 |
| pressable-puro | 54 | 53,54,54 |
| pressable-classi | 70 | 70,70,70 |
| btn-vuoto | 72 | 70,72,86 |
| text-puro | 48 | 34,48,49 |
| text | 77 | 75,78,77 |
| span | 79 | 79,79,79 |
| btn | 139 | 139,128,161 |
| riga | 418 | 491,416,418 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    59724                          93580
         Native Heap:   276736                         279944
                Code:    46060                         170772
               Stack:     2208                           2216
            Graphics:        0                              0
       Private Other:   165244
              System:    16550
             Unknown:                                  170920
 
           TOTAL PSS:   566522            TOTAL RSS:   717432      TOTAL SWAP (KB):        0
```
