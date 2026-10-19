# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x=1005 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | sì |
| 0s | fine | sì |
| 0.2s | inizio | sì |
| 0.2s | fine | sì |
| 0.4s | inizio | sì |
| 0.4s | fine | sì |
| 0.7s | inizio | sì |
| 0.7s | fine | sì |
| 1.0s | inizio | NO |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |
| 0s | inizio | sì |
| 0s | fine | sì |
| 0.2s | inizio | sì |
| 0.2s | fine | NO |
| 0.4s | inizio | sì |
| 0.4s | fine | sì |
| 0.7s | inizio | sì |
| 0.7s | fine | NO |
| 1.0s | inizio | sì |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |

Tap arrivati: 29 su 32

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-19 14:26:26.156  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=785191ms
10-19 14:26:26.224  9428  9452 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=785259ms
10-19 14:26:29.719  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=788754ms
10-19 14:26:30.076  9428  9452 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=789111ms
10-19 14:26:36.389  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=795425ms
10-19 14:26:37.052  9428  9452 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=796087ms
10-19 14:26:59.506  9428  9452 I ReactNativeJS: VIBRA subtab premuto clienti dopo=818541ms
10-19 14:26:59.506  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,151 loc=28,16 target=16884
10-19 14:26:59.524  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:26:59.639  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-19 14:27:00.121  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=0
10-19 14:27:00.121  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=0
10-19 14:27:05.671  9428  9452 I ReactNativeJS: VIBRA subtab premuto albero dopo=824706ms
10-19 14:27:05.671  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=5531ms lancio=0 x=0 page=362,151 loc=9,8 target=16918
10-19 14:27:05.707  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:27:06.068  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato albero
10-19 14:27:06.769  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=258
10-19 14:27:06.855  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=258
10-19 14:27:12.308  9697  9697 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-19 14:27:12.339  9428  9452 I ReactNativeJS: VIBRA subtab premuto parco dopo=831374ms
10-19 14:27:12.339  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=5894ms lancio=0 x=258 page=49,151 loc=113,16 target=16908
10-19 14:27:12.358  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:27:12.620  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=13
10-19 14:27:12.620  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato parco
10-19 14:27:12.912  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:27:12.912  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=292ms lancio=1 x=13 page=157,151 loc=33,8 target=16894
10-19 14:27:12.912  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:27:13.267  9428  9452 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 14:27:13.267  9428  9452 I ReactNativeJS: VIBRA subtab gruppi dopo=355ms
10-19 14:27:13.311  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata gruppi dopo=398ms
10-19 14:27:13.311  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=13
10-19 14:27:13.324  9428  9452 I ReactNativeJS: VIBRA subtab disegnata gruppi dopo=411ms
10-19 14:27:13.324  9428  9452 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=412ms
10-19 14:27:15.521  9718  9718 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-19 14:27:15.555  9428  9452 I ReactNativeJS: VIBRA subtab premuto albero dopo=2643ms
10-19 14:27:15.556  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1638ms lancio=0 x=0 page=362,151 loc=9,8 target=16918
10-19 14:27:15.556  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:27:15.734  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato albero
10-19 14:27:15.983  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=317
10-19 14:27:16.055  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:27:16.055  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=321ms lancio=1 x=317 page=383,151 loc=12,16 target=16968
10-19 14:27:16.055  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:27:16.104  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=317
10-19 14:27:16.121  9428  9452 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 14:27:16.122  9428  9452 I ReactNativeJS: VIBRA subtab analitica dopo=66ms
10-19 14:27:16.160  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=105ms
10-19 14:27:16.176  9428  9452 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=121ms
10-19 14:27:16.176  9428  9452 I ReactNativeJS: VIBRA subtab cambio analitica dopo=121ms
10-19 14:27:18.814  9741  9741 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-19 14:27:18.856  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2801ms
10-19 14:27:18.859  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1492ms lancio=0 x=480 page=49,151 loc=21,16 target=16944
10-19 14:27:18.860  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:27:19.146  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=168
10-19 14:27:19.146  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:27:19.499  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:27:19.499  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=354ms lancio=1 x=168 page=157,151 loc=3,16 target=16920
10-19 14:27:19.500  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:27:19.540  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=168
10-19 14:27:19.555  9428  9452 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 14:27:19.555  9428  9452 I ReactNativeJS: VIBRA subtab albero dopo=55ms
10-19 14:27:19.592  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=93ms
10-19 14:27:19.623  9428  9452 I ReactNativeJS: VIBRA subtab disegnata albero dopo=123ms
10-19 14:27:19.626  9428  9452 I ReactNativeJS: VIBRA subtab cambio albero dopo=127ms
10-19 14:27:22.061  9761  9761 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-19 14:27:22.089  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2589ms
10-19 14:27:22.089  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1704ms lancio=0 x=157 page=362,151 loc=13,16 target=16944
10-19 14:27:22.090  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:27:22.293  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:27:22.483  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=449
10-19 14:27:22.695  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=449
10-19 14:27:22.725  9428  9452 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3226ms
10-19 14:27:22.726  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=435ms lancio=0 x=449 page=383,151 loc=14,8 target=16978
10-19 14:27:22.726  9428  9452 I ReactNativeJS: VIBRA subtab mappa dopo=3227ms
10-19 14:27:22.727  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 14:27:22.759  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=32ms
10-19 14:27:22.774  9428  9452 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=47ms
10-19 14:27:22.774  9428  9452 I ReactNativeJS: VIBRA subtab cambio mappa dopo=47ms
10-19 14:27:22.993  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 14:27:25.538  9891  9891 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-19 14:27:25.691  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2965ms
10-19 14:27:25.695  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=2057ms lancio=0 x=480 page=49,151 loc=21,16 target=16944
10-19 14:27:25.698  9428  9452 I ReactNativeJS: VIBRA subtab tabelle dopo=2972ms
10-19 14:27:25.700  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-19 14:27:25.736  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=37ms
10-19 14:27:25.914  9428  9452 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=215ms
10-19 14:27:25.914  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:27:26.298  9428  9452 I ReactNativeJS: VIBRA subtab premuto growth dopo=599ms
10-19 14:27:26.299  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=2661ms lancio=0 x=480 page=157,151 loc=7,8 target=16954
10-19 14:27:26.316  9428  9452 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=617ms
10-19 14:27:29.602  9918  9918 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-19 14:27:31.549  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 14:27:31.550  9428  9452 I ReactNativeJS: VIBRA subtab growth dopo=5851ms
10-19 14:27:31.553  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=5254ms
10-19 14:27:31.579  9428  9452 I ReactNativeJS: VIBRA subtab premuto mappa dopo=26ms
10-19 14:27:31.580  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=7942ms lancio=0 x=480 page=362,151 loc=24,8 target=16978
10-19 14:27:31.580  9428  9452 I ReactNativeJS: VIBRA subtab mappa dopo=27ms
10-19 14:27:31.580  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 14:27:31.581  9428  9452 I ReactNativeJS: VIBRA subtab premuto mappa dopo=0ms
10-19 14:27:31.581  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=7944ms lancio=0 x=480 page=383,151 loc=77,16 target=16980
10-19 14:27:31.581  9428  9452 I ReactNativeJS: VIBRA subtab mappa dopo=1ms
10-19 14:27:31.582  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 14:27:31.761  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=180ms
10-19 14:27:32.266  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 14:27:32.266  9428  9452 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=684ms
10-19 14:27:32.276  9428  9452 I ReactNativeJS: VIBRA subtab cambio growth dopo=694ms
10-19 14:27:33.135  9941  9941 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-19 14:27:33.714  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:27:33.715  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1ms lancio=0 x=344 page=49,151 loc=71,16 target=16920
10-19 14:27:33.715  9428  9452 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-19 14:27:33.715  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:27:34.866  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=3284ms
10-19 14:27:34.871  9428  9452 I ReactNativeJS: VIBRA subtab cambio mappa dopo=3289ms
10-19 14:27:34.871  9428  9452 I ReactNativeJS: VIBRA subtab cambio mappa dopo=3289ms
10-19 14:27:34.877  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=212
10-19 14:27:34.881  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:27:34.881  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=4ms lancio=1 x=212 page=157,151 loc=15,8 target=16918
10-19 14:27:34.881  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:27:34.881  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=212
10-19 14:27:35.213  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=332ms
10-19 14:27:35.419  9428  9452 I ReactNativeJS: VIBRA subtab disegnata growth dopo=538ms
10-19 14:27:35.420  9428  9452 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 14:27:35.421  9428  9452 I ReactNativeJS: VIBRA subtab albero dopo=540ms
10-19 14:27:35.431  9428  9452 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=550ms
10-19 14:27:35.450  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=569ms
10-19 14:27:35.597  9428  9452 I ReactNativeJS: VIBRA subtab disegnata albero dopo=716ms
10-19 14:27:35.794  9428  9452 I ReactNativeJS: VIBRA subtab cambio albero dopo=913ms
10-19 14:27:37.623  9985  9985 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-19 14:27:37.798  9428  9452 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2917ms
10-19 14:27:37.798  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=997ms lancio=0 x=480 page=362,151 loc=24,8 target=16978
10-19 14:27:37.812  9428  9452 I ReactNativeJS: VIBRA subtab mappa dopo=2931ms
10-19 14:27:37.812  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=14ms
10-19 14:27:37.947  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=135ms
10-19 14:27:38.038  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 14:27:38.039  9428  9452 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=226ms
10-19 14:27:38.233  9428  9452 I ReactNativeJS: VIBRA subtab cambio mappa dopo=421ms
10-19 14:27:38.886  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=1074ms
10-19 14:27:38.886  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=653ms lancio=0 x=157 page=383,151 loc=2,8 target=16942
10-19 14:27:38.886  9428  9452 I ReactNativeJS: VIBRA subtab tabelle dopo=1074ms
10-19 14:27:38.886  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 14:27:38.905  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=19ms
10-19 14:27:38.977  9428  9452 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=91ms
10-19 14:27:39.295  9428  9452 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=409ms
10-19 14:27:39.295  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:27:41.477 10029 10029 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-19 14:27:44.891  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:27:44.892  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=5ms lancio=0 x=480 page=49,151 loc=21,16 target=16944
10-19 14:27:44.892  9428  9452 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-19 14:27:44.892  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:27:44.893  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=280
10-19 14:27:44.893  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=280
10-19 14:27:44.893  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:27:44.893  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1ms lancio=0 x=280 page=157,151 loc=29,16 target=16932
10-19 14:27:44.894  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:27:45.602 10050 10050 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-19 14:27:45.687  9428  9452 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 14:27:45.687  9428  9452 I ReactNativeJS: VIBRA subtab comitive dopo=793ms
10-19 14:27:46.019  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=1125ms
10-19 14:27:46.051  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:27:46.057  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1164ms lancio=0 x=280 page=362,151 loc=13,8 target=16954
10-19 14:27:46.057  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:27:46.057  9428  9452 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=0ms
10-19 14:27:46.075  9428  9452 I ReactNativeJS: VIBRA subtab cambio comitive dopo=18ms
10-19 14:27:47.112  9428  9452 I ReactNativeJS: VIBRA subtab premuto analitica dopo=1055ms
10-19 14:27:47.113  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1056ms lancio=0 x=344 page=383,151 loc=8,8 target=16966
10-19 14:27:47.114  9428  9452 I ReactNativeJS: VIBRA subtab analitica dopo=1057ms
10-19 14:27:47.126  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=13ms
10-19 14:27:47.153  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=27ms
10-19 14:27:47.432  9428  9452 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=306ms
10-19 14:27:47.432  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-19 14:27:47.587  9428  9452 I ReactNativeJS: VIBRA subtab cambio analitica dopo=461ms
10-19 14:27:49.865 10077 10077 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-19 14:27:49.923  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2797ms
10-19 14:27:49.923  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=636ms lancio=0 x=480 page=49,151 loc=21,16 target=16944
10-19 14:27:49.951  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:27:50.183  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=231
10-19 14:27:50.186  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:27:50.568  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=0
10-19 14:27:51.739  9428  9452 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=4613ms
10-19 14:27:51.739  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1171ms lancio=0 x=0 page=157,151 loc=20,8 target=16894
10-19 14:27:51.739  9428  9452 I ReactNativeJS: VIBRA subtab gruppi dopo=4613ms
10-19 14:27:51.739  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:27:51.753  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata gruppi dopo=14ms
10-19 14:27:51.771  9428  9452 I ReactNativeJS: VIBRA subtab disegnata gruppi dopo=32ms
10-19 14:27:51.771  9428  9452 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=32ms
10-19 14:27:51.884  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-19 14:27:54.312 10099 10099 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-19 14:27:54.338  9428  9452 I ReactNativeJS: VIBRA subtab premuto albero dopo=2599ms
10-19 14:27:54.338  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=3770ms lancio=0 x=0 page=362,151 loc=9,8 target=16918
10-19 14:27:54.356  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:27:54.522  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=285
10-19 14:27:54.522  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato albero
10-19 14:27:54.859  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=285
10-19 14:27:56.072  9428  9452 I ReactNativeJS: VIBRA subtab premuto growth dopo=4333ms
10-19 14:27:56.072  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1550ms lancio=0 x=285 page=383,151 loc=39,8 target=16954
10-19 14:27:56.072  9428  9452 I ReactNativeJS: VIBRA subtab growth dopo=4333ms
10-19 14:27:56.072  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:27:56.088  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=16ms
10-19 14:27:56.105  9428  9452 I ReactNativeJS: VIBRA subtab disegnata growth dopo=33ms
10-19 14:27:56.105  9428  9452 I ReactNativeJS: VIBRA subtab cambio growth dopo=33ms
10-19 14:27:56.655  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 14:27:58.790 10120 10120 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-19 14:27:58.841  9428  9452 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2769ms
10-19 14:27:58.843  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=542ms lancio=0 x=435 page=49,151 loc=44,8 target=16930
10-19 14:27:58.844  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:27:59.067  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=289
10-19 14:27:59.070  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 14:27:59.101  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:27:59.101  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=34ms lancio=1 x=289 page=157,151 loc=6,8 target=16930
10-19 14:27:59.101  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:27:59.559  9428  9452 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 14:27:59.559  9428  9452 I ReactNativeJS: VIBRA subtab comitive dopo=457ms
10-19 14:27:59.619  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=517ms
10-19 14:27:59.620  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=289
10-19 14:27:59.623  9428  9452 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=522ms
10-19 14:27:59.624  9428  9452 I ReactNativeJS: VIBRA subtab cambio comitive dopo=523ms
10-19 14:28:01.670 10140 10140 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-19 14:28:01.705  9428  9452 I ReactNativeJS: VIBRA subtab premuto growth dopo=2604ms
10-19 14:28:01.705  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1364ms lancio=0 x=250 page=362,151 loc=15,16 target=16956
10-19 14:28:01.729  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:28:02.014  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 14:28:02.280  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=477
10-19 14:28:02.429  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:28:02.429  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=418ms lancio=1 x=477 page=383,151 loc=74,16 target=16980
10-19 14:28:02.443  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=14ms
10-19 14:28:02.505  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=477
10-19 14:28:02.505  9428  9452 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 14:28:02.506  9428  9452 I ReactNativeJS: VIBRA subtab mappa dopo=63ms
10-19 14:28:02.543  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=100ms
10-19 14:28:02.556  9428  9452 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=113ms
10-19 14:28:02.557  9428  9452 I ReactNativeJS: VIBRA subtab cambio mappa dopo=114ms
10-19 14:28:05.118 10182 10182 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-19 14:28:05.541  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3098ms
10-19 14:28:05.541  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=2178ms lancio=0 x=480 page=49,151 loc=21,16 target=16944
10-19 14:28:05.893  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:28:05.897  9428  9452 I ReactNativeJS: VIBRA subtab tabelle dopo=3454ms
10-19 14:28:05.897  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=356ms
10-19 14:28:05.945  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=48ms
10-19 14:28:06.399  9428  9452 I ReactNativeJS: VIBRA subtab premuto growth dopo=501ms
10-19 14:28:06.399  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=3036ms lancio=0 x=480 page=157,151 loc=7,8 target=16954
10-19 14:28:06.399  9428  9452 I ReactNativeJS: VIBRA subtab growth dopo=502ms
10-19 14:28:06.399  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 14:28:06.430  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=31ms
10-19 14:28:06.431  9428  9452 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=31ms
10-19 14:28:06.805  9428  9452 I ReactNativeJS: VIBRA subtab disegnata growth dopo=406ms
10-19 14:28:06.805  9428  9452 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=406ms
10-19 14:28:06.810  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 14:28:09.075 10204 10204 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-19 14:28:11.739  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=5340ms
10-19 14:28:11.764  9428  9452 I ReactNativeJS: VIBRA subtab cambio growth dopo=5365ms
10-19 14:28:11.775  9428  9452 I ReactNativeJS: VIBRA subtab premuto mappa dopo=5376ms
10-19 14:28:11.775  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=8412ms lancio=0 x=480 page=362,151 loc=24,8 target=16978
10-19 14:28:11.775  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:28:11.776  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 14:28:11.776  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 14:28:11.786  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:28:11.787  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=11ms lancio=0 x=480 page=383,151 loc=77,16 target=16980
10-19 14:28:11.787  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:28:12.931 10225 10225 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-19 14:28:13.300  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=1513ms
10-19 14:28:13.344  9428  9452 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=1557ms
10-19 14:28:13.359  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=1572ms
10-19 14:28:13.359  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1583ms lancio=0 x=480 page=49,151 loc=21,16 target=16944
10-19 14:28:13.360  9428  9452 I ReactNativeJS: VIBRA subtab tabelle dopo=1573ms
10-19 14:28:13.360  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 14:28:13.934  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=574ms
10-19 14:28:13.940  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 14:28:13.941  9428  9452 I ReactNativeJS: VIBRA subtab disegnata growth dopo=582ms
10-19 14:28:13.949  9428  9452 I ReactNativeJS: VIBRA subtab premuto growth dopo=589ms
10-19 14:28:13.949  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=2173ms lancio=0 x=480 page=157,151 loc=7,8 target=16954
10-19 14:28:13.950  9428  9452 I ReactNativeJS: VIBRA subtab growth dopo=590ms
10-19 14:28:13.950  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 14:28:14.119  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=169ms
10-19 14:28:14.188  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:28:14.192  9428  9452 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=241ms
10-19 14:28:14.676  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 14:28:14.676  9428  9452 I ReactNativeJS: VIBRA subtab disegnata growth dopo=726ms
10-19 14:28:14.677  9428  9452 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=726ms
10-19 14:28:14.677  9428  9452 I ReactNativeJS: VIBRA subtab cambio growth dopo=727ms
10-19 14:28:16.183 10246 10246 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-19 14:28:16.257  9428  9452 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2307ms
10-19 14:28:16.257  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1046ms lancio=0 x=435 page=362,151 loc=11,16 target=16980
10-19 14:28:16.275  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:28:16.347  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 14:28:16.348  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 14:28:16.545  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 14:28:16.811  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:28:16.812  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=464ms lancio=0 x=480 page=383,151 loc=77,16 target=16980
10-19 14:28:17.068  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=256ms
10-19 14:28:17.124  9428  9452 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 14:28:17.124  9428  9452 I ReactNativeJS: VIBRA subtab mappa dopo=56ms
10-19 14:28:17.158  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=90ms
10-19 14:28:17.370  9428  9452 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=302ms
10-19 14:28:17.370  9428  9452 I ReactNativeJS: VIBRA subtab cambio mappa dopo=302ms
10-19 14:28:19.932 10289 10289 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-19 14:28:20.450  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3381ms
10-19 14:28:20.454  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=4106ms lancio=0 x=480 page=49,151 loc=21,16 target=16944
10-19 14:28:20.454  9428  9452 I ReactNativeJS: VIBRA subtab tabelle dopo=3386ms
10-19 14:28:20.467  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=13ms
10-19 14:28:20.576  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=110ms
10-19 14:28:20.629  9428  9452 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=162ms
10-19 14:28:20.629  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:28:21.228  9428  9452 I ReactNativeJS: VIBRA subtab premuto growth dopo=762ms
10-19 14:28:21.229  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=4881ms lancio=0 x=480 page=157,151 loc=7,8 target=16954
10-19 14:28:21.229  9428  9452 I ReactNativeJS: VIBRA subtab growth dopo=762ms
10-19 14:28:21.229  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:28:21.265  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=37ms
10-19 14:28:21.266  9428  9452 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=37ms
10-19 14:28:24.008 10310 10310 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-19 14:28:26.350  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=5121ms
10-19 14:28:26.382  9428  9452 I ReactNativeJS: VIBRA subtab disegnata growth dopo=5154ms
10-19 14:28:26.383  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 14:28:26.394  9428  9452 I ReactNativeJS: VIBRA subtab premuto mappa dopo=5165ms
10-19 14:28:26.399  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=10051ms lancio=0 x=480 page=362,151 loc=24,8 target=16978
10-19 14:28:26.401  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:28:26.404  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 14:28:26.405  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 14:28:26.417  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:28:26.421  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=15ms lancio=0 x=480 page=383,151 loc=77,16 target=16980
10-19 14:28:26.422  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 14:28:26.772  9428  9452 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=350ms
10-19 14:28:26.773  9428  9452 I ReactNativeJS: VIBRA subtab cambio growth dopo=351ms
10-19 14:28:27.872 10331 10331 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-19 14:28:29.019  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=2597ms
10-19 14:28:29.084  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:28:29.088  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=4ms lancio=0 x=344 page=49,151 loc=71,16 target=16920
10-19 14:28:29.089  9428  9452 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-19 14:28:29.089  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:28:29.089  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=95
10-19 14:28:30.247  9428  9452 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 14:28:30.247  9428  9452 I ReactNativeJS: VIBRA subtab comitive dopo=3825ms
10-19 14:28:30.247  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 14:28:30.252  9428  9452 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 14:28:30.252  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1163ms lancio=1 x=95 page=157,151 loc=27,8 target=16906
10-19 14:28:30.252  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:28:30.252  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=95
10-19 14:28:30.327  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=75ms
10-19 14:28:30.342  9428  9452 I ReactNativeJS: VIBRA subtab disegnata growth dopo=90ms
10-19 14:28:30.344  9428  9452 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 14:28:30.345  9428  9452 I ReactNativeJS: VIBRA subtab parco dopo=93ms
10-19 14:28:30.345  9428  9452 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=93ms
10-19 14:28:31.359  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata parco dopo=1107ms
10-19 14:28:31.370  9428  9452 I ReactNativeJS: VIBRA subtab cambio comitive dopo=1118ms
10-19 14:28:31.377  9428  9452 I ReactNativeJS: VIBRA subtab disegnata parco dopo=1125ms
10-19 14:28:31.521  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=1269ms
10-19 14:28:31.527  9428  9452 I ReactNativeJS: VIBRA subtab cambio parco dopo=1275ms
10-19 14:28:31.603  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata parco dopo=1351ms
10-19 14:28:31.808  9428  9452 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=1556ms
10-19 14:28:31.810  9428  9452 I ReactNativeJS: VIBRA subtab disegnata parco dopo=1558ms
10-19 14:28:32.618 10354 10354 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-19 14:28:32.672  9428  9452 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2420ms
10-19 14:28:32.672  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=482ms lancio=0 x=50 page=362,151 loc=5,16 target=16932
10-19 14:28:32.698  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:28:32.863  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=236
10-19 14:28:32.955  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 14:28:33.180  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=236
10-19 14:28:33.888  9428  9452 I ReactNativeJS: VIBRA subtab premuto growth dopo=3636ms
10-19 14:28:33.888  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1025ms lancio=0 x=236 page=383,151 loc=22,16 target=16956
10-19 14:28:33.888  9428  9452 I ReactNativeJS: VIBRA subtab growth dopo=3636ms
10-19 14:28:33.888  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:28:33.905  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=16ms
10-19 14:28:33.922  9428  9452 I ReactNativeJS: VIBRA subtab disegnata growth dopo=33ms
10-19 14:28:33.922  9428  9452 I ReactNativeJS: VIBRA subtab cambio growth dopo=33ms
10-19 14:28:34.876  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 14:28:36.716 10376 10376 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-19 14:28:36.879  9428  9452 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2991ms
10-19 14:28:36.880  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1164ms lancio=0 x=435 page=49,151 loc=44,8 target=16930
10-19 14:28:37.188  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 14:28:37.188  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:28:37.202  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=435
10-19 14:28:37.671  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=435
10-19 14:28:38.738  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=4850ms
10-19 14:28:38.738  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=3023ms lancio=0 x=435 page=157,151 loc=85,16 target=16944
10-19 14:28:38.739  9428  9452 I ReactNativeJS: VIBRA subtab tabelle dopo=4850ms
10-19 14:28:38.741  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=3ms
10-19 14:28:38.755  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=14ms
10-19 14:28:38.772  9428  9452 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=30ms
10-19 14:28:38.772  9428  9452 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=30ms
10-19 14:28:40.446  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:28:41.592 10397 10397 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-19 14:28:41.656  9428  9452 I ReactNativeJS: VIBRA subtab premuto analitica dopo=2914ms
10-19 14:28:41.656  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=970ms lancio=0 x=344 page=362,151 loc=19,16 target=16968
10-19 14:28:41.682  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:28:42.063  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 14:28:42.063  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 14:28:42.063  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-19 14:28:43.621  9428  9452 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4880ms
10-19 14:28:43.621  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=1899ms lancio=0 x=480 page=383,151 loc=77,16 target=16980
10-19 14:28:43.622  9428  9452 I ReactNativeJS: VIBRA subtab mappa dopo=4880ms
10-19 14:28:43.622  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:28:43.638  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=16ms
10-19 14:28:43.655  9428  9452 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=33ms
10-19 14:28:43.655  9428  9452 I ReactNativeJS: VIBRA subtab cambio mappa dopo=33ms
10-19 14:28:43.915  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 14:28:46.727  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3106ms
10-19 14:28:46.733  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=5010ms lancio=0 x=480 page=49,151 loc=21,16 target=16944
10-19 14:28:46.873  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:28:46.874  9428  9452 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 14:28:47.661  9428  9452 I ReactNativeJS: VIBRA hscroll lancio x=408
10-19 14:28:48.421  9428  9452 I ReactNativeJS: VIBRA hscroll ferma x=408
10-19 14:28:50.726 10441 10441 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-19 14:28:51.040  9428  9452 I ReactNativeJS: VIBRA subtab premuto growth dopo=7418ms
10-19 14:28:51.040  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=3380ms lancio=0 x=408 page=265,151 loc=75,16 target=16956
10-19 14:28:51.323  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 14:28:51.324  9428  9452 I ReactNativeJS: VIBRA subtab growth dopo=7702ms
10-19 14:28:51.336  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=295ms
10-19 14:28:51.378  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=42ms
10-19 14:28:51.802  9428  9452 I ReactNativeJS: VIBRA subtab disegnata growth dopo=466ms
10-19 14:28:52.093  9428  9452 I ReactNativeJS: VIBRA subtab cambio growth dopo=758ms
10-19 14:28:55.265  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3930ms
10-19 14:28:55.266  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=7606ms lancio=0 x=408 page=157,151 loc=25,8 target=16942
10-19 14:28:55.270  9428  9452 I ReactNativeJS: VIBRA subtab tabelle dopo=3934ms
10-19 14:28:55.271  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=5ms
10-19 14:28:55.528  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=257ms
10-19 14:28:56.918  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:28:56.918  9428  9452 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=1647ms
10-19 14:28:57.248  9428  9452 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=1978ms
10-19 14:28:57.249  9428  9452 I ReactNativeJS: VIBRA subtab premuto analitica dopo=1978ms
10-19 14:28:57.250  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=573ms lancio=0 x=435 page=265,151 loc=12,16 target=16968
10-19 14:28:57.282  9428  9452 I ReactNativeJS: VIBRA subtab analitica dopo=2011ms
10-19 14:28:57.282  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=33ms
10-19 14:28:58.772  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=1489ms
10-19 14:28:59.672  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=2390ms
10-19 14:28:59.677  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-19 14:28:59.678  9428  9452 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=2396ms
10-19 14:28:59.695  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2413ms
10-19 14:28:59.695  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=3019ms lancio=0 x=435 page=157,151 loc=85,16 target=16944
10-19 14:28:59.696  9428  9452 I ReactNativeJS: VIBRA subtab tabelle dopo=2413ms
10-19 14:28:59.696  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 14:28:59.716  9428  9452 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=20ms
10-19 14:28:59.717  9428  9452 I ReactNativeJS: VIBRA subtab cambio analitica dopo=21ms
10-19 14:29:01.119  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=1423ms
10-19 14:29:01.126  9428  9452 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=1430ms
10-19 14:29:01.126  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:29:02.822  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=3126ms
10-19 14:29:03.465  9428  9452 I ReactNativeJS: VIBRA subtab premuto growth dopo=3769ms
10-19 14:29:03.465  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=2773ms lancio=0 x=344 page=265,151 loc=12,16 target=16956
10-19 14:29:03.465  9428  9452 I ReactNativeJS: VIBRA subtab growth dopo=3769ms
10-19 14:29:03.465  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:29:03.484  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=19ms
10-19 14:29:03.484  9428  9452 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=19ms
10-19 14:29:03.485  9428  9452 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=20ms
10-19 14:29:03.693  9428  9452 I ReactNativeJS: VIBRA subtab disegnata growth dopo=228ms
10-19 14:29:03.693  9428  9452 I ReactNativeJS: VIBRA subtab cambio growth dopo=228ms
10-19 14:29:03.694  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 14:29:05.202  9428  9452 I ReactNativeJS: VIBRA subtab premuto comitive dopo=1736ms
10-19 14:29:05.202  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=4510ms lancio=0 x=344 page=157,151 loc=93,16 target=16932
10-19 14:29:05.202  9428  9452 I ReactNativeJS: VIBRA subtab comitive dopo=1737ms
10-19 14:29:05.202  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 14:29:05.322  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=119ms
10-19 14:29:06.318  9428  9452 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=1116ms
10-19 14:29:06.322  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 14:29:06.323  9428  9452 I ReactNativeJS: VIBRA subtab cambio comitive dopo=1121ms
10-19 14:29:07.638  9428  9452 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2436ms
10-19 14:29:07.639  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=465ms lancio=0 x=250 page=265,151 loc=8,16 target=16944
10-19 14:29:07.655  9428  9452 I ReactNativeJS: VIBRA subtab tabelle dopo=2452ms
10-19 14:29:07.655  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=16ms
10-19 14:29:07.671  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=17ms
10-19 14:29:07.691  9428  9452 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=36ms
10-19 14:29:07.691  9428  9452 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=36ms
10-19 14:29:08.893  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 14:29:10.394  9428  9452 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2739ms
10-19 14:29:10.394  9428  9452 I ReactNativeJS: VIBRA hscroll tocco dopo=302ms lancio=0 x=344 page=157,151 loc=93,16 target=16932
10-19 14:29:10.412  9428  9452 I ReactNativeJS: VIBRA subtab comitive dopo=2757ms
10-19 14:29:10.412  9428  9452 I ReactNativeJS: VIBRA hscroll fine-tocco durata=18ms
10-19 14:29:10.438  9428  9452 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=26ms
10-19 14:29:10.513  9428  9452 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=101ms
10-19 14:29:10.514  9428  9452 I ReactNativeJS: VIBRA subtab cambio comitive dopo=101ms
10-19 14:29:11.218  9428  9452 I ReactNativeJS: VIBRA subtab rilasciato comitive
```
