// SOLO build di prova (VIBRA_JS_PROFILE=1 al prebuild: emulatore con `profilo_js: si`).
// Profilo del thread JS: il campionatore di Hermes parte all'avvio dell'app; il broadcast
//   adb shell am broadcast -a com.vibra.mobile.PROFILO_JS -p com.vibra.mobile
// salva i campioni (formato Chrome trace) in /sdcard/Android/data/com.vibra.mobile/files/js-profilo.json
// e riparte da zero. Lo legge tools/profilo/analizza.py. Nell'APK vero non c'è.
const { withMainActivity } = require('@expo/config-plugins');

const HELPER = `

// VIBRA (plugins/withJsProfiler.js): campionatore di Hermes, salvato a comando (broadcast)
object VibraJsProfiler {
  fun attach(activity: android.app.Activity) {
    try {
      com.facebook.hermes.instrumentation.HermesSamplingProfiler.enable()
    } catch (e: Throwable) {
      android.util.Log.e("VIBRA_PROFILO", "campionatore di Hermes non disponibile: " + e)
      return
    }
    val receiver = object : android.content.BroadcastReceiver() {
      override fun onReceive(c: android.content.Context, i: android.content.Intent) {
        val f = java.io.File(c.getExternalFilesDir(null), "js-profilo.json")
        com.facebook.hermes.instrumentation.HermesSamplingProfiler.dumpSampledTraceToFile(f.path)
        com.facebook.hermes.instrumentation.HermesSamplingProfiler.disable()
        com.facebook.hermes.instrumentation.HermesSamplingProfiler.enable()
        android.util.Log.i("VIBRA_PROFILO", "salvato " + f.path + " " + f.length())
      }
    }
    val filter = android.content.IntentFilter("com.vibra.mobile.PROFILO_JS")
    if (android.os.Build.VERSION.SDK_INT >= 33) activity.applicationContext.registerReceiver(receiver, filter, android.content.Context.RECEIVER_EXPORTED)
    else activity.applicationContext.registerReceiver(receiver, filter)
  }
}
`;

module.exports = function withJsProfiler(config) {
  if (process.env.VIBRA_JS_PROFILE !== '1') return config;
  return withMainActivity(config, (cfg) => {
    let src = cfg.modResults.contents;
    if (src.includes('VibraJsProfiler')) return cfg;
    if (cfg.modResults.language !== 'kt') throw new Error('withJsProfiler: MainActivity non in Kotlin');
    src = src.replace(/(super\.onCreate\([^)]*\))/, '$1\n    VibraJsProfiler.attach(this)');
    if (!src.includes('VibraJsProfiler.attach')) throw new Error('withJsProfiler: super.onCreate non trovato');
    cfg.modResults.contents = src + HELPER;
    return cfg;
  });
};
