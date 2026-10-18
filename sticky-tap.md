# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x=986 (barra alla fine).
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
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |
| 0s | inizio | sì |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | NO |
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

Tap arrivati: 29 su 32

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-18 14:38:09.355  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=769190ms
10-18 14:38:09.404  9301  9324 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=769238ms
10-18 14:38:12.597  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=772432ms
10-18 14:38:13.121  9301  9324 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=772955ms
10-18 14:38:15.101  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=774936ms
10-18 14:38:16.099  9301  9324 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=775933ms
10-18 14:38:41.607  9301  9324 I ReactNativeJS: VIBRA subtab premuto clienti dopo=801442ms
10-18 14:38:41.607  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,151 loc=28,16 target=2988
10-18 14:38:41.644  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:38:41.741  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-18 14:38:42.223  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=0
10-18 14:38:42.224  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=0
10-18 14:38:47.757  9301  9324 I ReactNativeJS: VIBRA subtab premuto albero dopo=807592ms
10-18 14:38:47.757  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=5516ms lancio=0 x=0 page=362,151 loc=9,8 target=3022
10-18 14:38:47.792  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:38:48.040  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato albero
10-18 14:38:48.656  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=272
10-18 14:38:48.807  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=272
10-18 14:38:54.198  9574  9574 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-18 14:38:54.224  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=5569ms lancio=0 x=272 page=49,151 loc=304,20 target=3086
10-18 14:38:54.224  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:38:54.524  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=0
10-18 14:38:54.524  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=0
10-18 14:38:54.761  9301  9324 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-18 14:38:54.761  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=237ms lancio=0 x=0 page=157,151 loc=20,8 target=2998
10-18 14:38:54.761  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:38:54.999  9301  9324 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-18 14:38:54.999  9301  9324 I ReactNativeJS: VIBRA subtab gruppi dopo=238ms
10-18 14:38:55.018  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata gruppi dopo=257ms
10-18 14:38:55.028  9301  9324 I ReactNativeJS: VIBRA subtab disegnata gruppi dopo=267ms
10-18 14:38:55.028  9301  9324 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=267ms
10-18 14:38:57.319  9596  9596 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-18 14:38:57.340  9301  9324 I ReactNativeJS: VIBRA subtab premuto albero dopo=2579ms
10-18 14:38:57.340  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=2817ms lancio=0 x=0 page=362,151 loc=9,8 target=3022
10-18 14:38:57.358  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:38:57.509  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato albero
10-18 14:38:57.700  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=251
10-18 14:38:57.775  9301  9324 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-18 14:38:57.775  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=266ms lancio=1 x=251 page=376,151 loc=30,16 target=3060
10-18 14:38:57.790  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=15ms
10-18 14:38:57.859  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=251
10-18 14:38:57.860  9301  9324 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-18 14:38:57.860  9301  9324 I ReactNativeJS: VIBRA subtab growth dopo=70ms
10-18 14:38:57.901  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=111ms
10-18 14:38:57.961  9301  9324 I ReactNativeJS: VIBRA subtab disegnata growth dopo=170ms
10-18 14:38:57.961  9301  9324 I ReactNativeJS: VIBRA subtab cambio growth dopo=171ms
10-18 14:39:00.686  9616  9616 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-18 14:39:01.185  9301  9324 I ReactNativeJS: VIBRA subtab premuto comitive dopo=3395ms
10-18 14:39:01.185  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1182ms lancio=0 x=435 page=49,151 loc=44,8 target=3034
10-18 14:39:01.186  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:01.632  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-18 14:39:01.868  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=272
10-18 14:39:02.040  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=272
10-18 14:39:02.132  9301  9324 I ReactNativeJS: VIBRA subtab premuto comitive dopo=4342ms
10-18 14:39:02.133  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=513ms lancio=0 x=272 page=157,151 loc=20,16 target=3036
10-18 14:39:02.146  9301  9324 I ReactNativeJS: VIBRA subtab comitive dopo=4356ms
10-18 14:39:02.147  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=14ms
10-18 14:39:02.170  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=23ms
10-18 14:39:02.348  9301  9324 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=201ms
10-18 14:39:02.348  9301  9324 I ReactNativeJS: VIBRA subtab cambio comitive dopo=201ms
10-18 14:39:02.356  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-18 14:39:04.757  9639  9639 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-18 14:39:04.791  9301  9324 I ReactNativeJS: VIBRA subtab premuto growth dopo=2644ms
10-18 14:39:04.791  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1588ms lancio=0 x=250 page=362,151 loc=15,16 target=3060
10-18 14:39:04.791  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:05.115  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato growth
10-18 14:39:05.132  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=480
10-18 14:39:05.132  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=480
10-18 14:39:05.410  9301  9324 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3263ms
10-18 14:39:05.410  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=565ms lancio=0 x=480 page=376,151 loc=37,8 target=3082
10-18 14:39:05.410  9301  9324 I ReactNativeJS: VIBRA subtab mappa dopo=3264ms
10-18 14:39:05.410  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:39:05.450  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=40ms
10-18 14:39:05.521  9301  9324 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=110ms
10-18 14:39:05.521  9301  9324 I ReactNativeJS: VIBRA subtab cambio mappa dopo=111ms
10-18 14:39:05.826  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-18 14:39:08.211  9766  9766 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-18 14:39:08.767  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3357ms
10-18 14:39:08.768  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=3923ms lancio=0 x=480 page=49,151 loc=21,16 target=3048
10-18 14:39:08.770  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:09.304  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=330
10-18 14:39:09.305  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:39:09.927  9301  9324 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-18 14:39:09.927  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1003ms lancio=1 x=330 page=157,151 loc=46,8 target=3034
10-18 14:39:09.940  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=330
10-18 14:39:09.940  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=13ms
10-18 14:39:10.007  9301  9324 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-18 14:39:10.007  9301  9324 I ReactNativeJS: VIBRA subtab comitive dopo=67ms
10-18 14:39:10.053  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=113ms
10-18 14:39:10.059  9301  9324 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=119ms
10-18 14:39:10.062  9301  9324 I ReactNativeJS: VIBRA subtab cambio comitive dopo=121ms
10-18 14:39:12.493  9792  9792 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-18 14:39:12.524  9301  9324 I ReactNativeJS: VIBRA subtab premuto growth dopo=2584ms
10-18 14:39:12.524  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1283ms lancio=0 x=250 page=362,151 loc=15,16 target=3060
10-18 14:39:12.525  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:12.770  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=480
10-18 14:39:12.770  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=480
10-18 14:39:12.778  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato growth
10-18 14:39:13.258  9301  9324 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3318ms
10-18 14:39:13.259  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=685ms lancio=0 x=480 page=376,151 loc=37,8 target=3082
10-18 14:39:13.259  9301  9324 I ReactNativeJS: VIBRA subtab mappa dopo=3319ms
10-18 14:39:13.260  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-18 14:39:13.303  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=43ms
10-18 14:39:13.314  9301  9324 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=55ms
10-18 14:39:13.315  9301  9324 I ReactNativeJS: VIBRA subtab cambio mappa dopo=55ms
10-18 14:39:13.503  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-18 14:39:16.067  9839  9839 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-18 14:39:16.169  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2909ms
10-18 14:39:16.169  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=3595ms lancio=0 x=480 page=49,151 loc=21,16 target=3048
10-18 14:39:16.699  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:39:16.699  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:16.699  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=480
10-18 14:39:16.699  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=480
10-18 14:39:17.459  9301  9324 I ReactNativeJS: VIBRA subtab premuto growth dopo=4200ms
10-18 14:39:17.460  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=4886ms lancio=0 x=480 page=157,151 loc=7,8 target=3058
10-18 14:39:17.461  9301  9324 I ReactNativeJS: VIBRA subtab growth dopo=4201ms
10-18 14:39:17.464  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-18 14:39:17.515  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=51ms
10-18 14:39:17.525  9301  9324 I ReactNativeJS: VIBRA subtab disegnata growth dopo=61ms
10-18 14:39:17.525  9301  9324 I ReactNativeJS: VIBRA subtab cambio growth dopo=61ms
10-18 14:39:20.133  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato growth
10-18 14:39:20.573  9861  9861 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-18 14:39:21.565  9301  9324 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4101ms
10-18 14:39:21.566  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=8992ms lancio=0 x=480 page=362,151 loc=24,8 target=3082
10-18 14:39:21.568  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:21.568  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=480
10-18 14:39:21.568  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=480
10-18 14:39:21.839  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-18 14:39:22.463  9301  9324 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4999ms
10-18 14:39:22.464  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=9890ms lancio=0 x=480 page=376,151 loc=37,8 target=3082
10-18 14:39:22.473  9301  9324 I ReactNativeJS: VIBRA subtab mappa dopo=5009ms
10-18 14:39:22.473  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=10ms
10-18 14:39:22.499  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=26ms
10-18 14:39:22.764  9301  9324 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=291ms
10-18 14:39:22.765  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-18 14:39:22.897  9301  9324 I ReactNativeJS: VIBRA subtab cambio mappa dopo=424ms
10-18 14:39:25.229  9906  9906 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-18 14:39:25.913  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3439ms
10-18 14:39:25.913  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=13339ms lancio=0 x=480 page=49,151 loc=21,16 target=3048
10-18 14:39:26.047  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:39:26.048  9301  9324 I ReactNativeJS: VIBRA subtab tabelle dopo=3574ms
10-18 14:39:26.048  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=135ms
10-18 14:39:26.116  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=68ms
10-18 14:39:26.386  9301  9324 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=338ms
10-18 14:39:27.192  9301  9324 I ReactNativeJS: VIBRA subtab premuto growth dopo=1144ms
10-18 14:39:27.192  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=14618ms lancio=0 x=480 page=157,151 loc=7,8 target=3058
10-18 14:39:27.192  9301  9324 I ReactNativeJS: VIBRA subtab growth dopo=1144ms
10-18 14:39:27.192  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:39:27.225  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=33ms
10-18 14:39:27.226  9301  9324 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=34ms
10-18 14:39:29.998  9927  9927 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-18 14:39:32.390  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=5198ms
10-18 14:39:32.413  9301  9324 I ReactNativeJS: VIBRA subtab disegnata growth dopo=5221ms
10-18 14:39:32.413  9301  9324 I ReactNativeJS: VIBRA subtab cambio growth dopo=5221ms
10-18 14:39:32.414  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato growth
10-18 14:39:32.415  9301  9324 I ReactNativeJS: VIBRA subtab premuto mappa dopo=5223ms
10-18 14:39:32.416  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=19841ms lancio=0 x=480 page=362,151 loc=24,8 target=3082
10-18 14:39:32.416  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:32.417  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=480
10-18 14:39:32.417  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=480
10-18 14:39:32.421  9301  9324 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-18 14:39:32.425  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=8ms lancio=0 x=480 page=376,151 loc=37,8 target=3082
10-18 14:39:32.426  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:39:33.903  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=1477ms
10-18 14:39:33.948  9301  9324 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=1522ms
10-18 14:39:34.078  9947  9947 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-18 14:39:34.785  9301  9324 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-18 14:39:34.785  9301  9324 I ReactNativeJS: VIBRA subtab mappa dopo=2359ms
10-18 14:39:34.785  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-18 14:39:34.785  9301  9324 I ReactNativeJS: VIBRA subtab disegnata growth dopo=2360ms
10-18 14:39:34.803  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2377ms
10-18 14:39:34.803  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=2386ms lancio=0 x=480 page=49,151 loc=21,16 target=3048
10-18 14:39:34.803  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:34.804  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=253
10-18 14:39:34.887  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=2462ms
10-18 14:39:35.707  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=435
10-18 14:39:35.708  9301  9324 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=3283ms
10-18 14:39:35.709  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:39:36.080  9301  9324 I ReactNativeJS: VIBRA subtab cambio mappa dopo=3654ms
10-18 14:39:36.522  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=4096ms
10-18 14:39:36.522  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=815ms lancio=0 x=435 page=157,151 loc=85,16 target=3048
10-18 14:39:36.529  9301  9324 I ReactNativeJS: VIBRA subtab tabelle dopo=4103ms
10-18 14:39:36.530  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=7ms
10-18 14:39:36.599  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=70ms
10-18 14:39:36.901  9301  9324 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=371ms
10-18 14:39:36.902  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:39:37.153  9301  9324 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=624ms
10-18 14:39:39.325  9992  9992 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-18 14:39:40.090  9301  9324 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-18 14:39:40.091  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1ms lancio=0 x=480 page=362,151 loc=24,8 target=3082
10-18 14:39:40.091  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-18 14:39:41.863  9301  9324 I ReactNativeJS: VIBRA subtab premuto mappa dopo=1772ms
10-18 14:39:41.864  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1774ms lancio=0 x=480 page=376,151 loc=37,8 target=3082
10-18 14:39:41.864  9301  9324 I ReactNativeJS: VIBRA subtab mappa dopo=1773ms
10-18 14:39:41.864  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-18 14:39:41.893  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=28ms
10-18 14:39:42.136  9301  9324 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=272ms
10-18 14:39:42.137  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-18 14:39:42.220  9301  9324 I ReactNativeJS: VIBRA subtab cambio mappa dopo=356ms
10-18 14:39:44.490 10036 10036 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-18 14:39:45.019  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3155ms
10-18 14:39:45.020  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1707ms lancio=0 x=480 page=49,151 loc=21,16 target=3048
10-18 14:39:45.024  9301  9324 I ReactNativeJS: VIBRA subtab tabelle dopo=3160ms
10-18 14:39:45.025  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=5ms
10-18 14:39:45.089  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=64ms
10-18 14:39:45.491  9301  9324 I ReactNativeJS: VIBRA subtab premuto growth dopo=466ms
10-18 14:39:45.493  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=2179ms lancio=0 x=480 page=157,151 loc=7,8 target=3058
10-18 14:39:45.494  9301  9324 I ReactNativeJS: VIBRA subtab growth dopo=469ms
10-18 14:39:45.494  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-18 14:39:45.636  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=142ms
10-18 14:39:45.638  9301  9324 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=144ms
10-18 14:39:45.638  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:39:46.023  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato growth
10-18 14:39:46.024  9301  9324 I ReactNativeJS: VIBRA subtab disegnata growth dopo=530ms
10-18 14:39:46.024  9301  9324 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=530ms
10-18 14:39:48.674 10059 10059 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-18 14:39:51.566  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=6072ms
10-18 14:39:51.585  9301  9324 I ReactNativeJS: VIBRA subtab cambio growth dopo=6091ms
10-18 14:39:51.588  9301  9324 I ReactNativeJS: VIBRA subtab premuto mappa dopo=6094ms
10-18 14:39:51.588  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=8274ms lancio=0 x=480 page=362,151 loc=24,8 target=3082
10-18 14:39:51.589  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:51.589  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=480
10-18 14:39:51.589  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=480
10-18 14:39:51.590  9301  9324 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-18 14:39:51.590  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=8276ms lancio=0 x=480 page=376,151 loc=37,8 target=3082
10-18 14:39:51.590  9301  9324 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-18 14:39:51.590  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:51.591  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=480
10-18 14:39:51.591  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=480
10-18 14:39:51.927 10079 10079 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-18 14:39:53.080  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=7586ms
10-18 14:39:53.125  9301  9324 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=7631ms
10-18 14:39:53.137  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=7643ms
10-18 14:39:53.137  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=9823ms lancio=0 x=480 page=49,151 loc=21,16 target=3048
10-18 14:39:53.137  9301  9324 I ReactNativeJS: VIBRA subtab tabelle dopo=7644ms
10-18 14:39:53.137  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:39:53.141  9301  9324 I ReactNativeJS: VIBRA subtab premuto growth dopo=4ms
10-18 14:39:53.141  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=9828ms lancio=0 x=480 page=157,151 loc=7,8 target=3058
10-18 14:39:53.141  9301  9324 I ReactNativeJS: VIBRA subtab growth dopo=4ms
10-18 14:39:53.142  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:39:53.819  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-18 14:39:53.819  9301  9324 I ReactNativeJS: VIBRA subtab disegnata growth dopo=677ms
10-18 14:39:54.375  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:39:54.375  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato growth
10-18 14:39:54.401  9301  9324 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=1260ms
10-18 14:39:54.402  9301  9324 I ReactNativeJS: VIBRA subtab cambio growth dopo=1261ms
10-18 14:39:55.870 10108 10108 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-18 14:39:55.957  9301  9324 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2815ms
10-18 14:39:55.957  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1280ms lancio=0 x=435 page=362,151 loc=11,16 target=3084
10-18 14:39:55.976  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:56.025  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=480
10-18 14:39:56.025  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=480
10-18 14:39:56.368  9301  9324 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-18 14:39:56.368  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=370ms lancio=0 x=480 page=376,151 loc=37,8 target=3082
10-18 14:39:56.369  9301  9324 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-18 14:39:56.369  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:56.369  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=480
10-18 14:39:56.369  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=480
10-18 14:39:56.370  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-18 14:39:58.935 10128 10128 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-18 14:39:58.957  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5815ms
10-18 14:39:58.957  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=2958ms lancio=0 x=480 page=49,151 loc=21,16 target=3048
10-18 14:39:58.974  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:39:59.313  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:39:59.522  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=202
10-18 14:40:00.128  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=202
10-18 14:40:00.129  9301  9324 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-18 14:40:00.129  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=816ms lancio=0 x=202 page=157,151 loc=5,8 target=3022
10-18 14:40:00.129  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:40:00.190  9301  9324 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-18 14:40:00.190  9301  9324 I ReactNativeJS: VIBRA subtab albero dopo=61ms
10-18 14:40:00.223  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=94ms
10-18 14:40:00.268  9301  9324 I ReactNativeJS: VIBRA subtab disegnata albero dopo=139ms
10-18 14:40:00.268  9301  9324 I ReactNativeJS: VIBRA subtab cambio albero dopo=139ms
10-18 14:40:02.665 10148 10148 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-18 14:40:02.691  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2562ms
10-18 14:40:02.691  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=2080ms lancio=0 x=157 page=362,151 loc=13,16 target=3048
10-18 14:40:02.692  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:40:02.854  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=443
10-18 14:40:02.855  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:40:03.158  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=443
10-18 14:40:03.308  9301  9324 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3179ms
10-18 14:40:03.310  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=455ms lancio=0 x=443 page=376,151 loc=1,8 target=3082
10-18 14:40:03.332  9301  9324 I ReactNativeJS: VIBRA subtab mappa dopo=3203ms
10-18 14:40:03.332  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=23ms
10-18 14:40:03.395  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=63ms
10-18 14:40:03.443  9301  9324 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=110ms
10-18 14:40:03.443  9301  9324 I ReactNativeJS: VIBRA subtab cambio mappa dopo=110ms
10-18 14:40:03.443  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-18 14:40:06.014 10194 10194 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-18 14:40:06.353  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3021ms
10-18 14:40:06.354  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=2136ms lancio=0 x=480 page=49,151 loc=21,16 target=3048
10-18 14:40:06.812  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:40:06.813  9301  9324 I ReactNativeJS: VIBRA subtab tabelle dopo=3481ms
10-18 14:40:06.814  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=460ms
10-18 14:40:06.857  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=44ms
10-18 14:40:07.171  9301  9324 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=357ms
10-18 14:40:07.560  9301  9324 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=746ms
10-18 14:40:10.400 10215 10215 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-18 14:40:13.226  9301  9324 I ReactNativeJS: VIBRA subtab premuto growth dopo=6412ms
10-18 14:40:13.226  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=9008ms lancio=0 x=480 page=157,151 loc=7,8 target=3058
10-18 14:40:13.229  9301  9324 I ReactNativeJS: VIBRA subtab growth dopo=6415ms
10-18 14:40:13.229  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=3ms
10-18 14:40:13.229  9301  9324 I ReactNativeJS: VIBRA subtab premuto mappa dopo=0ms
10-18 14:40:13.229  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=9012ms lancio=0 x=480 page=362,151 loc=24,8 target=3082
10-18 14:40:13.230  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:40:13.230  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=480
10-18 14:40:13.230  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=480
10-18 14:40:13.235  9301  9324 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-18 14:40:13.235  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=0ms lancio=0 x=480 page=376,151 loc=37,8 target=3082
10-18 14:40:13.235  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:40:13.272  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=36ms
10-18 14:40:13.655  9301  9324 I ReactNativeJS: VIBRA subtab disegnata growth dopo=420ms
10-18 14:40:13.657  9301  9324 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-18 14:40:13.657  9301  9324 I ReactNativeJS: VIBRA subtab mappa dopo=422ms
10-18 14:40:13.657  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato growth
10-18 14:40:13.658  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-18 14:40:13.771  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=535ms
10-18 14:40:14.087  9301  9324 I ReactNativeJS: VIBRA subtab cambio growth dopo=851ms
10-18 14:40:14.087  9301  9324 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=852ms
10-18 14:40:14.298 10236 10236 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-18 14:40:15.306  9301  9324 I ReactNativeJS: VIBRA subtab premuto albero dopo=2070ms
10-18 14:40:15.306  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1238ms lancio=0 x=344 page=49,151 loc=71,16 target=3024
10-18 14:40:15.306  9301  9324 I ReactNativeJS: VIBRA subtab albero dopo=2071ms
10-18 14:40:15.306  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:40:16.022  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=716ms
10-18 14:40:16.028  9301  9324 I ReactNativeJS: VIBRA subtab cambio mappa dopo=722ms
10-18 14:40:16.034  9301  9324 I ReactNativeJS: VIBRA subtab premuto comitive dopo=728ms
10-18 14:40:16.034  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1966ms lancio=0 x=344 page=157,151 loc=93,16 target=3036
10-18 14:40:16.034  9301  9324 I ReactNativeJS: VIBRA subtab comitive dopo=729ms
10-18 14:40:16.035  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:40:16.312  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=277ms
10-18 14:40:16.387  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato albero
10-18 14:40:16.400  9301  9324 I ReactNativeJS: VIBRA subtab disegnata growth dopo=365ms
10-18 14:40:16.568  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=533ms
10-18 14:40:16.584  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-18 14:40:16.588  9301  9324 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=554ms
10-18 14:40:16.710  9301  9324 I ReactNativeJS: VIBRA subtab cambio albero dopo=675ms
10-18 14:40:16.711  9301  9324 I ReactNativeJS: VIBRA subtab cambio comitive dopo=676ms
10-18 14:40:16.714  9301  9324 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=679ms
10-18 14:40:17.055  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=1021ms
10-18 14:40:17.181  9301  9324 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=1146ms
10-18 14:40:18.203 10281 10281 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-18 14:40:18.224  9301  9324 I ReactNativeJS: VIBRA subtab premuto growth dopo=2189ms
10-18 14:40:18.224  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=566ms lancio=0 x=250 page=362,151 loc=15,16 target=3060
10-18 14:40:18.241  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:40:18.538  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato growth
10-18 14:40:18.678  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=480
10-18 14:40:18.678  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=480
10-18 14:40:19.740  9301  9324 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3706ms
10-18 14:40:19.741  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1206ms lancio=0 x=480 page=376,151 loc=37,8 target=3082
10-18 14:40:19.741  9301  9324 I ReactNativeJS: VIBRA subtab mappa dopo=3706ms
10-18 14:40:19.741  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:40:19.760  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=19ms
10-18 14:40:19.774  9301  9324 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=33ms
10-18 14:40:19.775  9301  9324 I ReactNativeJS: VIBRA subtab cambio mappa dopo=34ms
10-18 14:40:19.947  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-18 14:40:22.648 10325 10325 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-18 14:40:22.885  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3144ms
10-18 14:40:22.885  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=4350ms lancio=0 x=480 page=49,151 loc=21,16 target=3048
10-18 14:40:22.885  9301  9324 I ReactNativeJS: VIBRA subtab tabelle dopo=3144ms
10-18 14:40:22.885  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:40:22.971  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=86ms
10-18 14:40:23.315  9301  9324 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=430ms
10-18 14:40:23.315  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:40:23.963  9301  9324 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=1078ms
10-18 14:40:27.796 10346 10346 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-18 14:40:29.148  9301  9324 I ReactNativeJS: VIBRA subtab premuto growth dopo=6263ms
10-18 14:40:29.149  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=10614ms lancio=0 x=480 page=157,151 loc=7,8 target=3058
10-18 14:40:29.151  9301  9324 I ReactNativeJS: VIBRA subtab growth dopo=6266ms
10-18 14:40:29.152  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=3ms
10-18 14:40:29.158  9301  9324 I ReactNativeJS: VIBRA subtab premuto mappa dopo=7ms
10-18 14:40:29.158  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=10624ms lancio=0 x=480 page=362,151 loc=24,8 target=3082
10-18 14:40:29.159  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:40:29.159  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=480
10-18 14:40:29.159  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=480
10-18 14:40:29.189  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=37ms
10-18 14:40:29.795  9301  9324 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-18 14:40:29.796  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=636ms lancio=0 x=480 page=376,151 loc=37,8 target=3082
10-18 14:40:29.797  9301  9324 I ReactNativeJS: VIBRA subtab disegnata growth dopo=646ms
10-18 14:40:29.797  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato growth
10-18 14:40:29.797  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-18 14:40:29.797  9301  9324 I ReactNativeJS: VIBRA subtab cambio growth dopo=646ms
10-18 14:40:31.033  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1237ms
10-18 14:40:32.942  9301  9324 I ReactNativeJS: VIBRA subtab premuto comitive dopo=1909ms
10-18 14:40:32.942  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=364ms lancio=0 x=435 page=49,151 loc=44,8 target=3034
10-18 14:40:32.964  9301  9324 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-18 14:40:33.187  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-18 14:40:33.565  9301  9324 I ReactNativeJS: VIBRA hscroll lancio x=275
10-18 14:40:33.990  9301  9324 I ReactNativeJS: VIBRA hscroll ferma x=275
10-18 14:40:36.661 10368 10368 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-18 14:40:36.707  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5675ms
10-18 14:40:36.707  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=3143ms lancio=0 x=275 page=265,151 loc=1,8 target=3046
10-18 14:40:36.708  9301  9324 I ReactNativeJS: VIBRA subtab tabelle dopo=5675ms
10-18 14:40:36.708  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-18 14:40:36.725  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=17ms
10-18 14:40:36.740  9301  9324 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=32ms
10-18 14:40:36.740  9301  9324 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=32ms
10-18 14:40:38.594  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:40:39.576  9301  9324 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2868ms
10-18 14:40:39.577  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=714ms lancio=0 x=344 page=157,151 loc=93,16 target=3036
10-18 14:40:39.577  9301  9324 I ReactNativeJS: VIBRA subtab comitive dopo=2869ms
10-18 14:40:39.577  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-18 14:40:39.632  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=54ms
10-18 14:40:39.672  9301  9324 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=95ms
10-18 14:40:39.672  9301  9324 I ReactNativeJS: VIBRA subtab cambio comitive dopo=95ms
10-18 14:40:40.174  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-18 14:40:42.190  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2613ms
10-18 14:40:42.190  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1664ms lancio=0 x=250 page=265,151 loc=8,16 target=3048
10-18 14:40:42.191  9301  9324 I ReactNativeJS: VIBRA subtab tabelle dopo=2613ms
10-18 14:40:42.191  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:40:42.211  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=20ms
10-18 14:40:42.224  9301  9324 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=33ms
10-18 14:40:42.224  9301  9324 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=33ms
10-18 14:40:43.600  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:40:45.221  9301  9324 I ReactNativeJS: VIBRA subtab premuto comitive dopo=3030ms
10-18 14:40:45.221  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=643ms lancio=0 x=344 page=157,151 loc=93,16 target=3036
10-18 14:40:45.221  9301  9324 I ReactNativeJS: VIBRA subtab comitive dopo=3031ms
10-18 14:40:45.221  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:40:45.270  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=49ms
10-18 14:40:45.275  9301  9324 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=53ms
10-18 14:40:45.275  9301  9324 I ReactNativeJS: VIBRA subtab cambio comitive dopo=54ms
10-18 14:40:45.535  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-18 14:40:47.807  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2586ms
10-18 14:40:47.808  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=1599ms lancio=0 x=250 page=265,151 loc=8,16 target=3048
10-18 14:40:47.824  9301  9324 I ReactNativeJS: VIBRA subtab tabelle dopo=2603ms
10-18 14:40:47.824  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=17ms
10-18 14:40:47.846  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=22ms
10-18 14:40:47.857  9301  9324 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=33ms
10-18 14:40:47.858  9301  9324 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=34ms
10-18 14:40:49.181  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:40:50.568  9301  9324 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2744ms
10-18 14:40:50.568  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=319ms lancio=0 x=344 page=157,151 loc=93,16 target=3036
10-18 14:40:50.634  9301  9324 I ReactNativeJS: VIBRA subtab comitive dopo=2810ms
10-18 14:40:50.634  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=66ms
10-18 14:40:50.707  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=73ms
10-18 14:40:51.281  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-18 14:40:51.281  9301  9324 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=648ms
10-18 14:40:51.282  9301  9324 I ReactNativeJS: VIBRA subtab cambio comitive dopo=648ms
10-18 14:40:53.224  9301  9324 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2590ms
10-18 14:40:53.224  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=909ms lancio=0 x=250 page=265,151 loc=8,16 target=3048
10-18 14:40:53.224  9301  9324 I ReactNativeJS: VIBRA subtab tabelle dopo=2590ms
10-18 14:40:53.224  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-18 14:40:53.240  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=16ms
10-18 14:40:53.257  9301  9324 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=33ms
10-18 14:40:53.257  9301  9324 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=33ms
10-18 14:40:54.493  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-18 14:40:56.008  9301  9324 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2784ms
10-18 14:40:56.009  9301  9324 I ReactNativeJS: VIBRA hscroll tocco dopo=501ms lancio=0 x=344 page=157,151 loc=93,16 target=3036
10-18 14:40:56.010  9301  9324 I ReactNativeJS: VIBRA subtab comitive dopo=2786ms
10-18 14:40:56.010  9301  9324 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-18 14:40:56.035  9301  9324 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=25ms
10-18 14:40:56.041  9301  9324 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=31ms
10-18 14:40:56.042  9301  9324 I ReactNativeJS: VIBRA subtab cambio comitive dopo=32ms
10-18 14:40:56.487  9301  9324 I ReactNativeJS: VIBRA subtab rilasciato comitive
```
