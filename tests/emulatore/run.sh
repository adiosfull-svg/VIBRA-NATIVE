#!/usr/bin/env bash
# Eseguito dal workflow "Emulatore" con l'emulatore acceso: installa l'APK di prova, esegue i
# percorsi Maestro ($FLOWS) e raccoglie screenshot, log e albero della UI in out/.
set -u
OUT=$PWD/out
mkdir -p "$OUT/screens"
APK=app/android/app/build/outputs/apk/release/app-release.apk
adb reverse tcp:54321 tcp:54321
adb install -r "$APK"
adb logcat -c
adb logcat -v time > "$OUT/logcat-full.txt" 2>&1 &
LOGCAT=$!
status=0
cd "$OUT/screens"
for f in $(ls "$OLDPWD"/${FLOWS:-tests/emulatore}/*.yaml 2>/dev/null || echo "$OLDPWD/${FLOWS}"); do
  name=$(basename "$f" .yaml)
  echo "== $name"
  maestro test "$f" --format junit --output "$OUT/$name.xml" > "$OUT/$name.log" 2>&1 || { status=1; echo "FALLITO $name"; }
  adb exec-out uiautomator dump /dev/tty > "$OUT/$name-ui.xml" 2>/dev/null || true
  adb exec-out screencap -p > "$OUT/screens/$name-fine.png" || true
done
cd "$OLDPWD"
kill $LOGCAT 2>/dev/null
grep -E "ReactNativeJS|AndroidRuntime|FATAL|ExceptionsManager|VIBRA" "$OUT/logcat-full.txt" > "$OUT/logcat-app.txt" || true
cp -r ~/.maestro/tests "$OUT/maestro-debug" 2>/dev/null || true
echo "esito: $status" > "$OUT/esito.txt"
exit 0
