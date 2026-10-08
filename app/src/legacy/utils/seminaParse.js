/**
 * Parser per input Semina: riconosce URL/handle di Instagram o TikTok.
 *
 * - parseIg(input)      → { handle, url, isUrl } solo Instagram (retrocompatibile)
 * - parseTikTok(input)  → { handle, url, isUrl } solo TikTok
 * - parsePlatform(raw)  → { platform, handle, profile_url, name } auto-rileva IG vs TikTok
 *
 * Usato da CaptureSeminaDialog, EditSeminaDialog, SeminaPasteMenu, SeminaAgenda.
 */

/**
 * Estrae SOLO l'username da un URL o handle Instagram.
 * A differenza di parseIg (che restituisce {handle, url, isUrl}), questa
 * restituisce una stringa pulita — pensata per il salvataggio diretto nel
 * campo `instagram` del Cliente (no URL completo, no @).
 *
 * Esempi:
 *   https://www.instagram.com/stories/giuliana.dolgetto/ → giuliana.dolgetto
 *   https://instagram.com/giuliana.dolgetto?hl=it         → giuliana.dolgetto
 *   www.instagram.com/giuliana.dolgetto                   → giuliana.dolgetto
 *   @giuliana.dolgetto                                    → giuliana.dolgetto
 *   giuliana.dolgetto                                     → giuliana.dolgetto
 */
export function parseIgHandle(input) {
  if (!input) return '';
  let s = input.trim();
  if (s.includes('instagram.com') && !s.startsWith('http')) s = 'https://' + s;
  if (s.includes('instagram.com')) {
    try {
      const url = new URL(s);
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length === 0) return '';
      if (parts[0] === 'stories' && parts[1]) return parts[1];
      const skip = new Set(['p', 'reel', 'reels', 'explore', 'accounts', 'direct', 'dm', 'tv']);
      if (!skip.has(parts[0])) return parts[0];
      // URL non estraibile (DM, reel, post...): mantieni l'input originale
      // senza @ così il campo non si svuota e l'utente può correggere a mano
      return s.replace(/^@/, '').replace(/^https?:\/\//, '').replace(/\/$/, '');
    } catch {}
  }
  return s.replace(/^@/, '');
}

export function parseIg(input) {
  if (!input) return { handle: '', url: '', isUrl: false };
  let s = input.trim();
  const m = s.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
  if (m) {
    const handle = m[1];
    const url = s.startsWith('http') ? s.split('?')[0] : `https://instagram.com/${handle}`;
    return { handle, url, isUrl: true };
  }
  let clean = s;
  if (clean.startsWith('@')) clean = clean.slice(1);
  const handle = clean.replace(/[^A-Za-z0-9._]/g, '');
  return { handle, url: handle ? `https://instagram.com/${handle}` : '', isUrl: false };
}

export function parseTikTok(input) {
  if (!input) return { handle: '', url: '', isUrl: false };
  let s = input.trim();
  // tiktok.com/@handle oppure tiktok.com/handle
  const m = s.match(/tiktok\.com\/@?([A-Za-z0-9._]+)/i);
  if (m) {
    const handle = m[1];
    const url = s.startsWith('http') ? s.split('?')[0] : `https://www.tiktok.com/@${handle}`;
    return { handle, url, isUrl: true };
  }
  let clean = s;
  if (clean.startsWith('@')) clean = clean.slice(1);
  const handle = clean.replace(/[^A-Za-z0-9._]/g, '');
  return { handle, url: handle ? `https://www.tiktok.com/@${handle}` : '', isUrl: false };
}

/**
 * Estrae un nome proprio dall'handle IG/TikTok.
 * Es. "angela.agnino_" → "Angela Agnino", "maria_giulia_99" → "Maria Giulia",
 * "giuliax" → "Giuliax".
 */
export function extractNameFromHandle(handle) {
  if (!handle) return '';
  let h = handle.replace(/[\d_]+$/, '');
  const parts = h.split(/[._\-]+/).filter(p => p.length > 0);
  if (parts.length === 0) return handle;
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  }
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
}

/**
 * Auto-rileva la piattaforma dal testo incollato e restituisce i dati normalizzati.
 * Riconosce:
 *  - URL instagram.com/...  → platform instagram
 *  - URL tiktok.com/@...    → platform tiktok
 *  - @handle generico       → instagram (default storico)
 *  - handle senza @         → instagram (default storico)
 *
 * @returns {{ platform: 'instagram'|'tiktok', handle: string, profile_url: string, name: string }}
 */
export function parsePlatform(raw) {
  if (!raw) return { platform: 'instagram', handle: '', profile_url: '', name: '' };
  const s = raw.trim();
  const isTikTokUrl = /tiktok\.com/i.test(s);
  if (isTikTokUrl) {
    const { handle, url } = parseTikTok(s);
    return { platform: 'tiktok', handle, profile_url: url, name: extractNameFromHandle(handle) };
  }
  const isIgUrl = /instagram\.com/i.test(s);
  if (isIgUrl) {
    const { handle, url } = parseIg(s);
    return { platform: 'instagram', handle, profile_url: url, name: extractNameFromHandle(handle) };
  }
  // Nessun URL esplicito: prova TikTok se inizia con @ e contiene caratteri tipici,
  // altrimenti default Instagram (comportamento storico).
  const { handle, url } = parseIg(s);
  return { platform: 'instagram', handle, profile_url: url, name: extractNameFromHandle(handle) };
}