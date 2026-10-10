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

// inlineRem 16: 1rem = 16px come nel browser, così text-sm, p-3, ecc. hanno le misure dell'app web.
module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
