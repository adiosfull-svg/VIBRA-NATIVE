# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x= (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | NO |
| 0.2s | inizio | sì |
| 0.4s | inizio | sì |
| 0.7s | inizio | sì |
| 1.0s | inizio | sì |
| 1.5s | inizio | sì |
| 0s | inizio | sì |
| 0.2s | inizio | sì |
| 0.4s | inizio | sì |
| 0.7s | inizio | sì |
| 1.0s | inizio | sì |
| 1.5s | inizio | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |

Tap arrivati: 19 su 20

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-17 21:38:13.678  9371  9397 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=754119ms
10-17 21:38:13.754  9371  9397 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=754195ms
10-17 21:38:17.083  9371  9397 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=757524ms
10-17 21:38:17.265  9371  9397 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=757706ms
10-17 21:38:23.730  9371  9397 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=764171ms
10-17 21:38:24.049  9371  9397 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=764490ms
10-17 21:38:45.139  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=785580ms
10-17 21:38:45.139  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,151 loc=28,16 target=16968
10-17 21:38:45.174  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:38:45.274  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:38:45.755  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:38:45.755  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:38:51.205  9371  9397 I ReactNativeJS: VIBRA subtab premuto albero dopo=791646ms
10-17 21:38:51.205  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=5433ms lancio=0 x=0 page=362,151 loc=9,8 target=17002
10-17 21:38:51.241  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:38:51.563  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 21:38:51.951  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=171
10-17 21:38:52.055  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=171
10-17 21:38:57.404  9629  9629 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 21:38:57.422  9371  9397 I ReactNativeJS: VIBRA subtab premuto parco dopo=797863ms
10-17 21:38:57.422  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=5564ms lancio=0 x=171 page=49,151 loc=27,16 target=16992
10-17 21:38:57.457  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:38:57.498  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=14
10-17 21:38:57.706  9371  9397 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 21:38:57.709  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=211ms lancio=1 x=14 page=157,151 loc=34,8 target=16978
10-17 21:38:57.710  9371  9397 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 21:38:57.710  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:38:57.710  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=14
10-17 21:38:57.711  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 21:38:58.261  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=14
10-17 21:39:00.265  9649  9649 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 21:39:00.288  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=800729ms
10-17 21:39:00.288  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=2790ms lancio=0 x=14 page=49,151 loc=10,8 target=16966
10-17 21:39:00.306  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:39:00.372  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:39:00.372  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:39:00.550  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:39:00.883  9371  9397 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 21:39:00.883  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=334ms lancio=0 x=0 page=157,151 loc=20,8 target=16978
10-17 21:39:01.023  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=139ms
10-17 21:39:01.088  9371  9397 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 21:39:01.088  9371  9397 I ReactNativeJS: VIBRA subtab gruppi dopo=66ms
10-17 21:39:01.121  9371  9397 I ReactNativeJS: VIBRA subtab evidenziata gruppi dopo=98ms
10-17 21:39:01.131  9371  9397 I ReactNativeJS: VIBRA subtab disegnata gruppi dopo=108ms
10-17 21:39:01.131  9371  9397 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=109ms
10-17 21:39:03.581  9670  9670 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 21:39:03.606  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=2583ms
10-17 21:39:03.606  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=3057ms lancio=0 x=0 page=49,151 loc=28,16 target=16968
10-17 21:39:03.607  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:39:03.693  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:39:03.693  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:39:03.761  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:39:04.106  9371  9397 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=3084ms
10-17 21:39:04.106  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=413ms lancio=0 x=0 page=157,151 loc=20,8 target=16978
10-17 21:39:04.123  9371  9397 I ReactNativeJS: VIBRA subtab gruppi dopo=3101ms
10-17 21:39:04.123  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=17ms
10-17 21:39:04.172  9371  9397 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=48ms
10-17 21:39:04.243  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 21:39:06.680  9693  9693 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 21:39:06.706  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=2582ms
10-17 21:39:06.706  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=3012ms lancio=0 x=0 page=49,151 loc=28,16 target=16968
10-17 21:39:06.725  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:39:06.789  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:39:06.789  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:39:06.862  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:39:07.505  9371  9397 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=3382ms
10-17 21:39:07.505  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=651ms lancio=0 x=0 page=157,151 loc=20,8 target=16978
10-17 21:39:07.505  9371  9397 I ReactNativeJS: VIBRA subtab gruppi dopo=3382ms
10-17 21:39:07.505  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:07.539  9371  9397 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=34ms
10-17 21:39:07.638  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 21:39:10.056  9714  9714 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 21:39:10.089  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=2584ms
10-17 21:39:10.090  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=3236ms lancio=0 x=0 page=49,151 loc=28,16 target=16968
10-17 21:39:10.090  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:39:10.167  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:39:10.167  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:39:10.242  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:39:11.188  9371  9397 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=3683ms
10-17 21:39:11.188  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=4335ms lancio=0 x=0 page=157,151 loc=20,8 target=16978
10-17 21:39:11.189  9371  9397 I ReactNativeJS: VIBRA subtab gruppi dopo=3683ms
10-17 21:39:11.189  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:11.222  9371  9397 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=33ms
10-17 21:39:11.321  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 21:39:13.737  9736  9736 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 21:39:13.755  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=2567ms
10-17 21:39:13.755  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=6902ms lancio=0 x=0 page=49,151 loc=28,16 target=16968
10-17 21:39:13.790  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:39:13.839  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:39:13.839  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:39:13.924  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:39:15.355  9371  9397 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=4166ms
10-17 21:39:15.355  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=1516ms lancio=0 x=0 page=157,151 loc=20,8 target=16978
10-17 21:39:15.356  9371  9397 I ReactNativeJS: VIBRA subtab gruppi dopo=4167ms
10-17 21:39:15.356  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:15.388  9371  9397 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=33ms
10-17 21:39:15.488  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 21:39:17.908  9757  9757 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 21:39:17.939  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=2583ms
10-17 21:39:17.939  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=4100ms lancio=0 x=0 page=49,151 loc=28,16 target=16968
10-17 21:39:17.940  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:39:18.022  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:39:18.022  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:39:18.103  9371  9397 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 21:39:18.103  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=81ms lancio=0 x=0 page=157,151 loc=20,8 target=16978
10-17 21:39:18.104  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:18.104  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:39:18.235  9371  9397 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 21:39:18.235  9371  9397 I ReactNativeJS: VIBRA subtab gruppi dopo=131ms
10-17 21:39:18.272  9371  9397 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=168ms
10-17 21:39:20.666  9777  9777 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 21:39:20.688  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=2585ms
10-17 21:39:20.688  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=2666ms lancio=0 x=0 page=49,151 loc=28,16 target=16968
10-17 21:39:20.707  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:39:20.780  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:39:20.780  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:39:20.844  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:39:21.007  9371  9397 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 21:39:21.008  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=228ms lancio=0 x=0 page=157,151 loc=20,8 target=16978
10-17 21:39:21.008  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:21.071  9371  9397 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 21:39:21.072  9371  9397 I ReactNativeJS: VIBRA subtab gruppi dopo=64ms
10-17 21:39:21.121  9371  9397 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=114ms
10-17 21:39:23.565  9798  9798 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 21:39:23.588  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=2581ms
10-17 21:39:23.589  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=2809ms lancio=0 x=0 page=49,151 loc=28,16 target=16968
10-17 21:39:23.607  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:39:23.674  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:39:23.674  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:39:23.740  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:39:24.090  9371  9397 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=3082ms
10-17 21:39:24.090  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=415ms lancio=0 x=0 page=157,151 loc=20,8 target=16978
10-17 21:39:24.090  9371  9397 I ReactNativeJS: VIBRA subtab gruppi dopo=3083ms
10-17 21:39:24.090  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:24.158  9371  9397 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=67ms
10-17 21:39:24.222  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 21:39:26.653  9819  9819 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 21:39:26.672  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=2581ms
10-17 21:39:26.672  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=2997ms lancio=0 x=0 page=49,151 loc=28,16 target=16968
10-17 21:39:26.708  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:39:26.825  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:39:26.825  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:39:26.839  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:39:27.472  9371  9397 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=3381ms
10-17 21:39:27.472  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=640ms lancio=0 x=0 page=157,151 loc=20,8 target=16978
10-17 21:39:27.472  9371  9397 I ReactNativeJS: VIBRA subtab gruppi dopo=3382ms
10-17 21:39:27.472  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:27.505  9371  9397 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=33ms
10-17 21:39:27.609  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 21:39:30.022  9840  9840 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 21:39:30.056  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=2584ms
10-17 21:39:30.056  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=3224ms lancio=0 x=0 page=49,151 loc=28,16 target=16968
10-17 21:39:30.075  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:39:30.237  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:39:30.237  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:39:30.238  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:39:31.155  9371  9397 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=3683ms
10-17 21:39:31.155  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=917ms lancio=0 x=0 page=157,151 loc=20,8 target=16978
10-17 21:39:31.156  9371  9397 I ReactNativeJS: VIBRA subtab gruppi dopo=3684ms
10-17 21:39:31.156  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-17 21:39:31.189  9371  9397 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=33ms
10-17 21:39:31.288  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 21:39:33.711  9861  9861 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 21:39:33.739  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=2583ms
10-17 21:39:33.739  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=3501ms lancio=0 x=0 page=49,151 loc=28,16 target=16968
10-17 21:39:33.756  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:39:33.889  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:39:33.889  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:39:33.890  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:39:35.338  9371  9397 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=4182ms
10-17 21:39:35.338  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=1449ms lancio=0 x=0 page=157,151 loc=20,8 target=16978
10-17 21:39:35.339  9371  9397 I ReactNativeJS: VIBRA subtab gruppi dopo=4183ms
10-17 21:39:35.339  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:35.371  9371  9397 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=33ms
10-17 21:39:35.471  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 21:39:37.872  9371  9397 I ReactNativeJS: VIBRA subtab premuto clienti dopo=2534ms
10-17 21:39:37.872  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=3983ms lancio=0 x=0 page=49,151 loc=28,16 target=16968
10-17 21:39:37.908  9371  9397 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 21:39:38.005  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 21:39:38.488  9371  9397 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 21:39:38.488  9371  9397 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 21:39:41.489  9882  9882 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-17 21:39:41.538  9371  9397 I ReactNativeJS: VIBRA subtab premuto parco dopo=6199ms
10-17 21:39:41.538  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=3033ms lancio=0 x=0 page=265,151 loc=40,8 target=16990
10-17 21:39:41.539  9371  9397 I ReactNativeJS: VIBRA subtab parco dopo=6200ms
10-17 21:39:41.539  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:41.556  9371  9397 I ReactNativeJS: VIBRA subtab evidenziata parco dopo=17ms
10-17 21:39:41.572  9371  9397 I ReactNativeJS: VIBRA subtab disegnata parco dopo=33ms
10-17 21:39:41.572  9371  9397 I ReactNativeJS: VIBRA subtab cambio parco dopo=33ms
10-17 21:39:41.746  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 21:39:44.105  9371  9397 I ReactNativeJS: VIBRA subtab premuto parco dopo=2566ms
10-17 21:39:44.105  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=1952ms lancio=0 x=50 page=157,151 loc=14,16 target=16992
10-17 21:39:44.105  9371  9397 I ReactNativeJS: VIBRA subtab parco dopo=2566ms
10-17 21:39:44.105  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:44.138  9371  9397 I ReactNativeJS: VIBRA subtab cambio parco dopo=33ms
10-17 21:39:44.238  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 21:39:46.672  9371  9397 I ReactNativeJS: VIBRA subtab premuto parco dopo=2566ms
10-17 21:39:46.672  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=4519ms lancio=0 x=50 page=265,151 loc=122,16 target=16992
10-17 21:39:46.672  9371  9397 I ReactNativeJS: VIBRA subtab parco dopo=2567ms
10-17 21:39:46.672  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:46.707  9371  9397 I ReactNativeJS: VIBRA subtab cambio parco dopo=35ms
10-17 21:39:46.808  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 21:39:49.238  9371  9397 I ReactNativeJS: VIBRA subtab premuto parco dopo=2566ms
10-17 21:39:49.239  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=7085ms lancio=0 x=50 page=157,151 loc=14,16 target=16992
10-17 21:39:49.239  9371  9397 I ReactNativeJS: VIBRA subtab parco dopo=2567ms
10-17 21:39:49.239  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-17 21:39:49.276  9371  9397 I ReactNativeJS: VIBRA subtab cambio parco dopo=37ms
10-17 21:39:49.371  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 21:39:51.788  9371  9397 I ReactNativeJS: VIBRA subtab premuto parco dopo=2549ms
10-17 21:39:51.788  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=9635ms lancio=0 x=50 page=265,151 loc=122,16 target=16992
10-17 21:39:51.789  9371  9397 I ReactNativeJS: VIBRA subtab parco dopo=2549ms
10-17 21:39:51.789  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:51.822  9371  9397 I ReactNativeJS: VIBRA subtab cambio parco dopo=34ms
10-17 21:39:51.921  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 21:39:54.356  9371  9397 I ReactNativeJS: VIBRA subtab premuto parco dopo=2567ms
10-17 21:39:54.356  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=12203ms lancio=0 x=50 page=157,151 loc=14,16 target=16992
10-17 21:39:54.372  9371  9397 I ReactNativeJS: VIBRA subtab parco dopo=2583ms
10-17 21:39:54.372  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=16ms
10-17 21:39:54.422  9371  9397 I ReactNativeJS: VIBRA subtab cambio parco dopo=50ms
10-17 21:39:54.492  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 21:39:56.922  9371  9397 I ReactNativeJS: VIBRA subtab premuto parco dopo=2550ms
10-17 21:39:56.922  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=14769ms lancio=0 x=50 page=265,151 loc=122,16 target=16992
10-17 21:39:56.922  9371  9397 I ReactNativeJS: VIBRA subtab parco dopo=2550ms
10-17 21:39:56.922  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:56.955  9371  9397 I ReactNativeJS: VIBRA subtab cambio parco dopo=33ms
10-17 21:39:57.073  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 21:39:59.488  9371  9397 I ReactNativeJS: VIBRA subtab premuto parco dopo=2566ms
10-17 21:39:59.488  9371  9397 I ReactNativeJS: VIBRA hscroll tocco dopo=17335ms lancio=0 x=50 page=157,151 loc=14,16 target=16992
10-17 21:39:59.489  9371  9397 I ReactNativeJS: VIBRA subtab parco dopo=2567ms
10-17 21:39:59.489  9371  9397 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 21:39:59.521  9371  9397 I ReactNativeJS: VIBRA subtab cambio parco dopo=33ms
10-17 21:39:59.622  9371  9397 I ReactNativeJS: VIBRA subtab rilasciato parco
```
