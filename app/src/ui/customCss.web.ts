// Classi CSS proprie dell'index.css originale (non Tailwind) che servono così come sono sul web:
// le View di react-native-web tengono la classe nel DOM, quindi basta la regola. Specificità doppia
// per vincere sulle classi atomiche di react-native-web (position: relative...).
// Sul telefono le stesse classi le emula html.tsx (customCss.ts).
const CSS = `
.semina-flip-container.semina-flip-container { perspective: 1200px; }
.semina-flip-inner.semina-flip-inner { position: relative; transform-style: preserve-3d; will-change: transform; touch-action: pan-y; }
.semina-flip-inner * { touch-action: pan-y; }
.semina-flip-front.semina-flip-front, .semina-flip-back.semina-flip-back { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.semina-flip-back.semina-flip-back { position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform: rotateY(180deg); }
.no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
`;

if (typeof document !== 'undefined' && !document.getElementById('vibra-custom-css')) {
  const el = document.createElement('style');
  el.id = 'vibra-custom-css';
  el.textContent = CSS;
  document.head.appendChild(el);
}

export {};
