// TextDecoder di Hermes/Expo sul telefono conosce solo UTF-8: new TextDecoder('latin1') lancia
// "RangeError: Unknown encoding" e fast-png (usato da jsPDF) lo fa appena caricato → la Dashboard
// faceva chiudere l'app nella build release. Qui le codifiche a un byte vengono decodificate in JS
// (ogni byte → il carattere con lo stesso codice, come latin1 di Node); le altre restano al TextDecoder nativo.
// Va importato prima di tutto il resto (app/_layout.tsx).

const SINGLE_BYTE = new Set(['latin1', 'iso-8859-1', 'iso8859-1', 'iso_8859-1', 'l1', 'ascii', 'us-ascii', 'windows-1252', 'cp1252', 'binary']);

type Input = ArrayBuffer | ArrayBufferView | undefined;

class SingleByteDecoder {
  readonly encoding = 'windows-1252';
  readonly fatal = false;
  readonly ignoreBOM = false;
  decode(input?: Input): string {
    if (input == null) return '';
    const bytes = input instanceof ArrayBuffer
      ? new Uint8Array(input)
      : new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    let out = '';
    // a blocchi: String.fromCharCode con troppi argomenti supera lo stack
    for (let i = 0; i < bytes.length; i += 8192) {
      out += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 8192)));
    }
    return out;
  }
}

function supports(Native: typeof TextDecoder, label: string): boolean {
  try { new Native(label); return true; } catch { return false; }
}

const g = globalThis as { TextDecoder?: typeof TextDecoder };
const Native = g.TextDecoder;
if (Native && !supports(Native, 'latin1')) {
  // un costruttore che restituisce un oggetto: `new TextDecoder('latin1')` riceve il decoder JS
  const Compat = function TextDecoder(this: unknown, label = 'utf-8', options?: TextDecoderOptions) {
    if (SINGLE_BYTE.has(String(label).trim().toLowerCase())) return new SingleByteDecoder();
    return new Native(label, options);
  } as unknown as typeof TextDecoder;
  (Compat as { prototype: unknown }).prototype = Native.prototype;
  g.TextDecoder = Compat;
}

export {};
