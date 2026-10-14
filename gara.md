# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 5496 ms da app chiusa (di cui 1431 ms prima della prima riga di JS) · originale 3693 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 847 | 1860 | ✅ | 640 | 240 | ❌ | 87.4% | –% |
| /clienti | 457 | 260 | ❌ | 902 | 677 | ❌ | 88.8% | 89.9% |
| /promoter | 2780 | 1779 | ❌ | 37 | 209 | ✅ | 88% | –% |
| /promoter/prom000000000000000001 | 1134 | 2033 | ✅ | 15008⚠ | 739 | ❌ | 87.3% | –% |
| /locali | 961 | 636 | ❌ | 15014⚠ | 94 | ❌ | 87.7% | –% |
| /report | 159 | 273 | ✅ | 15012⚠ | 101 | ❌ | 87.8% | –% |
| /messaggi | 244 | 728 | ✅ | 15013⚠ | 186 | ❌ | 86.1% | –% |
| /importa-serata | 169 | 200 | ✅ | 15013⚠ | 226 | ❌ | 85.1% | –% |
| /impostazioni-app | 174 | 251 | ✅ | 15014⚠ | 34 | ❌ | 84.6% | –% |
| /admin-console | 313 | 197 | ❌ | 15015⚠ | 541 | ❌ | 87.3% | –% |
| /clienti-analytics | 660 | 425 | ❌ | 15011⚠ | 274 | ❌ | 88.4% | –% |
| /academy | 565 | 238 | ❌ | 15013⚠ | 263 | ❌ | 86% | –% |
| /notifiche | 601 | 181 | ❌ | 15010⚠ | 487 | ❌ | 81.5% | –% |
| /dashboard | 839 | 645 | ❌ | 15015⚠ | 201 | ❌ | 86.9% | –% |

Memoria (PSS): nativa 698 MB · originale (Chrome) 356 MB

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    68764                         102672
         Native Heap:   345536                         348740
                Code:    59372                         181392
               Stack:     1136                           1140
            Graphics:        0                              0
       Private Other:   223328
              System:    16254
             Unknown:                                  229228
 
           TOTAL PSS:   714390            TOTAL RSS:   863172      TOTAL SWAP (KB):        0
```
