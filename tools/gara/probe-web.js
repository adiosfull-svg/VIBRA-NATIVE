// Sonda della gara (docs/PIANO-PRESTAZIONI.md) per l'app web ORIGINALE: inserita in testa a
// index.html della build di produzione (tools/gara/build-ref.sh), prima degli script dell'app.
// Stessa definizione della sonda nativa (app/src/lib/testDiag.ts):
//   primo  = ms dalla navigazione alla prima modifica del contenuto della pagina
//   pronta = ms dalla navigazione all'ultima modifica, quando non ci sono richieste di rete in corso
//            e il contenuto non cambia da 300 ms (limite 15 s: "NONSIFERMA")
// Contano le modifiche al contenuto (nodi e testo), non gli attributi: le animazioni di
// framer-motion cambiano lo style a ogni frame, come le animazioni native che non ridisegnano.
// Uso dal banco di prova: await window.__gara.nav('/serate')  → { primo, pronta, render, rete }
//                         await window.__gara.avvio()         → misura dal caricamento della pagina
(function () {
  var QUIET_MS = 300;
  var LIMIT_MS = 15000;
  var g = { t0: -1, first: -1, last: 0, inflight: 0, renders: 0, fetches: 0, done: null };
  function activity(render) {
    var n = performance.now();
    g.last = n;
    if (!render) return;
    g.renders++;
    if (g.t0 >= 0 && g.first < 0) g.first = n;
  }
  function check() {
    if (g.t0 < 0) return;
    var n = performance.now();
    var timeout = n - g.t0 > LIMIT_MS;
    if (timeout || (g.inflight === 0 && g.first >= 0 && n - g.last >= QUIET_MS)) {
      var end = timeout ? n : g.last;
      var r = {
        primo: Math.round((g.first < 0 ? end : g.first) - g.t0),
        pronta: Math.round(end - g.t0),
        render: g.renders,
        rete: g.fetches,
        nonSiFerma: timeout,
      };
      g.t0 = -1;
      var done = g.done;
      g.done = null;
      if (done) done(r);
      return;
    }
    requestAnimationFrame(check);
  }
  function start(t0) {
    var wasIdle = g.t0 < 0;
    g.t0 = t0;
    g.first = -1;
    g.renders = 0;
    g.fetches = 0;
    g.last = t0;
    if (wasIdle) requestAnimationFrame(check);
    return new Promise(function (resolve) { g.done = resolve; });
  }

  var realFetch = window.fetch;
  window.fetch = function () {
    g.inflight++;
    g.fetches++;
    activity(false);
    return realFetch.apply(this, arguments).finally(function () { g.inflight--; activity(false); });
  };
  var realSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    g.inflight++;
    g.fetches++;
    activity(false);
    this.addEventListener('loadend', function () { g.inflight--; activity(false); });
    return realSend.apply(this, arguments);
  };
  // import() delle pagine lazy (plugin gara-imports di tools/web-ref/overrides/vite.config.js)
  window.__garaImp = function (promise) {
    g.inflight++;
    activity(false);
    return promise.finally(function () { g.inflight--; activity(false); });
  };
  new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].type !== 'attributes') { activity(true); return; }
    }
  }).observe(document, { childList: true, subtree: true, characterData: true });

  // avvio: dall'inizio del caricamento della pagina (timeOrigin), come l'avvio dell'app nativa
  var boot = start(0);
  window.__gara = {
    avvio: function () { return boot; },
    nav: function (path) {
      var p = start(performance.now());
      history.pushState({}, '', path);
      dispatchEvent(new PopStateEvent('popstate', { state: {} }));
      return p;
    },
  };
})();
