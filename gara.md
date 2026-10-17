# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 7479 ms da app chiusa (di cui 2872 ms prima della prima riga di JS) · originale 3628 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 178 | 1664 | ✅ | 135 | 1084 | ✅ | 80.8% | –% |
| /clienti | 176 | 877 | ✅ | 61 | 1194 | ✅ | 80.4% | –% |
| /semine | 320 | 2648 | ✅ | 64 | 988 | ✅ | 80.6% | –% |
| /notifiche | 161 | 168 | ✅ | 30 | 742 | ✅ | 80.9% | –% |
| /formazione | 2011 | 1293 | ❌ | 684 | 62 | ❌ | –% | –% |
| /download | 398 | 841 | ✅ | 382 | 833 | ✅ | 76.7% | –% |
| /vibra-gpt | 528 | 969 | ✅ | 216 | 891 | ✅ | 86.8% | –% |
| /ricerca-ai | 338 | 882 | ✅ | 228 | 475 | ✅ | 87% | –% |
| /messaggi | 716 | 899 | ✅ | 677 | 968 | ✅ | –% | –% |
| /clienti-analytics | 2348 | 517 | ❌ | 1254 | 966 | ❌ | 88.8% | –% |
| /academy | 751 | 2447 | ✅ | 856 | 1146 | ✅ | 82.2% | –% |
| /il-mio-vibra | 95 | 1268 | ✅ | 106 | 1493 | ✅ | 78.3% | –% |

Memoria (PSS): nativa 526 MB · originale (Chrome) 406 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 70 | 70,56,70 |
| view-classi | 87 | 83,87,89 |
| div | 104 | 104,120,103 |
| div-senza-classi | 69 | 67,71,69 |
| pressable-puro | 89 | 89,102,87 |
| pressable-classi | 121 | 120,122,121 |
| btn-vuoto | 121 | 143,120,121 |
| text-puro | 88 | 100,88,76 |
| text | 106 | 90,106,107 |
| span | 118 | 118,135,108 |
| btn | 203 | 203,219,187 |
| riga | 614 | 537,692,614 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    52140                          86004
         Native Heap:   253240                         256476
                Code:    24392                         147840
               Stack:     1888                           1892
            Graphics:        0                              0
       Private Other:   190928
              System:    16481
             Unknown:                                  196892
 
           TOTAL PSS:   539069            TOTAL RSS:   689104      TOTAL SWAP (KB):        0
```
