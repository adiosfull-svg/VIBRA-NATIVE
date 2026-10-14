#!/usr/bin/env bash
# Eseguito dal workflow "Emulatore" con [gara] nel messaggio del commit: installa l'APK di prova
# (build con EXPO_PUBLIC_TEST_GARA=1), serve l'originale con la sonda e lancia la gara.
set -u
OUT=$PWD/out
mkdir -p "$OUT"
adb reverse tcp:54321 tcp:54321
adb reverse tcp:5173 tcp:5173
adb shell settings put global hide_error_dialogs 1 || true
adb shell settings put secure anr_show_background 0 || true
adb install -r "$APK"
node tools/gara/serve.mjs "$GARA_REF" 5173 > "$OUT/serve.log" 2>&1 &
SERVE=$!
adb shell pm list packages | grep -iE "chrome|webview" > "$OUT/browser.txt" || true
adb shell getprop ro.build.fingerprint >> "$OUT/browser.txt" || true
adb logcat -v epoch > "$OUT/logcat-full.txt" 2>&1 &
LOGCAT=$!
node tools/gara/gara.mjs "${UTENTE:-admin}" "tests/gara/${UTENTE:-admin}.txt" "$OUT" > "$OUT/gara.log" 2>&1
echo "esito: $?" > "$OUT/esito.txt"
kill $LOGCAT $SERVE 2>/dev/null
grep -E "ReactNativeJS|AndroidRuntime|FATAL|VIBRA" "$OUT/logcat-full.txt" > "$OUT/logcat-app.txt" || true
cat "$OUT/gara.md" 2>/dev/null || tail -50 "$OUT/gara.log"
exit 0
