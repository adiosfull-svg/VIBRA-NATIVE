// android:gwpAsanMode="never" sull'<application>: GWP-ASan (campionatore di memoria di Android) faceva
// cadere l'app di rado all'avvio (SIGSEGV in android_unsafe_frame_pointer_chase, dentro
// GuardedPoolAllocator::deallocate chiamato da libhermesvm): risale lo stack con i frame pointer, che
// Hermes non tiene. Visto 2 volte su ~20 giri dell'emulatore (14/10). Non è un errore di memoria dell'app.
const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withGwpAsanOff(config) {
  return withAndroidManifest(config, (cfg) => {
    const app = cfg.modResults.manifest.application?.[0];
    if (app) app.$['android:gwpAsanMode'] = 'never';
    return cfg;
  });
};
