#!/usr/bin/env bash
# Eseguito dal workflow "Emulatore" con l'emulatore acceso: installa l'APK di prova, esegue i
# percorsi Maestro ($FLOWS) e raccoglie screenshot, log e albero della UI in out/.
set -u
OUT=$PWD/out
mkdir -p "$OUT/screens"
APK=${APK:-app/android/app/build/outputs/apk/release/app-release.apk}
adb reverse tcp:54321 tcp:54321
# niente finestre "X isn't responding" del sistema (l'emulatore senza GPU è lento): coprirebbero l'app
adb shell settings put global hide_error_dialogs 1 || true
adb shell settings put secure anr_show_background 0 || true
adb install -r "$APK"
adb logcat -c
adb logcat -v time > "$OUT/logcat-full.txt" 2>&1 &
LOGCAT=$!
status=0
# FLUID=1 ([fluidita]): animazioni attive (workflow), video di ogni percorso e frame persi del percorso
# (dumpsys gfxinfo azzerato prima di ognuno) → out/video/*.mp4 e out/fluidita.md
PKG=com.vibra.mobile
if [ "${FLUID:-}" = 1 ]; then
  mkdir -p "$OUT/video" "$OUT/gfx"
  printf '# Fluidità per percorso (%s)\n\nFrame disegnati, frame persi (jank) e tempi per frame dal sistema (dumpsys gfxinfo).\nEmulatore senza GPU: i valori assoluti sono peggiori di un telefono vero, contano i confronti tra run.\n\n| percorso | frame | persi | %% persi | p50 | p90 | p95 | p99 | UI lento | draw lento |\n|---|---|---|---|---|---|---|---|---|---|\n' "${UTENTE:-}" > "$OUT/fluidita.md"
fi
# screenrecord si ferma da solo a 3 minuti: spezzoni consecutivi finché esiste il file segnale
rec_start() {
  touch "$OUT/.rec"
  ( i=0; while [ -f "$OUT/.rec" ]; do adb shell screenrecord --bit-rate 1000000 --size 540x1200 --time-limit 170 "/sdcard/rec-$1-$i.mp4"; i=$((i+1)); done ) &
  REC=$!
}
rec_stop() {
  rm -f "$OUT/.rec"
  adb shell pkill -INT screenrecord || true
  wait $REC 2>/dev/null
  sleep 1
  for v in $(adb shell ls "/sdcard/rec-$1-*.mp4" 2>/dev/null | tr -d '\r'); do adb pull "$v" "$OUT/video/" >/dev/null && adb shell rm "$v"; done
}
gfx_row() {
  local g="$OUT/gfx/$1.txt"
  adb shell dumpsys gfxinfo $PKG > "$g" 2>/dev/null || return
  v() { grep -m1 "$1" "$g" | sed -E "s/.*$1:? *//" | tr -d '\r'; }
  local total=$(v 'Total frames rendered') jank=$(v 'Janky frames')
  echo "| $1 | $total | ${jank%% *} | $(echo "$jank" | grep -oE '[0-9.]+%') | $(v '50th percentile') | $(v '90th percentile') | $(v '95th percentile') | $(v '99th percentile') | $(v 'Number Slow UI thread') | $(v 'Number Slow issue draw commands') |" >> "$OUT/fluidita.md"
}
# TRACE=1 ([traccia]): traccia di sistema Perfetto di ogni percorso (thread UI, montaggio delle viste di
# React Native, disegno) → out/tracce/<percorso>.pftrace, da leggere con tools/traccia/analizza.py
trace_start() {
  mkdir -p "$OUT/tracce"
  # campionamento del codice (linux.perf): il servizio traced_perf è spento di default sugli emulatori
  if [ -z "${PERF_ON:-}" ]; then
    adb shell su 0 setprop persist.traced_perf.enable 1 || adb shell setprop persist.traced_perf.enable 1 || true
    adb shell su 0 setprop security.perf_harden 0 || true
    sleep 2; adb shell getprop persist.traced_perf.enable; PERF_ON=1
  fi
  # l'app legge all'avvio se la traccia è attiva: si chiude prima, il percorso la riapre (launchApp)
  adb shell am force-stop $PKG
  adb shell rm -f /data/misc/perfetto-traces/vibra.pftrace
  adb shell perfetto --background --txt -o /data/misc/perfetto-traces/vibra.pftrace -c - <<'CFG' > /dev/null
buffers { size_kb: 49152 fill_policy: RING_BUFFER }
data_sources { config { name: "linux.ftrace" ftrace_config {
  atrace_categories: "view"
  atrace_apps: "com.vibra.mobile"
} } }
data_sources { config { name: "linux.process_stats" process_stats_config { scan_all_processes_on_start: true } } }
data_sources { config { name: "linux.perf" perf_event_config {
  timebase { frequency: 250 }
  callstack_sampling { scope { target_cmdline: "com.vibra.mobile" } }
} } }
duration_ms: 600000
CFG
}
trace_stop() {
  adb shell killall -TERM perfetto 2>/dev/null || adb shell pkill -TERM perfetto || true
  sleep 4
  adb pull /data/misc/perfetto-traces/vibra.pftrace "$OUT/tracce/$1.pftrace" > /dev/null 2>&1 || echo "traccia di $1 non scaricata"
}
cd "$OUT/screens"
for f in $(ls "$OLDPWD"/${FLOWS:-tests/emulatore}/*.yaml 2>/dev/null || echo "$OLDPWD/${FLOWS}"); do
  name=$(basename "$f" .yaml)
  echo "== $name"
  if [ "${FLUID:-}" = 1 ]; then adb shell dumpsys gfxinfo $PKG reset > /dev/null 2>&1 || true; rec_start "$name"; fi
  if [ "${TRACE:-}" = 1 ]; then trace_start; fi
  maestro test -e EMAIL="${EMAIL:-admin@vibra.local}" "$f" --format junit --output "$OUT/$name.xml" > "$OUT/$name.log" 2>&1 || { status=1; echo "FALLITO $name"; }
  if [ "${FLUID:-}" = 1 ]; then gfx_row "$name"; rec_stop "$name"; fi
  if [ "${TRACE:-}" = 1 ]; then trace_stop "$name"; fi
  adb exec-out uiautomator dump /dev/tty > "$OUT/$name-ui.xml" 2>/dev/null || true
  adb exec-out screencap -p > "$OUT/screens/$name-fine.png" || true
done
cd "$OLDPWD"
kill $LOGCAT 2>/dev/null
grep -E "ReactNativeJS|AndroidRuntime|FATAL|ExceptionsManager|VIBRA" "$OUT/logcat-full.txt" > "$OUT/logcat-app.txt" || true
cp -r ~/.maestro/tests "$OUT/maestro-debug" 2>/dev/null || true
# crash dell'app (segnale nativo con traccia, eccezione Java, ANR, Scudo OOM) → crash.txt e giro fallito
awk -f tests/emulatore/crash.awk "$OUT/logcat-full.txt" "$OUT/logcat-full.txt" > "$OUT/crash.txt" || true
crash=$(grep -cE "Fatal signal|FATAL EXCEPTION|ANR in|Scudo OOM" "$OUT/crash.txt")
if [ "$crash" != 0 ]; then status=1; echo "CRASH DELL'APP: vedi crash.txt"; head -40 "$OUT/crash.txt"; else rm -f "$OUT/crash.txt"; fi
printf 'esito: %s\ncrash: %s\n' "$status" "$crash" > "$OUT/esito.txt"
exit 0
