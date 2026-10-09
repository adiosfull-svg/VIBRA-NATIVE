import assert from 'node:assert/strict';
import { test } from 'node:test';

test('TextDecoder latin1 dove il nativo conosce solo UTF-8 (come Hermes sul telefono)', async () => {
  const Orig = globalThis.TextDecoder;
  // TextDecoder del telefono: solo utf-8
  globalThis.TextDecoder = class extends Orig {
    constructor(label = 'utf-8', options?: TextDecoderOptions) {
      if (!/^utf-?8$/i.test(label)) throw new RangeError(`Unknown encoding: ${label}`);
      super(label, options);
    }
  } as typeof TextDecoder;
  try {
    await import('./textDecoderLatin1.ts');
    const latin1 = new TextDecoder('latin1');
    assert.equal(latin1.decode(new Uint8Array([72, 105, 0xe9, 0xff])), 'Hiéÿ');
    assert.equal(latin1.decode(new Uint8Array(20000).fill(65).buffer).length, 20000);
    assert.equal(latin1.decode(new Uint8Array([0, 65, 66, 67]).subarray(1, 3)), 'AB');
    // le altre codifiche restano al decoder nativo
    assert.equal(new TextDecoder().decode(new Uint8Array([0xc3, 0xa9])), 'é');
    assert.throws(() => new TextDecoder('utf-16le'), RangeError);
  } finally {
    globalThis.TextDecoder = Orig;
  }
});
