# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x=1023 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | sì |
| 0s | fine | sì |
| 0.2s | inizio | sì |
| 0.2s | fine | sì |
| 0.4s | inizio | sì |
| 0.4s | fine | sì |
| 0.7s | inizio | NO |
| 0.7s | fine | sì |
| 1.0s | inizio | sì |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |
| 0s | inizio | sì |
| 0s | fine | sì |
| 0.2s | inizio | sì |
| 0.2s | fine | NO |
| 0.4s | inizio | NO |
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
10-19 15:31:00.242  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=753713ms
10-19 15:31:00.281  9401  9425 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=753752ms
10-19 15:31:03.081  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=756552ms
10-19 15:31:03.849  9401  9425 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=757321ms
10-19 15:31:08.002  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=761473ms
10-19 15:31:08.431  9401  9425 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=761903ms
10-19 15:31:31.386  9401  9425 I ReactNativeJS: VIBRA subtab premuto clienti dopo=784858ms
10-19 15:31:31.387  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,151 loc=28,16 target=7064
10-19 15:31:31.423  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:31:31.519  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-19 15:31:32.001  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=0
10-19 15:31:32.001  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=0
10-19 15:31:37.485  9401  9425 I ReactNativeJS: VIBRA subtab premuto albero dopo=790957ms
10-19 15:31:37.485  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=5467ms lancio=0 x=0 page=362,151 loc=9,8 target=7098
10-19 15:31:37.520  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:31:37.855  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato albero
10-19 15:31:38.460  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=244
10-19 15:31:38.553  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=244
10-19 15:31:43.922  9663  9663 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-19 15:31:43.953  9401  9425 I ReactNativeJS: VIBRA subtab premuto parco dopo=797424ms
10-19 15:31:43.953  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=5607ms lancio=0 x=244 page=49,151 loc=67,8 target=7086
10-19 15:31:43.953  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:31:44.337  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato parco
10-19 15:31:44.506  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=0
10-19 15:31:44.510  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=0
10-19 15:31:44.884  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:31:44.884  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=547ms lancio=0 x=0 page=157,151 loc=20,8 target=7074
10-19 15:31:44.904  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=19ms
10-19 15:31:45.035  9401  9425 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 15:31:45.035  9401  9425 I ReactNativeJS: VIBRA subtab gruppi dopo=131ms
10-19 15:31:45.053  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata gruppi dopo=150ms
10-19 15:31:45.072  9401  9425 I ReactNativeJS: VIBRA subtab disegnata gruppi dopo=168ms
10-19 15:31:45.072  9401  9425 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=168ms
10-19 15:31:47.462  9684  9684 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-19 15:31:47.485  9401  9425 I ReactNativeJS: VIBRA subtab premuto albero dopo=2581ms
10-19 15:31:47.485  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=3148ms lancio=0 x=0 page=362,151 loc=9,8 target=7098
10-19 15:31:47.503  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:31:47.670  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato albero
10-19 15:31:47.812  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=254
10-19 15:31:47.968  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:31:47.968  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=298ms lancio=1 x=254 page=390,151 loc=15,8 target=7134
10-19 15:31:47.972  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-19 15:31:48.038  9401  9425 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 15:31:48.038  9401  9425 I ReactNativeJS: VIBRA subtab growth dopo=66ms
10-19 15:31:48.081  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=109ms
10-19 15:31:48.081  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=254
10-19 15:31:48.093  9401  9425 I ReactNativeJS: VIBRA subtab disegnata growth dopo=121ms
10-19 15:31:48.104  9401  9425 I ReactNativeJS: VIBRA subtab cambio growth dopo=132ms
10-19 15:31:50.964  9705  9705 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-19 15:31:51.018  9401  9425 I ReactNativeJS: VIBRA subtab premuto comitive dopo=3047ms
10-19 15:31:51.019  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=840ms lancio=0 x=435 page=49,151 loc=44,8 target=7110
10-19 15:31:51.038  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:31:51.239  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=256
10-19 15:31:51.243  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 15:31:51.964  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:31:51.965  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=726ms lancio=1 x=256 page=157,151 loc=4,16 target=7112
10-19 15:31:51.975  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=10ms
10-19 15:31:52.003  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=256
10-19 15:31:52.035  9401  9425 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 15:31:52.035  9401  9425 I ReactNativeJS: VIBRA subtab comitive dopo=60ms
10-19 15:31:52.070  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=95ms
10-19 15:31:52.088  9401  9425 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=113ms
10-19 15:31:52.088  9401  9425 I ReactNativeJS: VIBRA subtab cambio comitive dopo=113ms
10-19 15:31:54.541  9725  9725 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-19 15:31:54.568  9401  9425 I ReactNativeJS: VIBRA subtab premuto growth dopo=2593ms
10-19 15:31:54.568  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1670ms lancio=0 x=250 page=362,151 loc=15,16 target=7136
10-19 15:31:54.586  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:31:54.846  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 15:31:55.082  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 15:31:55.082  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 15:31:55.352  9401  9425 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3377ms
10-19 15:31:55.352  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=506ms lancio=0 x=480 page=390,151 loc=84,16 target=7160
10-19 15:31:55.353  9401  9425 I ReactNativeJS: VIBRA subtab mappa dopo=3378ms
10-19 15:31:55.353  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 15:31:55.390  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=38ms
10-19 15:31:55.407  9401  9425 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=54ms
10-19 15:31:55.407  9401  9425 I ReactNativeJS: VIBRA subtab cambio mappa dopo=54ms
10-19 15:31:55.712  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 15:31:58.022  9858  9858 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-19 15:31:58.138  9401  9425 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2785ms
10-19 15:31:58.138  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=3292ms lancio=0 x=480 page=49,151 loc=21,16 target=7124
10-19 15:31:58.624  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 15:31:58.624  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:31:58.978  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 15:31:58.978  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 15:31:59.604  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:31:59.608  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=4762ms lancio=0 x=480 page=157,151 loc=7,8 target=7134
10-19 15:31:59.609  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 15:32:00.014  9401  9425 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 15:32:00.014  9401  9425 I ReactNativeJS: VIBRA subtab growth dopo=405ms
10-19 15:32:00.036  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=428ms
10-19 15:32:00.060  9401  9425 I ReactNativeJS: VIBRA subtab disegnata growth dopo=452ms
10-19 15:32:00.064  9401  9425 I ReactNativeJS: VIBRA subtab cambio growth dopo=456ms
10-19 15:32:02.354  9881  9881 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-19 15:32:03.203  9401  9425 I ReactNativeJS: VIBRA subtab premuto mappa dopo=3594ms
10-19 15:32:03.204  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=8358ms lancio=0 x=480 page=362,151 loc=24,8 target=7158
10-19 15:32:03.204  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:03.205  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 15:32:03.205  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 15:32:03.856  9401  9425 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4247ms
10-19 15:32:03.868  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=9022ms lancio=0 x=480 page=390,151 loc=84,16 target=7160
10-19 15:32:03.875  9401  9425 I ReactNativeJS: VIBRA subtab mappa dopo=4266ms
10-19 15:32:03.875  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=7ms
10-19 15:32:04.571  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=696ms
10-19 15:32:04.611  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 15:32:04.611  9401  9425 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=736ms
10-19 15:32:05.144  9401  9425 I ReactNativeJS: VIBRA subtab cambio mappa dopo=1269ms
10-19 15:32:06.767  9926  9926 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-19 15:32:06.844  9401  9425 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2969ms
10-19 15:32:06.845  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=861ms lancio=0 x=480 page=49,151 loc=21,16 target=7124
10-19 15:32:06.846  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:07.025  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=349
10-19 15:32:07.217  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 15:32:07.538  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=349
10-19 15:32:08.180  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1155ms lancio=0 x=349 page=157,151 loc=490,20 target=7162
10-19 15:32:08.565  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=386ms
10-19 15:32:11.460  9947  9947 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-19 15:32:11.502  9401  9425 I ReactNativeJS: VIBRA subtab premuto analitica dopo=2937ms
10-19 15:32:11.503  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=4478ms lancio=0 x=349 page=362,151 loc=24,16 target=7148
10-19 15:32:11.521  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:11.954  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-19 15:32:12.264  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=464
10-19 15:32:13.155  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:32:13.155  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1201ms lancio=1 x=464 page=390,151 loc=35,8 target=7158
10-19 15:32:13.155  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 15:32:13.155  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=464
10-19 15:32:13.355  9401  9425 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 15:32:13.355  9401  9425 I ReactNativeJS: VIBRA subtab mappa dopo=200ms
10-19 15:32:13.401  9401  9425 I ReactNativeJS: VIBRA subtab cambio mappa dopo=246ms
10-19 15:32:15.954  9968  9968 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-19 15:32:16.268  9401  9425 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3113ms
10-19 15:32:16.269  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=4315ms lancio=0 x=464 page=49,151 loc=5,16 target=7124
10-19 15:32:16.269  9401  9425 I ReactNativeJS: VIBRA subtab tabelle dopo=3114ms
10-19 15:32:16.280  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=11ms
10-19 15:32:16.313  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=33ms
10-19 15:32:16.323  9401  9425 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=43ms
10-19 15:32:16.324  9401  9425 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=44ms
10-19 15:32:20.169  9990  9990 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-19 15:32:21.195  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 15:32:21.201  9401  9425 I ReactNativeJS: VIBRA subtab premuto growth dopo=4921ms
10-19 15:32:21.201  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=9247ms lancio=0 x=464 page=157,151 loc=23,16 target=7136
10-19 15:32:21.202  9401  9425 I ReactNativeJS: VIBRA subtab growth dopo=4922ms
10-19 15:32:21.202  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 15:32:21.207  9401  9425 I ReactNativeJS: VIBRA subtab premuto mappa dopo=5ms
10-19 15:32:21.207  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=9253ms lancio=0 x=464 page=362,151 loc=7,8 target=7158
10-19 15:32:21.208  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:21.208  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 15:32:21.208  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 15:32:21.229  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=27ms
10-19 15:32:21.961  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:32:21.962  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=754ms lancio=0 x=480 page=390,151 loc=84,16 target=7160
10-19 15:32:21.963  9401  9425 I ReactNativeJS: VIBRA subtab disegnata growth dopo=762ms
10-19 15:32:21.964  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 15:32:21.964  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 15:32:21.965  9401  9425 I ReactNativeJS: VIBRA subtab cambio growth dopo=763ms
10-19 15:32:23.145  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1183ms
10-19 15:32:25.272 10011 10011 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-19 15:32:25.369  9401  9425 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2224ms
10-19 15:32:25.369  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=564ms lancio=0 x=435 page=49,151 loc=44,8 target=7110
10-19 15:32:25.370  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:25.828  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 15:32:25.931  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=132
10-19 15:32:26.218  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=132
10-19 15:32:27.502  9401  9425 I ReactNativeJS: VIBRA subtab premuto parco dopo=4357ms
10-19 15:32:27.502  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1674ms lancio=0 x=132 page=157,151 loc=64,8 target=7086
10-19 15:32:27.502  9401  9425 I ReactNativeJS: VIBRA subtab parco dopo=4357ms
10-19 15:32:27.502  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 15:32:27.516  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata parco dopo=14ms
10-19 15:32:27.518  9401  9425 I ReactNativeJS: VIBRA subtab disegnata parco dopo=16ms
10-19 15:32:27.535  9401  9425 I ReactNativeJS: VIBRA subtab cambio parco dopo=33ms
10-19 15:32:27.735  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato parco
10-19 15:32:30.061 10033 10033 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-19 15:32:30.085  9401  9425 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2583ms
10-19 15:32:30.085  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=2099ms lancio=0 x=50 page=362,151 loc=5,16 target=7112
10-19 15:32:30.103  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:30.298  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=319
10-19 15:32:30.298  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 15:32:30.639  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=319
10-19 15:32:31.852  9401  9425 I ReactNativeJS: VIBRA subtab premuto analitica dopo=4350ms
10-19 15:32:31.852  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1554ms lancio=0 x=319 page=390,151 loc=21,16 target=7148
10-19 15:32:31.852  9401  9425 I ReactNativeJS: VIBRA subtab analitica dopo=4350ms
10-19 15:32:31.852  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 15:32:31.867  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata analitica dopo=15ms
10-19 15:32:31.885  9401  9425 I ReactNativeJS: VIBRA subtab disegnata analitica dopo=33ms
10-19 15:32:31.885  9401  9425 I ReactNativeJS: VIBRA subtab cambio analitica dopo=33ms
10-19 15:32:32.438  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-19 15:32:34.413 10056 10056 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-19 15:32:34.436  9401  9425 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2584ms
10-19 15:32:34.436  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1379ms lancio=0 x=480 page=49,151 loc=21,16 target=7124
10-19 15:32:34.453  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:34.767  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 15:32:34.944  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=219
10-19 15:32:35.075  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:32:35.075  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=308ms lancio=1 x=219 page=157,151 loc=23,8 target=7098
10-19 15:32:35.075  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 15:32:35.135  9401  9425 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 15:32:35.136  9401  9425 I ReactNativeJS: VIBRA subtab albero dopo=60ms
10-19 15:32:35.171  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata albero dopo=96ms
10-19 15:32:35.172  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=219
10-19 15:32:35.189  9401  9425 I ReactNativeJS: VIBRA subtab disegnata albero dopo=114ms
10-19 15:32:35.190  9401  9425 I ReactNativeJS: VIBRA subtab cambio albero dopo=114ms
10-19 15:32:37.712 10076 10076 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-19 15:32:37.735  9401  9425 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2659ms
10-19 15:32:37.735  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1781ms lancio=0 x=157 page=362,151 loc=13,16 target=7124
10-19 15:32:37.753  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:37.935  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 15:32:38.062  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=422
10-19 15:32:38.217  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:32:38.217  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=283ms lancio=1 x=422 page=390,151 loc=26,16 target=7160
10-19 15:32:38.238  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=20ms
10-19 15:32:38.301  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=422
10-19 15:32:38.302  9401  9425 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 15:32:38.302  9401  9425 I ReactNativeJS: VIBRA subtab mappa dopo=65ms
10-19 15:32:38.325  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=87ms
10-19 15:32:38.337  9401  9425 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=99ms
10-19 15:32:38.337  9401  9425 I ReactNativeJS: VIBRA subtab cambio mappa dopo=100ms
10-19 15:32:41.365 10119 10119 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-19 15:32:41.630  9401  9425 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=3393ms
10-19 15:32:41.631  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=2476ms lancio=0 x=480 page=49,151 loc=21,16 target=7124
10-19 15:32:41.973  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 15:32:41.974  9401  9425 I ReactNativeJS: VIBRA subtab tabelle dopo=3736ms
10-19 15:32:41.974  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=343ms
10-19 15:32:42.009  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=35ms
10-19 15:32:42.481  9401  9425 I ReactNativeJS: VIBRA subtab premuto growth dopo=507ms
10-19 15:32:42.482  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=3326ms lancio=0 x=480 page=157,151 loc=7,8 target=7134
10-19 15:32:42.493  9401  9425 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=519ms
10-19 15:32:42.841  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 15:32:42.841  9401  9425 I ReactNativeJS: VIBRA subtab growth dopo=867ms
10-19 15:32:42.841  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=360ms
10-19 15:32:42.903  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=62ms
10-19 15:32:42.904  9401  9425 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=63ms
10-19 15:32:45.652 10142 10142 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-19 15:32:47.282  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=4441ms
10-19 15:32:47.303  9401  9425 I ReactNativeJS: VIBRA subtab disegnata growth dopo=4461ms
10-19 15:32:47.310  9401  9425 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4468ms
10-19 15:32:47.312  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=8157ms lancio=0 x=480 page=362,151 loc=24,8 target=7158
10-19 15:32:47.313  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:47.313  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 15:32:47.313  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 15:32:47.314  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:32:47.314  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=8159ms lancio=0 x=480 page=390,151 loc=84,16 target=7160
10-19 15:32:47.314  9401  9425 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-19 15:32:47.314  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:47.314  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 15:32:47.315  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 15:32:47.328  9401  9425 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=4486ms
10-19 15:32:47.899  9401  9425 I ReactNativeJS: VIBRA subtab cambio growth dopo=5057ms
10-19 15:32:49.106 10162 10162 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-19 15:32:49.217  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=6375ms
10-19 15:32:49.271  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 15:32:49.299  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:32:49.300  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=0ms lancio=0 x=344 page=49,151 loc=71,16 target=7100
10-19 15:32:49.310  9401  9425 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-19 15:32:49.310  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:49.310  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=100
10-19 15:32:50.529  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:32:50.531  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1221ms lancio=1 x=100 page=157,151 loc=32,8 target=7086
10-19 15:32:50.531  9401  9425 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-19 15:32:50.531  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:50.532  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=100
10-19 15:32:50.865  9401  9425 I ReactNativeJS: VIBRA subtab disegnata growth dopo=8023ms
10-19 15:32:50.869  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=100
10-19 15:32:52.413 10182 10182 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-19 15:32:52.435  9401  9425 I ReactNativeJS: VIBRA subtab premuto mappa dopo=9593ms
10-19 15:32:52.435  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1122ms lancio=0 x=435 page=362,151 loc=11,16 target=7160
10-19 15:32:52.471  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:52.520  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 15:32:52.520  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 15:32:52.828  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 15:32:53.079  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:32:53.079  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=559ms lancio=0 x=480 page=390,151 loc=84,16 target=7160
10-19 15:32:53.144  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=65ms
10-19 15:32:53.254  9401  9425 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 15:32:53.255  9401  9425 I ReactNativeJS: VIBRA subtab mappa dopo=111ms
10-19 15:32:53.272  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=129ms
10-19 15:32:53.286  9401  9425 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=143ms
10-19 15:32:53.287  9401  9425 I ReactNativeJS: VIBRA subtab cambio mappa dopo=143ms
10-19 15:32:55.943 10226 10226 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-19 15:32:55.995  9401  9425 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2852ms
10-19 15:32:55.996  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=3476ms lancio=0 x=480 page=49,151 loc=21,16 target=7124
10-19 15:32:56.473  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 15:32:56.473  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:32:56.607  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 15:32:56.607  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 15:32:57.352  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:32:57.352  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=4832ms lancio=0 x=480 page=157,151 loc=7,8 target=7134
10-19 15:32:57.352  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 15:32:57.418  9401  9425 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 15:32:57.418  9401  9425 I ReactNativeJS: VIBRA subtab growth dopo=66ms
10-19 15:32:57.481  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=129ms
10-19 15:32:57.487  9401  9425 I ReactNativeJS: VIBRA subtab disegnata growth dopo=134ms
10-19 15:32:57.487  9401  9425 I ReactNativeJS: VIBRA subtab cambio growth dopo=135ms
10-19 15:33:00.637 10246 10246 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-19 15:33:01.573  9401  9425 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4221ms
10-19 15:33:01.574  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=9054ms lancio=0 x=480 page=362,151 loc=24,8 target=7158
10-19 15:33:01.578  9401  9425 I ReactNativeJS: VIBRA subtab mappa dopo=4226ms
10-19 15:33:01.578  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-19 15:33:01.609  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=31ms
10-19 15:33:02.164  9401  9425 I ReactNativeJS: VIBRA subtab premuto mappa dopo=586ms
10-19 15:33:02.173  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=594ms lancio=0 x=435 page=390,151 loc=7,8 target=7158
10-19 15:33:02.173  9401  9425 I ReactNativeJS: VIBRA subtab mappa dopo=595ms
10-19 15:33:02.173  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 15:33:02.311  9401  9425 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=138ms
10-19 15:33:02.430  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 15:33:02.431  9401  9425 I ReactNativeJS: VIBRA subtab cambio mappa dopo=258ms
10-19 15:33:02.828  9401  9425 I ReactNativeJS: VIBRA subtab cambio mappa dopo=654ms
10-19 15:33:04.438 10292 10292 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-19 15:33:05.000  9401  9425 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2827ms
10-19 15:33:05.002  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1918ms lancio=0 x=480 page=49,151 loc=21,16 target=7124
10-19 15:33:05.461  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 15:33:05.466  9401  9425 I ReactNativeJS: VIBRA subtab tabelle dopo=3293ms
10-19 15:33:05.467  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=465ms
10-19 15:33:05.503  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=37ms
10-19 15:33:05.860  9401  9425 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=393ms
10-19 15:33:05.876  9401  9425 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=409ms
10-19 15:33:09.677 10313 10313 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-19 15:33:11.448  9401  9425 I ReactNativeJS: VIBRA subtab premuto growth dopo=5981ms
10-19 15:33:11.461  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=8378ms lancio=0 x=480 page=157,151 loc=7,8 target=7134
10-19 15:33:11.465  9401  9425 I ReactNativeJS: VIBRA subtab growth dopo=5998ms
10-19 15:33:11.465  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-19 15:33:11.470  9401  9425 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4ms
10-19 15:33:11.470  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=8386ms lancio=0 x=480 page=362,151 loc=24,8 target=7158
10-19 15:33:11.470  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:33:11.471  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 15:33:11.471  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 15:33:11.471  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:33:11.472  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1ms lancio=0 x=480 page=390,151 loc=84,16 target=7160
10-19 15:33:11.472  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 15:33:11.493  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=21ms
10-19 15:33:12.239  9401  9425 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 15:33:12.239  9401  9425 I ReactNativeJS: VIBRA subtab mappa dopo=767ms
10-19 15:33:12.239  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 15:33:12.240  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 15:33:12.240  9401  9425 I ReactNativeJS: VIBRA subtab disegnata growth dopo=768ms
10-19 15:33:12.241  9401  9425 I ReactNativeJS: VIBRA subtab cambio growth dopo=769ms
10-19 15:33:13.607 10335 10335 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-19 15:33:13.640  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=2168ms
10-19 15:33:13.663  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:33:13.663  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=7ms lancio=0 x=344 page=49,151 loc=71,16 target=7100
10-19 15:33:13.664  9401  9425 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-19 15:33:13.664  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:33:14.450  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=2979ms
10-19 15:33:14.462  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=223
10-19 15:33:14.462  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=223
10-19 15:33:14.515  9401  9425 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=3043ms
10-19 15:33:14.516  9401  9425 I ReactNativeJS: VIBRA subtab disegnata growth dopo=3044ms
10-19 15:33:14.516  9401  9425 I ReactNativeJS: VIBRA subtab cambio mappa dopo=3044ms
10-19 15:33:14.655  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=3183ms
10-19 15:33:15.027  9401  9425 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=3556ms
10-19 15:33:15.641  9401  9425 I ReactNativeJS: VIBRA subtab premuto growth dopo=4169ms
10-19 15:33:15.641  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=281ms lancio=0 x=480 page=157,151 loc=7,8 target=7134
10-19 15:33:15.641  9401  9425 I ReactNativeJS: VIBRA subtab growth dopo=4169ms
10-19 15:33:15.641  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 15:33:15.673  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata growth dopo=31ms
10-19 15:33:15.688  9401  9425 I ReactNativeJS: VIBRA subtab disegnata growth dopo=47ms
10-19 15:33:15.689  9401  9425 I ReactNativeJS: VIBRA subtab cambio growth dopo=47ms
10-19 15:33:17.522  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato growth
10-19 15:33:18.374 10379 10379 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-19 15:33:18.539  9401  9425 I ReactNativeJS: VIBRA subtab premuto mappa dopo=2898ms
10-19 15:33:18.540  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=3180ms lancio=0 x=480 page=362,151 loc=24,8 target=7158
10-19 15:33:18.540  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:33:18.541  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=480
10-19 15:33:18.541  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=480
10-19 15:33:19.264  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 15:33:20.136  9401  9425 I ReactNativeJS: VIBRA subtab premuto mappa dopo=4494ms
10-19 15:33:20.138  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=875ms lancio=0 x=435 page=390,151 loc=7,8 target=7158
10-19 15:33:20.384  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-19 15:33:20.397  9401  9425 I ReactNativeJS: VIBRA subtab mappa dopo=4756ms
10-19 15:33:20.401  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=263ms
10-19 15:33:20.461  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata mappa dopo=59ms
10-19 15:33:20.502  9401  9425 I ReactNativeJS: VIBRA subtab disegnata mappa dopo=101ms
10-19 15:33:20.923  9401  9425 I ReactNativeJS: VIBRA subtab cambio mappa dopo=522ms
10-19 15:33:23.288  9401  9425 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2887ms
10-19 15:33:23.289  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1814ms lancio=0 x=480 page=49,151 loc=21,16 target=7124
10-19 15:33:23.580  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 15:33:23.581  9401  9425 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-19 15:33:24.439  9401  9425 I ReactNativeJS: VIBRA hscroll lancio x=325
10-19 15:33:24.835  9401  9425 I ReactNativeJS: VIBRA hscroll ferma x=325
10-19 15:33:27.516 10423 10423 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-19 15:33:27.917  9401  9425 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=7516ms
10-19 15:33:27.917  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=3929ms lancio=0 x=325 page=265,151 loc=83,16 target=7124
10-19 15:33:27.918  9401  9425 I ReactNativeJS: VIBRA subtab tabelle dopo=7517ms
10-19 15:33:27.918  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 15:33:27.957  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=39ms
10-19 15:33:27.972  9401  9425 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=54ms
10-19 15:33:27.973  9401  9425 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=54ms
10-19 15:33:32.717  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 15:33:32.722  9401  9425 I ReactNativeJS: VIBRA subtab premuto comitive dopo=4804ms
10-19 15:33:32.723  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=8735ms lancio=0 x=325 page=157,151 loc=42,8 target=7110
10-19 15:33:32.726  9401  9425 I ReactNativeJS: VIBRA subtab comitive dopo=4808ms
10-19 15:33:32.727  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=4ms
10-19 15:33:32.771  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=44ms
10-19 15:33:33.207  9401  9425 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=480ms
10-19 15:33:33.386  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 15:33:33.386  9401  9425 I ReactNativeJS: VIBRA subtab cambio comitive dopo=660ms
10-19 15:33:33.907  9401  9425 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-19 15:33:33.907  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=523ms lancio=0 x=344 page=265,151 loc=12,16 target=7136
10-19 15:33:33.908  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 15:33:33.968  9401  9425 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-19 15:33:33.968  9401  9425 I ReactNativeJS: VIBRA subtab tabelle dopo=61ms
10-19 15:33:33.994  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=86ms
10-19 15:33:34.003  9401  9425 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=95ms
10-19 15:33:34.003  9401  9425 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=95ms
10-19 15:33:36.972  9401  9425 I ReactNativeJS: VIBRA subtab premuto comitive dopo=3064ms
10-19 15:33:36.972  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=955ms lancio=0 x=344 page=157,151 loc=93,16 target=7112
10-19 15:33:37.002  9401  9425 I ReactNativeJS: VIBRA subtab comitive dopo=3094ms
10-19 15:33:37.007  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=35ms
10-19 15:33:37.050  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=44ms
10-19 15:33:37.082  9401  9425 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=76ms
10-19 15:33:37.082  9401  9425 I ReactNativeJS: VIBRA subtab cambio comitive dopo=76ms
10-19 15:33:37.248  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 15:33:39.585  9401  9425 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2578ms
10-19 15:33:39.585  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1764ms lancio=0 x=250 page=265,151 loc=8,16 target=7124
10-19 15:33:39.585  9401  9425 I ReactNativeJS: VIBRA subtab tabelle dopo=2579ms
10-19 15:33:39.585  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 15:33:39.599  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=14ms
10-19 15:33:39.602  9401  9425 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=16ms
10-19 15:33:39.621  9401  9425 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=36ms
10-19 15:33:40.747  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 15:33:42.718  9401  9425 I ReactNativeJS: VIBRA subtab premuto comitive dopo=3133ms
10-19 15:33:42.718  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=1042ms lancio=0 x=344 page=157,151 loc=93,16 target=7112
10-19 15:33:42.719  9401  9425 I ReactNativeJS: VIBRA subtab comitive dopo=3133ms
10-19 15:33:42.719  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-19 15:33:42.739  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=21ms
10-19 15:33:42.752  9401  9425 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=33ms
10-19 15:33:42.752  9401  9425 I ReactNativeJS: VIBRA subtab cambio comitive dopo=33ms
10-19 15:33:42.859  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-19 15:33:45.285  9401  9425 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2566ms
10-19 15:33:45.285  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=2097ms lancio=0 x=250 page=265,151 loc=8,16 target=7124
10-19 15:33:45.285  9401  9425 I ReactNativeJS: VIBRA subtab tabelle dopo=2566ms
10-19 15:33:45.285  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 15:33:45.299  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=14ms
10-19 15:33:45.302  9401  9425 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=17ms
10-19 15:33:45.318  9401  9425 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=33ms
10-19 15:33:46.283  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-19 15:33:48.235  9401  9425 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2950ms
10-19 15:33:48.235  9401  9425 I ReactNativeJS: VIBRA hscroll tocco dopo=991ms lancio=0 x=344 page=157,151 loc=93,16 target=7112
10-19 15:33:48.235  9401  9425 I ReactNativeJS: VIBRA subtab comitive dopo=2950ms
10-19 15:33:48.235  9401  9425 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-19 15:33:48.257  9401  9425 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=22ms
10-19 15:33:48.299  9401  9425 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=63ms
10-19 15:33:48.301  9401  9425 I ReactNativeJS: VIBRA subtab cambio comitive dopo=66ms
10-19 15:33:48.489  9401  9425 I ReactNativeJS: VIBRA subtab rilasciato comitive
```
