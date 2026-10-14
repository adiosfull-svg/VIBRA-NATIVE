// Build release più leggera da caricare: R8 riduce e ottimizza il bytecode Java/Kotlin e toglie le
// risorse inutilizzate. La gara (docs/PIANO-PRESTAZIONI.md) misurava ~2,5-3 s dalla creazione del
// processo al caricamento delle librerie native (SoLoader), prima ancora di React Native. Il template
// di Expo legge l'una o l'altra proprietà a seconda della versione: si impostano entrambe.
const { withGradleProperties } = require('@expo/config-plugins');

const PROPS = {
  'android.enableMinifyInReleaseBuilds': 'true',
  'android.enableProguardInReleaseBuilds': 'true',
  'android.enableShrinkResourcesInReleaseBuilds': 'true',
};

module.exports = function withReleaseShrink(config) {
  return withGradleProperties(config, (cfg) => {
    const items = cfg.modResults.filter((p) => !(p.type === 'property' && p.key in PROPS));
    for (const [key, value] of Object.entries(PROPS)) items.push({ type: 'property', key, value });
    cfg.modResults = items;
    return cfg;
  });
};
