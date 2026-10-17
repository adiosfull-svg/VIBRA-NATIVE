# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x=997 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
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
| 0s | inizio | sì |
| 0s | fine | sì |
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

Tap arrivati: 21 su 24

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-17 15:48:56.080  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 15:48:56.080  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 15:48:56.945  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 15:48:56.945  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 15:49:24.895  9486  9509 I ReactNativeJS: VIBRA subtab premuto clienti
10-17 15:49:24.895  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,151 loc=28,16 target=6392
10-17 15:49:24.913  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:49:25.027  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 15:49:25.511  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 15:49:25.511  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 15:49:30.879  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=5332ms lancio=0 x=0 page=362,151 loc=9,8 target=6426
10-17 15:49:30.895  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:49:31.632  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=264
10-17 15:49:31.944  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=264
10-17 15:49:36.907  9762  9762 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 15:49:36.945  9486  9509 I ReactNativeJS: VIBRA subtab premuto parco
10-17 15:49:36.945  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=5313ms lancio=0 x=264 page=49,151 loc=119,16 target=6416
10-17 15:49:36.945  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:49:37.298  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 15:49:37.435  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 15:49:37.435  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 15:49:37.766  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:49:37.767  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=469ms lancio=0 x=0 page=157,151 loc=20,8 target=6402
10-17 15:49:37.794  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:49:37.810  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:49:37.811  9486  9509 I ReactNativeJS: VIBRA subtab gruppi
10-17 15:49:40.455  9783  9783 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 15:49:40.495  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=3198ms lancio=0 x=0 page=362,151 loc=9,8 target=6426
10-17 15:49:40.496  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:49:40.655  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=257
10-17 15:49:40.790  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:49:40.791  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=237ms lancio=1 x=257 page=380,151 loc=8,8 target=6462
10-17 15:49:40.791  9486  9509 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 15:49:40.792  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:49:40.936  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=257
10-17 15:49:41.012  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=257
10-17 15:49:43.517  9803  9803 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 15:49:43.544  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=2990ms lancio=0 x=257 page=49,151 loc=80,8 target=6414
10-17 15:49:43.562  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:49:43.713  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 15:49:43.713  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 15:49:43.988  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:49:43.994  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=365ms lancio=0 x=0 page=157,151 loc=20,8 target=6402
10-17 15:49:43.994  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:49:44.011  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:49:44.012  9486  9509 I ReactNativeJS: VIBRA subtab gruppi
10-17 15:49:46.582  9824  9824 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 15:49:46.610  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=2982ms lancio=0 x=0 page=362,151 loc=9,8 target=6426
10-17 15:49:46.628  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:49:46.801  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=272
10-17 15:49:47.086  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:49:47.087  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:49:47.091  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=5ms lancio=0 x=480 page=380,151 loc=74,16 target=6488
10-17 15:49:47.267  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:49:47.279  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:49:47.280  9486  9509 I ReactNativeJS: VIBRA subtab mappa
10-17 15:49:47.977  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:49:47.980  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:49:50.007  9954  9954 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 15:49:50.261  9486  9509 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:49:50.264  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=3177ms lancio=0 x=480 page=49,151 loc=9,7 target=6446
10-17 15:49:50.264  9486  9509 I ReactNativeJS: VIBRA subtab tabelle
10-17 15:49:50.273  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:49:50.624  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:49:51.208  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=4121ms lancio=0 x=480 page=157,151 loc=7,8 target=6462
10-17 15:49:51.211  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:49:54.003  9979  9979 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 15:49:56.430  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:49:56.432  9486  9509 I ReactNativeJS: VIBRA subtab growth
10-17 15:49:56.438  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=9352ms lancio=0 x=480 page=362,151 loc=24,8 target=6486
10-17 15:49:56.441  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:49:56.442  9486  9509 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:49:56.443  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=9356ms lancio=0 x=480 page=380,151 loc=74,16 target=6488
10-17 15:49:56.445  9486  9509 I ReactNativeJS: VIBRA subtab mappa
10-17 15:49:56.446  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:49:57.080  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:49:57.081  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:49:57.085  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:49:57.622 10005 10005 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 15:49:58.018  9486  9509 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:49:58.018  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=631ms lancio=0 x=480 page=49,151 loc=9,7 target=6446
10-17 15:49:58.534  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:49:58.536  9486  9509 I ReactNativeJS: VIBRA subtab tabelle
10-17 15:49:58.537  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:49:58.540  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:49:58.541  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:02.414 10048 10048 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 15:50:03.926  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=6539ms lancio=0 x=480 page=157,151 loc=7,8 target=6462
10-17 15:50:03.927  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:03.933  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=6546ms lancio=0 x=480 page=362,151 loc=24,8 target=6486
10-17 15:50:03.934  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:50:03.934  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:50:03.935  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:03.935  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:50:03.935  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=0ms lancio=0 x=480 page=380,151 loc=74,16 target=6488
10-17 15:50:03.935  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:04.791  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:50:04.794  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:04.796  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:50:04.796  9486  9509 I ReactNativeJS: VIBRA subtab growth
10-17 15:50:06.073 10069 10069 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 15:50:06.445  9486  9509 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:50:06.445  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=1598ms lancio=0 x=480 page=49,151 loc=9,7 target=6446
10-17 15:50:06.445  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:50:07.325  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=271
10-17 15:50:07.481  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:50:07.498  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 15:50:08.482  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 15:50:08.482  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 15:50:08.482  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:50:08.482  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=0ms lancio=0 x=435 page=157,151 loc=85,16 target=6452
10-17 15:50:08.482  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:08.989  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:50:08.989  9486  9509 I ReactNativeJS: VIBRA subtab gruppi
10-17 15:50:10.735 10092 10092 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 15:50:10.761  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=1933ms lancio=0 x=0 page=362,151 loc=9,8 target=6426
10-17 15:50:10.778  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:50:10.840  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=250
10-17 15:50:11.057  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:11.878  9486  9509 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:50:11.879  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=822ms lancio=0 x=480 page=380,151 loc=74,16 target=6488
10-17 15:50:11.881  9486  9509 I ReactNativeJS: VIBRA subtab mappa
10-17 15:50:11.881  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:12.105  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:50:12.120  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:50:12.120  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:14.823 10137 10137 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 15:50:14.971  9486  9509 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:50:14.978  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=3922ms lancio=0 x=480 page=49,151 loc=9,7 target=6446
10-17 15:50:14.979  9486  9509 I ReactNativeJS: VIBRA subtab tabelle
10-17 15:50:14.980  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:18.824  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:50:18.826  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=7769ms lancio=0 x=480 page=157,151 loc=7,8 target=6462
10-17 15:50:18.827  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:19.246  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:50:19.260  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:19.263  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:50:19.276  9486  9509 I ReactNativeJS: VIBRA subtab growth
10-17 15:50:19.504 10159 10159 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 15:50:19.866  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:50:19.866  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=8809ms lancio=0 x=480 page=362,151 loc=24,8 target=6486
10-17 15:50:19.866  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:21.599  9486  9509 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:50:21.600  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=1733ms lancio=0 x=480 page=380,151 loc=74,16 target=6488
10-17 15:50:21.600  9486  9509 I ReactNativeJS: VIBRA subtab mappa
10-17 15:50:21.600  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:22.255  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:50:22.256  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:22.261  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:50:22.975  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:50:22.977  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:24.181 10203 10203 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 15:50:24.572  9486  9509 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:50:24.573  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=2032ms lancio=0 x=480 page=49,151 loc=9,7 target=6446
10-17 15:50:24.692  9486  9509 I ReactNativeJS: VIBRA subtab tabelle
10-17 15:50:24.693  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:25.093  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=2552ms lancio=0 x=480 page=157,151 loc=7,8 target=6462
10-17 15:50:25.094  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:50:25.558  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:28.478 10224 10224 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 15:50:29.905  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:50:29.905  9486  9509 I ReactNativeJS: VIBRA subtab growth
10-17 15:50:29.908  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=7368ms lancio=0 x=480 page=362,151 loc=24,8 target=6486
10-17 15:50:29.909  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:50:29.909  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:50:29.909  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:29.909  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:50:29.909  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=0ms lancio=0 x=480 page=380,151 loc=74,16 target=6488
10-17 15:50:29.909  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:30.353  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:50:30.354  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:30.356  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:50:30.357  9486  9509 I ReactNativeJS: VIBRA subtab mappa
10-17 15:50:31.912 10245 10245 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 15:50:32.197  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:50:32.201  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=1585ms lancio=0 x=480 page=49,151 loc=9,7 target=6446
10-17 15:50:32.205  9486  9509 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 15:50:32.206  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:50:32.206  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=190
10-17 15:50:32.826  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:50:32.827  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=621ms lancio=1 x=190 page=157,151 loc=13,7 target=6422
10-17 15:50:32.827  9486  9509 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 15:50:32.828  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:50:32.836  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=190
10-17 15:50:33.253  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=190
10-17 15:50:33.442  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:35.727 10288 10288 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 15:50:36.062  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=2619ms lancio=0 x=480 page=362,151 loc=24,8 target=6486
10-17 15:50:36.196  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:36.633  9486  9509 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:50:36.633  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=3191ms lancio=0 x=480 page=380,151 loc=74,16 target=6488
10-17 15:50:36.650  9486  9509 I ReactNativeJS: VIBRA subtab mappa
10-17 15:50:36.650  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:36.779  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:50:39.482 10310 10310 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 15:50:39.571  9486  9509 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:50:39.572  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=6129ms lancio=0 x=480 page=49,151 loc=9,7 target=6446
10-17 15:50:39.572  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:50:39.847  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:50:40.047  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=350
10-17 15:50:40.838  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:50:40.838  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=992ms lancio=1 x=350 page=157,151 loc=490,20 target=6490
10-17 15:50:40.838  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:40.877  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=350
10-17 15:50:44.159 10330 10330 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 15:50:44.279  9486  9509 I ReactNativeJS: VIBRA subtab premuto analitica
10-17 15:50:44.282  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=4435ms lancio=0 x=350 page=362,151 loc=12,7 target=6470
10-17 15:50:44.308  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:50:44.790  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:50:44.790  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:44.791  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-17 15:50:45.444  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:50:45.444  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=654ms lancio=0 x=480 page=380,151 loc=74,16 target=6488
10-17 15:50:45.614  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:45.628  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:50:45.629  9486  9509 I ReactNativeJS: VIBRA subtab mappa
10-17 15:50:48.593 10350 10350 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 15:50:48.644  9486  9509 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:50:48.644  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=3854ms lancio=0 x=480 page=49,151 loc=9,7 target=6446
10-17 15:50:48.664  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:50:48.904  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=397
10-17 15:50:48.904  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:50:49.958  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:50:49.958  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=1054ms lancio=1 x=397 page=157,151 loc=14,8 target=6450
10-17 15:50:49.961  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=397
10-17 15:50:49.962  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:49.990  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:50:49.990  9486  9509 I ReactNativeJS: VIBRA subtab tabelle
10-17 15:50:52.990 10370 10370 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 15:50:54.490  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=5586ms lancio=0 x=397 page=362,151 loc=39,8 target=6474
10-17 15:50:54.491  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:50:54.491  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:50:54.491  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:55.128  9486  9509 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:50:55.129  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=638ms lancio=0 x=480 page=380,151 loc=74,16 target=6488
10-17 15:50:55.129  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:50:55.129  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:55.484  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:50:55.488  9486  9509 I ReactNativeJS: VIBRA subtab mappa
10-17 15:50:55.489  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:50:56.930  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:50:56.930  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:50:58.181 10420 10420 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 15:50:58.686  9486  9509 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:50:58.686  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=3195ms lancio=0 x=480 page=49,151 loc=9,7 target=6446
10-17 15:50:58.834  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:50:58.837  9486  9509 I ReactNativeJS: VIBRA subtab tabelle
10-17 15:50:58.838  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:51:03.122 10441 10441 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 15:51:04.042  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=8551ms lancio=0 x=480 page=157,151 loc=7,8 target=6462
10-17 15:51:04.042  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:51:04.046  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=8556ms lancio=0 x=480 page=362,151 loc=24,8 target=6486
10-17 15:51:04.047  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:51:04.047  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:51:04.047  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:51:04.213  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:51:04.216  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:51:04.217  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:51:04.224  9486  9509 I ReactNativeJS: VIBRA subtab growth
10-17 15:51:04.514  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:51:04.515  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=9025ms lancio=0 x=480 page=380,151 loc=74,16 target=6488
10-17 15:51:04.880  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:51:05.851  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:51:05.851  9486  9509 I ReactNativeJS: VIBRA subtab mappa
10-17 15:51:07.098  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:51:07.098  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:51:07.703 10485 10485 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 15:51:07.708  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:51:07.708  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:51:08.100  9486  9509 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 15:51:08.101  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=625ms lancio=0 x=480 page=49,151 loc=9,7 target=6446
10-17 15:51:08.102  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:51:09.820  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=2344ms lancio=0 x=480 page=157,151 loc=7,8 target=6462
10-17 15:51:10.207  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:51:10.593  9486  9509 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 15:51:10.593  9486  9509 I ReactNativeJS: VIBRA subtab growth
10-17 15:51:12.987 10509 10509 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 15:51:14.649  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=7173ms lancio=0 x=480 page=362,151 loc=24,8 target=6486
10-17 15:51:14.650  9486  9509 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:51:14.650  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:51:14.650  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:51:15.902  9486  9509 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:51:15.902  9486  9509 I ReactNativeJS: VIBRA hscroll tocco dopo=8426ms lancio=0 x=480 page=380,151 loc=74,16 target=6488
10-17 15:51:15.903  9486  9509 I ReactNativeJS: VIBRA subtab mappa
10-17 15:51:15.908  9486  9509 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:51:15.909  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:51:15.909  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 15:51:16.214  9486  9509 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:51:17.301  9486  9509 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 15:51:17.304  9486  9509 I ReactNativeJS: VIBRA hscroll ferma x=480
```
