import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cssColor, parseLinearGradient, webStyle } from './webStyle.ts';

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
  assert.equal(style.shadowColor, '#561a8e73');
  assert.equal(style.shadowRadius, 6);
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
