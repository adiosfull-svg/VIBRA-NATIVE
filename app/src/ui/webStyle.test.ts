import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cssColor, cssViewport, parseLinearGradient, viewportSizeStyle, webStyle } from './webStyle.ts';

test('colori CSS dell\'app web', () => {
  assert.equal(cssColor('hsl(var(--primary))'), '#561a8e');
  assert.equal(cssColor('hsl(var(--primary) / 0.55)'), '#561a8e8c');
  assert.match(cssColor('hsl(240,5%,50%)')!, /^#7[89a]7[89a]8[4-6]$/);
  assert.equal(cssColor('var(--card)'), '#131316');
  assert.equal(cssColor('rgba(167,139,250,0.25)'), 'rgba(167,139,250,0.25)');
  assert.equal(cssColor('currentColor'), undefined);
});

test('gradienti lineari', () => {
  assert.deepEqual(parseLinearGradient('linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)'), {
    dir: 'angle', angle: 135, colors: ['#833ab4', '#fd1d1d', '#fcb045'], locations: [0, 0.5, 1],
  });
  const g = parseLinearGradient('linear-gradient(to right, hsl(var(--primary) / 0.2), transparent)');
  assert.equal(g?.angle, 90);
  assert.deepEqual(g?.colors, ['#561a8e33', 'transparent']);
});

test('webStyle: ombre, misure, proprietà solo-web', () => {
  const { style, gradient } = webStyle({
    width: '75px', height: 46, background: 'hsl(var(--primary) / 0.55)',
    boxShadow: 'inset 0 0 0 1px red, 0 0 12px -2px hsl(var(--primary) / 0.45)',
    transition: 'transform 0.2s', willChange: 'transform', minHeight: 'calc(100dvh - 2rem)',
    transform: 'translateY(-1px) scale(1.15)', fontSize: '10px', opacity: 0.45,
  });
  assert.equal(gradient, undefined);
  assert.equal(style.width, 75);
  assert.equal(style.backgroundColor, '#561a8e8c');
  assert.equal(style.boxShadow, 'inset 0px 0px 0px 1px red, 0px 0px 12px -2px #561a8e73');
  assert.equal(style.minHeight, undefined);
  assert.equal(style.transition, undefined);
  assert.deepEqual(style.transform, [{ translateY: -1 }, { scale: 1.15 }]);
  assert.equal(style.fontSize, 10);
  assert.equal(style.opacity, 0.45);
});

test('webStyle: sfondo a gradiente estratto', () => {
  const r = webStyle({ backgroundImage: 'linear-gradient(to bottom, #000, #fff)', borderRadius: 12 });
  assert.equal(r.style.borderRadius, 12);
  assert.equal(r.gradient?.angle, 180);
});

test('webStyle: bordi e raggi abbreviati', () => {
  const { style } = webStyle({ borderRadius: '0 0 7px 0', borderRight: '1px solid hsl(var(--border))', padding: '2px 6px' });
  assert.deepEqual([style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius], [0, 0, 7, 0]);
  assert.equal(style.borderRightWidth, 1);
  assert.equal(style.borderRightColor, '#2c2c30');
  assert.deepEqual([style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft], [2, 6, 2, 6]);
});

test('webStyle: display flex in riga e raggio in percentuale', () => {
  assert.equal(webStyle({ display: 'flex', gap: '4px' }).style.flexDirection, 'row');
  assert.equal(webStyle({ width: 12, height: 12, borderRadius: '50%' }).style.borderRadius, 6);
});

test('webStyle: vh/dvh e calc semplici con le dimensioni della finestra', () => {
  Object.assign(cssViewport, { width: 390, height: 844 });
  try {
    const { style } = webStyle({ height: '100dvh', minHeight: 'calc(100dvh - 4rem - env(safe-area-inset-top))', width: '50vw', maxHeight: 'calc(100% - 2rem)' });
    assert.equal(style.height, 844);
    assert.equal(style.minHeight, 780);
    assert.equal(style.width, 195);
    assert.equal(style.maxHeight, undefined);
  } finally {
    Object.assign(cssViewport, { width: 0, height: 0 });
  }
});

test('webStyle: rotateY/perspective e transition (solo web)', () => {
  assert.deepEqual(webStyle({ transform: 'perspective(1200px) rotateY(180deg)' }).style.transform, [{ perspective: 1200 }, { rotateY: '180deg' }]);
  const t = webStyle({ transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1)' }, true).style;
  assert.deepEqual(t, { transitionProperty: 'transform', transitionDuration: '400ms', transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' });
  assert.equal(webStyle({ transition: 'transform 1s' }).style.transitionProperty, undefined);
});

test('position inline (absolute/relative restano, fixed/sticky convertiti)', () => {
  assert.equal(webStyle({ position: 'absolute', top: 10 }, false).style.position, 'absolute');
  assert.equal(webStyle({ position: 'relative' }, true).style.position, 'relative');
  assert.equal(webStyle({ position: 'sticky' }, false).style.position, 'relative');
  assert.equal(webStyle({ position: 'static' }, false).style.position, undefined);
});

test('dimensioni delle classi relative alla finestra (calc senza spazi, aree sicure, breakpoint)', () => {
  Object.assign(cssViewport, { width: 390, height: 844, insetTop: 24, insetBottom: 16 });
  try {
    const list = [
      { prop: 'maxHeight', value: 'calc(100dvh-7rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))', max: 640 },
      { prop: 'maxHeight', value: '90vh', min: 640 },
    ];
    assert.deepEqual(viewportSizeStyle(list), { maxHeight: 844 - 112 - 24 - 16 });
    Object.assign(cssViewport, { width: 800 });
    assert.deepEqual(viewportSizeStyle(list), { maxHeight: 844 * 0.9 });
  } finally {
    Object.assign(cssViewport, { width: 0, height: 0, insetTop: 0, insetBottom: 0 });
  }
});

test('webStyle: max()/min() di lunghezze assolute (aree sicure)', () => {
  Object.assign(cssViewport, { insetBottom: 24 });
  try {
    assert.equal(webStyle({ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }).style.paddingBottom, 24);
    assert.equal(webStyle({ paddingBottom: 'max(env(safe-area-inset-bottom), 300px)' }).style.paddingBottom, 300);
    assert.equal(webStyle({ paddingBottom: 'min(2rem, calc(10px + 4px))' }).style.paddingBottom, 14);
    assert.equal(webStyle({ paddingBottom: 'max(10%, 4px)' }).style.paddingBottom, undefined);
  } finally {
    Object.assign(cssViewport, { insetBottom: 0 });
  }
});

test('webStyle: width calc(100% + Npx) con left → right negativo (sul web il calc resta)', () => {
  assert.equal(webStyle({ left: 0, width: 'calc(100% + 16px)' }).style.right, -16);
  assert.equal(webStyle({ left: 0, width: 'calc(100% + 16px)' }).style.width, undefined);
  assert.equal(webStyle({ top: 0, height: 'calc(100% - 8px)' }).style.bottom, 8);
  assert.equal(webStyle({ left: 0, width: 'calc(100% + 16px)' }, true).style.width, 'calc(100% + 16px)');
});

test('webStyle: radial-gradient (web: CSS; telefono: experimental_backgroundImage) con size/position', () => {
  const css = 'radial-gradient(circle, rgba(255,255,255,0.08) 0.9px, transparent 1.3px)';
  const input = { backgroundImage: css, backgroundSize: '24px 24px', backgroundPosition: '3px 4px' };
  assert.deepEqual(webStyle(input, true).style, { backgroundImage: css, backgroundSize: '24px 24px', backgroundPosition: '3px 4px' });
  assert.deepEqual(webStyle(input, false).style, { experimental_backgroundImage: css, experimental_backgroundSize: '24px 24px', experimental_backgroundPosition: '3px 4px' });
  // senza gradiente radiale backgroundSize & co. restano fuori
  assert.deepEqual(webStyle({ backgroundSize: 'cover' }, true).style, {});
});

test('color-mix in srgb (card delle Comitive)', () => {
  assert.equal(cssColor('color-mix(in srgb, #38bdf8 14%, #161B26)'), 'rgba(27, 50, 67, 1)');
  assert.equal(cssColor('color-mix(in srgb, #ffffff, #000000)'), 'rgba(128, 128, 128, 1)');
  assert.deepEqual(webStyle({ border: '1px solid color-mix(in srgb, #c084fc 35%, #161B26)' }).style.borderColor, 'rgba(81, 64, 113, 1)');
  assert.equal(cssColor('color-mix(in oklch, red, blue)'), undefined);
});
