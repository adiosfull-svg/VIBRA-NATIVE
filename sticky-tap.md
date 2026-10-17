# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x=983 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | NO |
| 0s | fine | NO |
| 0.2s | inizio | NO |
| 0.2s | fine | sì |
| 0.4s | inizio | NO |
| 0.4s | fine | sì |
| 0.7s | inizio | sì |
| 0.7s | fine | sì |
| 1.0s | inizio | sì |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |
| 0s | inizio | sì |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | sì |
| 0.4s | inizio | sì |
| 0.4s | fine | sì |
| 0.7s | inizio | sì |
| 0.7s | fine | sì |
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

Tap arrivati: 27 su 32

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-17 20:25:40.109  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=716361ms
10-17 20:25:40.157  9491  9515 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=716409ms
10-17 20:25:43.028  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=719280ms
10-17 20:25:43.597  9491  9515 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=719849ms
10-17 20:25:47.783  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=724036ms
10-17 20:25:47.893  9491  9515 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=724146ms
10-17 20:26:09.570  9491  9515 I ReactNativeJS: VIBRA subtab premuto clienti dopo=745823ms
10-17 20:26:09.571  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,151 loc=28,16 target=7464
10-17 20:26:09.588  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:09.703  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 20:26:10.186  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 20:26:10.186  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 20:26:15.537  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=5334ms lancio=0 x=0 page=362,151 loc=9,8 target=7498
10-17 20:26:15.554  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:16.645  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=274
10-17 20:26:16.789  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=274
10-17 20:26:21.996  9762  9762 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 20:26:22.020  9491  9515 I ReactNativeJS: VIBRA subtab premuto albero dopo=758272ms
10-17 20:26:22.020  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=5674ms lancio=0 x=274 page=49,151 loc=1,16 target=7500
10-17 20:26:22.056  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:22.383  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=97
10-17 20:26:22.384  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:26:22.526  9491  9515 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:26:22.527  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=436ms lancio=1 x=97 page=157,151 loc=29,8 target=7486
10-17 20:26:22.528  9491  9515 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 20:26:22.529  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:22.763  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=97
10-17 20:26:22.879  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=97
10-17 20:26:25.322  9782  9782 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 20:26:25.354  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=3263ms lancio=0 x=97 page=362,151 loc=20,8 target=7510
10-17 20:26:25.370  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:25.435  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=326
10-17 20:26:25.662  9491  9515 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:26:25.663  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=228ms lancio=1 x=326 page=374,151 loc=13,16 target=7548
10-17 20:26:25.663  9491  9515 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 20:26:25.663  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:25.727  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=326
10-17 20:26:26.042  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=326
10-17 20:26:28.217  9802  9802 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 20:26:28.237  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=2802ms lancio=0 x=326 page=49,151 loc=21,8 target=7498
10-17 20:26:28.254  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:28.617  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=66
10-17 20:26:29.001  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 20:26:29.002  9491  9515 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:26:29.002  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=1ms lancio=0 x=0 page=157,151 loc=20,8 target=7474
10-17 20:26:29.002  9491  9515 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 20:26:29.002  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:29.221  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 20:26:29.221  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 20:26:31.778  9822  9822 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 20:26:31.804  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=2803ms lancio=0 x=0 page=362,151 loc=9,8 target=7498
10-17 20:26:31.804  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:32.538  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=287
10-17 20:26:32.543  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=287
10-17 20:26:32.803  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=577ms lancio=0 x=287 page=374,151 loc=33,8 target=7534
10-17 20:26:32.804  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:26:32.870  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:26:32.870  9491  9515 I ReactNativeJS: VIBRA subtab growth dopo=66ms
10-17 20:26:32.906  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=103ms
10-17 20:26:32.921  9491  9515 I ReactNativeJS: VIBRA subtab disegnata growth dopo=117ms
10-17 20:26:32.921  9491  9515 I ReactNativeJS: VIBRA subtab cambio growth dopo=117ms
10-17 20:26:35.576  9845  9845 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 20:26:35.603  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=486ms lancio=0 x=435 page=49,151 loc=44,8 target=7510
10-17 20:26:35.621  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:36.053  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=175
10-17 20:26:36.566  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 20:26:36.567  9491  9515 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:26:36.567  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=1ms lancio=0 x=0 page=157,151 loc=20,8 target=7474
10-17 20:26:36.568  9491  9515 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 20:26:36.568  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:36.838  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 20:26:36.838  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 20:26:39.439  9865  9865 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 20:26:39.470  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=2905ms lancio=0 x=0 page=362,151 loc=9,8 target=7498
10-17 20:26:39.487  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:39.549  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=240
10-17 20:26:40.161  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 20:26:40.162  9491  9515 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:26:40.162  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=1ms lancio=0 x=480 page=374,151 loc=36,8 target=7558
10-17 20:26:40.163  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:26:40.281  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:26:40.282  9491  9515 I ReactNativeJS: VIBRA subtab mappa dopo=119ms
10-17 20:26:40.303  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=140ms
10-17 20:26:40.741  9491  9515 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=578ms
10-17 20:26:40.785  9491  9515 I ReactNativeJS: VIBRA subtab cambio mappa dopo=622ms
10-17 20:26:43.007  9990  9990 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 20:26:43.229  9491  9515 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3066ms
10-17 20:26:43.229  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=3068ms lancio=0 x=480 page=49,151 loc=21,16 target=7524
10-17 20:26:43.229  9491  9515 I ReactNativeJS: VIBRA subtab tabelle dopo=3067ms
10-17 20:26:43.229  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:26:43.299  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=70ms
10-17 20:26:43.387  9491  9515 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=158ms
10-17 20:26:43.711  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:26:43.712  9491  9515 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=483ms
10-17 20:26:46.351  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=6190ms lancio=0 x=480 page=157,151 loc=7,8 target=7534
10-17 20:26:46.359  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=8ms
10-17 20:26:47.144 10028 10028 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 20:26:48.251  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=8090ms lancio=0 x=480 page=362,151 loc=24,8 target=7558
10-17 20:26:48.251  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:26:48.252  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=8090ms lancio=0 x=480 page=374,151 loc=36,8 target=7558
10-17 20:26:48.252  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:26:48.254  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:26:48.254  9491  9515 I ReactNativeJS: VIBRA subtab growth dopo=2ms
10-17 20:26:48.273  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=21ms
10-17 20:26:48.288  9491  9515 I ReactNativeJS: VIBRA subtab disegnata growth dopo=35ms
10-17 20:26:48.288  9491  9515 I ReactNativeJS: VIBRA subtab cambio growth dopo=36ms
10-17 20:26:50.942 10050 10050 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 20:26:50.988  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=743ms lancio=0 x=435 page=49,151 loc=44,8 target=7510
10-17 20:26:50.988  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:51.302  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=224
10-17 20:26:51.473  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=224
10-17 20:26:52.320  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=1018ms lancio=0 x=224 page=157,151 loc=28,8 target=7498
10-17 20:26:52.320  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:26:52.386  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:26:52.386  9491  9515 I ReactNativeJS: VIBRA subtab albero dopo=66ms
10-17 20:26:52.400  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=80ms
10-17 20:26:52.404  9491  9515 I ReactNativeJS: VIBRA subtab disegnata albero dopo=84ms
10-17 20:26:52.420  9491  9515 I ReactNativeJS: VIBRA subtab cambio albero dopo=100ms
10-17 20:26:54.876 10071 10071 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 20:26:54.903  9491  9515 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2583ms
10-17 20:26:54.904  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=2245ms lancio=0 x=157 page=362,151 loc=13,16 target=7524
10-17 20:26:54.923  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:55.197  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=395
10-17 20:26:55.198  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:26:55.421  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=395
10-17 20:26:56.236  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=1233ms lancio=0 x=395 page=374,151 loc=50,8 target=7546
10-17 20:26:56.237  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:26:56.303  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:26:56.303  9491  9515 I ReactNativeJS: VIBRA subtab analitica dopo=66ms
10-17 20:26:56.316  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=80ms
10-17 20:26:56.320  9491  9515 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=84ms
10-17 20:26:56.336  9491  9515 I ReactNativeJS: VIBRA subtab cambio analitica dopo=100ms
10-17 20:26:58.790 10093 10093 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 20:26:58.821  9491  9515 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2584ms
10-17 20:26:58.821  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=1496ms lancio=0 x=480 page=49,151 loc=21,16 target=7524
10-17 20:26:58.822  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:26:59.060  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:26:59.351  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=177
10-17 20:26:59.421  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=177
10-17 20:27:00.888  9491  9515 I ReactNativeJS: VIBRA subtab premuto albero dopo=4652ms
10-17 20:27:00.889  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=1829ms lancio=0 x=177 page=157,151 loc=12,16 target=7500
10-17 20:27:00.903  9491  9515 I ReactNativeJS: VIBRA subtab albero dopo=4667ms
10-17 20:27:00.903  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=15ms
10-17 20:27:00.925  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=22ms
10-17 20:27:00.937  9491  9515 I ReactNativeJS: VIBRA subtab disegnata albero dopo=34ms
10-17 20:27:00.937  9491  9515 I ReactNativeJS: VIBRA subtab cambio albero dopo=34ms
10-17 20:27:01.071  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:27:03.457 10114 10114 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 20:27:03.487  9491  9515 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2584ms
10-17 20:27:03.488  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=2113ms lancio=0 x=157 page=362,151 loc=13,16 target=7524
10-17 20:27:03.489  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:27:03.633  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:27:03.815  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=467
10-17 20:27:03.990  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=467
10-17 20:27:05.370  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=1737ms lancio=0 x=467 page=374,151 loc=23,8 target=7558
10-17 20:27:05.370  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:27:05.436  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:27:05.436  9491  9515 I ReactNativeJS: VIBRA subtab mappa dopo=66ms
10-17 20:27:05.449  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=79ms
10-17 20:27:05.454  9491  9515 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=83ms
10-17 20:27:05.470  9491  9515 I ReactNativeJS: VIBRA subtab cambio mappa dopo=100ms
10-17 20:27:08.387 10158 10158 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 20:27:08.951  9491  9515 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3580ms
10-17 20:27:08.951  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=2642ms lancio=0 x=480 page=49,151 loc=21,16 target=7524
10-17 20:27:08.953  9491  9515 I ReactNativeJS: VIBRA subtab tabelle dopo=3583ms
10-17 20:27:08.957  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=5ms
10-17 20:27:08.998  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=41ms
10-17 20:27:09.028  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=2719ms lancio=0 x=480 page=157,151 loc=7,8 target=7534
10-17 20:27:09.035  9491  9515 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=78ms
10-17 20:27:09.772  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=744ms
10-17 20:27:09.775  9491  9515 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=2ms
10-17 20:27:09.775  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:27:12.492 10179 10179 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 20:27:14.878  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=8569ms lancio=0 x=480 page=362,151 loc=24,8 target=7558
10-17 20:27:14.878  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:27:14.879  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 20:27:14.879  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 20:27:14.879  9491  9515 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:27:14.879  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=8570ms lancio=0 x=480 page=374,151 loc=36,8 target=7558
10-17 20:27:14.884  9491  9515 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 20:27:14.884  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:27:14.892  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 20:27:14.892  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 20:27:16.246 10200 10200 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 20:27:16.310  9491  9515 I ReactNativeJS: VIBRA subtab premuto albero dopo=6537ms
10-17 20:27:16.311  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=379ms lancio=0 x=344 page=49,151 loc=71,16 target=7500
10-17 20:27:16.312  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:27:16.600  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=194
10-17 20:27:16.610  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:27:16.969  9491  9515 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:27:16.970  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=370ms lancio=1 x=194 page=157,151 loc=29,16 target=7500
10-17 20:27:16.970  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:27:17.337  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:27:17.337  9491  9515 I ReactNativeJS: VIBRA subtab albero dopo=367ms
10-17 20:27:17.380  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=411ms
10-17 20:27:17.389  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=194
10-17 20:27:17.393  9491  9515 I ReactNativeJS: VIBRA subtab disegnata albero dopo=423ms
10-17 20:27:17.394  9491  9515 I ReactNativeJS: VIBRA subtab cambio albero dopo=424ms
10-17 20:27:19.534 10220 10220 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 20:27:19.553  9491  9515 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2583ms
10-17 20:27:19.553  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=1276ms lancio=0 x=157 page=362,151 loc=13,16 target=7524
10-17 20:27:19.571  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:27:19.701  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:27:19.901  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=413
10-17 20:27:19.976  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=413
10-17 20:27:20.156  9491  9515 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3186ms
10-17 20:27:20.156  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=455ms lancio=0 x=413 page=374,151 loc=2,16 target=7560
10-17 20:27:20.156  9491  9515 I ReactNativeJS: VIBRA subtab mappa dopo=3186ms
10-17 20:27:20.156  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:27:20.245  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=89ms
10-17 20:27:20.253  9491  9515 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=97ms
10-17 20:27:20.253  9491  9515 I ReactNativeJS: VIBRA subtab cambio mappa dopo=97ms
10-17 20:27:20.461  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 20:27:23.429 10265 10265 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 20:27:23.815  9491  9515 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3659ms
10-17 20:27:23.815  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=3073ms lancio=0 x=480 page=49,151 loc=21,16 target=7524
10-17 20:27:23.815  9491  9515 I ReactNativeJS: VIBRA subtab tabelle dopo=3659ms
10-17 20:27:23.815  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:27:23.858  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=42ms
10-17 20:27:23.973  9491  9515 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=157ms
10-17 20:27:23.974  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:27:24.527  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=3785ms lancio=0 x=480 page=157,151 loc=7,8 target=7534
10-17 20:27:24.527  9491  9515 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=712ms
10-17 20:27:27.634 10286 10286 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 20:27:29.881  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=5354ms
10-17 20:27:29.888  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=9146ms lancio=0 x=480 page=362,151 loc=24,8 target=7558
10-17 20:27:29.889  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:27:29.890  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 20:27:29.891  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 20:27:29.892  9491  9515 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:27:29.892  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=0ms lancio=0 x=480 page=374,151 loc=36,8 target=7558
10-17 20:27:29.892  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:27:30.420  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:27:30.420  9491  9515 I ReactNativeJS: VIBRA subtab mappa dopo=528ms
10-17 20:27:30.470  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=578ms
10-17 20:27:30.786  9491  9515 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=894ms
10-17 20:27:30.979  9491  9515 I ReactNativeJS: VIBRA subtab cambio mappa dopo=1087ms
10-17 20:27:31.782 10330 10330 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 20:27:32.197  9491  9515 I ReactNativeJS: VIBRA subtab premuto albero dopo=2305ms
10-17 20:27:32.197  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=1412ms lancio=0 x=344 page=49,151 loc=71,16 target=7500
10-17 20:27:32.197  9491  9515 I ReactNativeJS: VIBRA subtab albero dopo=2305ms
10-17 20:27:32.197  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:27:32.242  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=45ms
10-17 20:27:32.411  9491  9515 I ReactNativeJS: VIBRA subtab disegnata albero dopo=214ms
10-17 20:27:32.411  9491  9515 I ReactNativeJS: VIBRA subtab cambio albero dopo=214ms
10-17 20:27:32.412  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:27:32.968  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=213ms lancio=0 x=480 page=157,151 loc=7,8 target=7534
10-17 20:27:32.984  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=17ms
10-17 20:27:33.038  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:27:33.038  9491  9515 I ReactNativeJS: VIBRA subtab parco dopo=54ms
10-17 20:27:33.065  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata parco dopo=80ms
10-17 20:27:33.072  9491  9515 I ReactNativeJS: VIBRA subtab disegnata parco dopo=87ms
10-17 20:27:33.072  9491  9515 I ReactNativeJS: VIBRA subtab cambio parco dopo=87ms
10-17 20:27:35.538 10353 10353 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 20:27:35.570  9491  9515 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2586ms
10-17 20:27:35.570  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=2045ms lancio=0 x=50 page=362,151 loc=5,16 target=7512
10-17 20:27:35.588  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:27:35.758  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=266
10-17 20:27:35.775  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-17 20:27:36.106  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=266
10-17 20:27:36.503  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=745ms lancio=0 x=266 page=374,151 loc=11,8 target=7534
10-17 20:27:36.503  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:27:36.570  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:27:36.570  9491  9515 I ReactNativeJS: VIBRA subtab growth dopo=66ms
10-17 20:27:36.582  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=79ms
10-17 20:27:36.587  9491  9515 I ReactNativeJS: VIBRA subtab disegnata growth dopo=83ms
10-17 20:27:36.603  9491  9515 I ReactNativeJS: VIBRA subtab cambio growth dopo=100ms
10-17 20:27:39.263 10374 10374 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 20:27:39.287  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=763ms lancio=0 x=435 page=49,151 loc=44,8 target=7510
10-17 20:27:39.287  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:27:39.929  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=148
10-17 20:27:40.037  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=148
10-17 20:27:40.970  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=1274ms lancio=0 x=148 page=157,151 loc=80,8 target=7486
10-17 20:27:40.970  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:27:41.036  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:27:41.037  9491  9515 I ReactNativeJS: VIBRA subtab parco dopo=66ms
10-17 20:27:41.050  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata parco dopo=80ms
10-17 20:27:41.053  9491  9515 I ReactNativeJS: VIBRA subtab disegnata parco dopo=83ms
10-17 20:27:41.072  9491  9515 I ReactNativeJS: VIBRA subtab cambio parco dopo=102ms
10-17 20:27:43.522 10396 10396 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 20:27:43.554  9491  9515 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2584ms
10-17 20:27:43.554  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=2160ms lancio=0 x=50 page=362,151 loc=5,16 target=7512
10-17 20:27:43.554  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:27:43.746  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=288
10-17 20:27:43.747  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-17 20:27:44.059  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 20:27:44.787  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=728ms lancio=0 x=480 page=374,151 loc=36,8 target=7558
10-17 20:27:44.787  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:27:44.853  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:27:44.853  9491  9515 I ReactNativeJS: VIBRA subtab mappa dopo=66ms
10-17 20:27:44.866  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=80ms
10-17 20:27:44.870  9491  9515 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=83ms
10-17 20:27:44.886  9491  9515 I ReactNativeJS: VIBRA subtab cambio mappa dopo=99ms
10-17 20:27:47.538 10440 10440 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 20:27:47.932  9491  9515 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3146ms
10-17 20:27:47.933  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=3874ms lancio=0 x=480 page=49,151 loc=21,16 target=7524
10-17 20:27:47.933  9491  9515 I ReactNativeJS: VIBRA subtab tabelle dopo=3146ms
10-17 20:27:47.933  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:27:47.964  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=31ms
10-17 20:27:48.320  9491  9515 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=387ms
10-17 20:27:48.321  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:27:48.696  9491  9515 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=763ms
10-17 20:27:52.651 10461 10461 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 20:27:54.037  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=9978ms lancio=0 x=480 page=157,151 loc=7,8 target=7534
10-17 20:27:54.037  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-17 20:27:54.045  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=9986ms lancio=0 x=480 page=362,151 loc=24,8 target=7558
10-17 20:27:54.049  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:27:54.049  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 20:27:54.049  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 20:27:54.569  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:27:54.579  9491  9515 I ReactNativeJS: VIBRA subtab growth dopo=541ms
10-17 20:27:54.600  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=563ms
10-17 20:27:54.958  9491  9515 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:27:54.958  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=908ms lancio=0 x=480 page=374,151 loc=36,8 target=7558
10-17 20:27:54.958  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:27:54.959  9491  9515 I ReactNativeJS: VIBRA subtab disegnata growth dopo=1ms
10-17 20:27:55.278  9491  9515 I ReactNativeJS: VIBRA subtab cambio growth dopo=320ms
10-17 20:27:55.278  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:27:55.278  9491  9515 I ReactNativeJS: VIBRA subtab analitica dopo=321ms
10-17 20:27:56.234  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=1276ms
10-17 20:27:56.922  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=1964ms
10-17 20:27:56.926  9491  9515 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=1968ms
10-17 20:27:56.993  9491  9515 I ReactNativeJS: VIBRA subtab cambio analitica dopo=2035ms
10-17 20:27:56.997  9491  9515 I ReactNativeJS: VIBRA subtab disegnata growth dopo=2040ms
10-17 20:27:57.449  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=2491ms
10-17 20:27:58.024  9491  9515 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:27:58.024  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=5ms lancio=0 x=435 page=49,151 loc=44,8 target=7510
10-17 20:27:58.086  9491  9515 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=3128ms
10-17 20:27:58.205  9491  9515 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 20:27:58.206  9491  9515 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:27:58.600  9491  9515 I ReactNativeJS: VIBRA hscroll lancio x=377
10-17 20:27:58.971  9491  9515 I ReactNativeJS: VIBRA hscroll ferma x=377
10-17 20:28:01.584 10485 10485 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-17 20:28:01.637  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=3037ms lancio=0 x=377 page=265,151 loc=12,8 target=7534
10-17 20:28:01.637  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:28:01.703  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:28:01.703  9491  9515 I ReactNativeJS: VIBRA subtab growth dopo=66ms
10-17 20:28:01.717  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=80ms
10-17 20:28:01.720  9491  9515 I ReactNativeJS: VIBRA subtab disegnata growth dopo=83ms
10-17 20:28:01.736  9491  9515 I ReactNativeJS: VIBRA subtab cambio growth dopo=100ms
10-17 20:28:04.459  9491  9515 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2822ms
10-17 20:28:04.460  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=998ms lancio=0 x=435 page=157,151 loc=85,16 target=7524
10-17 20:28:04.460  9491  9515 I ReactNativeJS: VIBRA subtab tabelle dopo=2824ms
10-17 20:28:04.463  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-17 20:28:04.492  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=28ms
10-17 20:28:04.826  9491  9515 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=362ms
10-17 20:28:04.826  9491  9515 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=363ms
10-17 20:28:04.827  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:28:07.169  9491  9515 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:28:07.169  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=3707ms lancio=0 x=435 page=265,151 loc=12,16 target=7548
10-17 20:28:07.182  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=13ms
10-17 20:28:07.778  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:28:07.778  9491  9515 I ReactNativeJS: VIBRA subtab growth dopo=596ms
10-17 20:28:07.821  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=639ms
10-17 20:28:07.843  9491  9515 I ReactNativeJS: VIBRA subtab disegnata growth dopo=661ms
10-17 20:28:07.847  9491  9515 I ReactNativeJS: VIBRA subtab cambio growth dopo=665ms
10-17 20:28:10.199  9491  9515 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:28:10.202  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=4ms lancio=0 x=435 page=157,151 loc=85,16 target=7524
10-17 20:28:10.209  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=6ms
10-17 20:28:10.389  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:28:10.389  9491  9515 I ReactNativeJS: VIBRA subtab tabelle dopo=180ms
10-17 20:28:10.408  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=199ms
10-17 20:28:10.472  9491  9515 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=264ms
10-17 20:28:10.847  9491  9515 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=638ms
10-17 20:28:12.867  9491  9515 I ReactNativeJS: VIBRA subtab premuto analitica dopo=2658ms
10-17 20:28:12.867  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=2668ms lancio=0 x=435 page=265,151 loc=12,16 target=7548
10-17 20:28:12.867  9491  9515 I ReactNativeJS: VIBRA subtab analitica dopo=2658ms
10-17 20:28:12.867  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:28:12.884  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=16ms
10-17 20:28:13.140  9491  9515 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=273ms
10-17 20:28:13.140  9491  9515 I ReactNativeJS: VIBRA subtab cambio analitica dopo=273ms
10-17 20:28:13.141  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-17 20:28:15.480  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=751ms lancio=0 x=480 page=157,151 loc=7,8 target=7534
10-17 20:28:15.480  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-17 20:28:15.536  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:28:15.537  9491  9515 I ReactNativeJS: VIBRA subtab growth dopo=56ms
10-17 20:28:15.571  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=91ms
10-17 20:28:15.587  9491  9515 I ReactNativeJS: VIBRA subtab disegnata growth dopo=107ms
10-17 20:28:15.587  9491  9515 I ReactNativeJS: VIBRA subtab cambio growth dopo=107ms
10-17 20:28:18.513  9491  9515 I ReactNativeJS: VIBRA subtab premuto analitica dopo=3033ms
10-17 20:28:18.514  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=574ms lancio=0 x=435 page=265,151 loc=12,16 target=7548
10-17 20:28:18.514  9491  9515 I ReactNativeJS: VIBRA subtab analitica dopo=3034ms
10-17 20:28:18.514  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:28:18.651  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=137ms
10-17 20:28:18.657  9491  9515 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-17 20:28:18.658  9491  9515 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=144ms
10-17 20:28:18.912  9491  9515 I ReactNativeJS: VIBRA subtab cambio analitica dopo=399ms
10-17 20:28:21.187  9491  9515 I ReactNativeJS: VIBRA hscroll tocco dopo=762ms lancio=0 x=480 page=157,151 loc=7,8 target=7534
10-17 20:28:21.187  9491  9515 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:28:21.253  9491  9515 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:28:21.253  9491  9515 I ReactNativeJS: VIBRA subtab growth dopo=66ms
10-17 20:28:21.266  9491  9515 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=79ms
10-17 20:28:21.271  9491  9515 I ReactNativeJS: VIBRA subtab disegnata growth dopo=84ms
10-17 20:28:21.289  9491  9515 I ReactNativeJS: VIBRA subtab cambio growth dopo=102ms
```
