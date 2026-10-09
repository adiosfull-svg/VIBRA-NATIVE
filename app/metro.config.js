const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// inlineRem 16: 1rem = 16px come nel browser, così text-sm, p-3, ecc. hanno le misure dell'app web.
module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
