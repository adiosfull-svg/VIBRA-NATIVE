const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Nomi di funzioni e classi conservati nel bundle minimizzato: gli errori della build release
// (schermata di lib/crashReport.tsx) indicano componenti e funzioni leggibili.
config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
  keep_classnames: true,
  keep_fnames: true,
  mangle: { ...(config.transformer.minifierConfig?.mangle ?? {}), keep_classnames: true, keep_fnames: true },
};

// Avvio: ogni import viene eseguito al primo uso, non all'avvio dell'app (come nei template di React
// Native). Senza, all'apertura si eseguivano i moduli di tutte le pagine (bundle da ~11 MB) prima di
// mostrare la prima: ~10 s sull'emulatore. Gli import senza nome (import './x') restano immediati.
const baseTransformOptions = config.transformer.getTransformOptions;
config.transformer.getTransformOptions = async (...args) => {
  const options = await baseTransformOptions(...args);
  return { ...options, transform: { ...options.transform, inlineRequires: true } };
};

// Gara (docs/PIANO-PRESTAZIONI.md): un segno nel logcat alla prima riga di JS dell'app, per separare
// l'avvio nativo (processo + caricamento del bundle) dal lavoro del JS.
if (process.env.EXPO_PUBLIC_TEST_GARA === '1') {
  const baseFirst = config.serializer.getModulesRunBeforeMainModule;
  config.serializer.getModulesRunBeforeMainModule = (...args) => [require.resolve('./src/lib/garaStartMark.js'), ...baseFirst(...args)];
}

// inlineRem 16: 1rem = 16px come nel browser, così text-sm, p-3, ecc. hanno le misure dell'app web.
module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
