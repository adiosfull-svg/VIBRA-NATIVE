// <input type="color"> sul web: riquadro con le classi della pagina e sopra un input colore vero e
// trasparente, così la scelta è quella del browser.
import { createElement } from 'react';
import { Div } from './html';

export type ColorFieldProps = { value?: string; onChange?: (e: { target: { value: string } }) => void; className?: string; disabled?: boolean };

const OVERLAY = { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', border: 0, padding: 0, margin: 0 };

export function ColorField({ value, onChange, className, disabled }: ColorFieldProps) {
  return (
    <Div className={className} style={{ backgroundColor: value || '#000000', position: 'relative' }}>
      {createElement('input', {
        type: 'color', value: value || '#000000', disabled, style: OVERLAY,
        onChange: (e: { target: { value: string } }) => onChange?.({ target: { value: e.target.value } }),
      })}
    </Div>
  );
}
