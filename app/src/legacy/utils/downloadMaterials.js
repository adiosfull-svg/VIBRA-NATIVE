import { nav as webNavigator, win as webWindow } from '@/web/shims/dom';
// Sorgente unico per i materiali della sezione Download (loghi Vibra, loghi locali,
// sfondi, materiali grafici + item caricati a runtime nel DB). Condiviso tra la
// pagina Download e la ricerca globale (VibraSearch) così i loghi sono cercabili
// da ovunque senza duplicare l'elenco.

export const BASE_IMG = 'https://media.base44.com/images/public/69de4f1f7f53d9f187d01392/';
export const BASE_FILE = 'https://media.base44.com/files/public/69de4f1f7f53d9f187d01392/';

export const STATIC_SECTIONS = [
  {
    id: 'vibra-loghi',
    label: 'Loghi Vibra',
    icon: '🟣',
    color: '#8b5cf6',
    items: [
      { name: 'VIBRA — Logo Principale (PNG)',    file: '1f893c1df_VIBRAPERFETTO.png',               type: 'img',  preview: BASE_IMG + '1f893c1df_VIBRAPERFETTO.png',               bg: 'bg-purple-900' },
      { name: 'VIBRA — Logo Variante 2 (PNG)',    file: '50d3409fc_VIBRAPERFETTO2.png',              type: 'img',  preview: BASE_IMG + '50d3409fc_VIBRAPERFETTO2.png',              bg: 'bg-purple-900' },
      { name: 'VIBRA — Logo PNG trasparente',     file: '2a79d5c23_VIBRAPNG.png',                   type: 'img',  preview: BASE_IMG + '2a79d5c23_VIBRAPNG.png',                   bg: 'bg-white' },
      { name: 'VIBRA — Logo Back (PNG)',          file: 'b8def5b8f_LOGOBACK.png',                   type: 'img',  preview: BASE_IMG + 'b8def5b8f_LOGOBACK.png',                   bg: 'bg-white' },
      { name: 'VIBRA — Logo Note piccolo (PNG)',  file: '40405e9fe_LOGOPICCOLONOTE.png',             type: 'img',  preview: BASE_IMG + '40405e9fe_LOGOPICCOLONOTE.png',             bg: 'bg-white' },
      { name: 'VIBRA — The League (PNG)',         file: '1eea4aeba_VIBRATHELEAGUE.png',              type: 'img',  preview: BASE_IMG + '1eea4aeba_VIBRATHELEAGUE.png',              bg: 'bg-white' },
      { name: 'VIBRA — Weekend (PNG)',            file: '978f1af55_Senzatitolo-1.jpg',              type: 'img',  preview: BASE_IMG + '978f1af55_Senzatitolo-1.jpg',              bg: 'bg-purple-900' },
    ],
  },
  {
    id: 'loghi-locali',
    label: 'Loghi Locali',
    icon: '🎵',
    color: '#f97316',
    items: [
      { name: 'Frontemare — Logo Black (PNG)',           file: '7e8b3dad3_frontemarelogoblack.png',              type: 'img', preview: BASE_IMG + '7e8b3dad3_frontemarelogoblack.png',              bg: 'bg-white' },
      { name: 'Frontemare — Logo White (PNG)',           file: 'b191a1ad3_frontemarelogowhite.png',             type: 'img', preview: BASE_IMG + 'b191a1ad3_frontemarelogowhite.png',             bg: 'bg-gray-800' },
      { name: 'Frontemare — Logo vettoriale (PDF)',      file: 'cddf6eae1_frontemarelogo_260116_155012.pdf',    type: 'file', preview: BASE_IMG + '7e8b3dad3_frontemarelogoblack.png',              bg: 'bg-white' },
      { name: 'Mantra — Logo Black (PNG)',               file: '679d3611b_Mantra2026_black.png',                type: 'img', preview: BASE_IMG + '679d3611b_Mantra2026_black.png',                bg: 'bg-white' },
      { name: 'Mantra — Logo White (PNG)',               file: 'e729e77ca_Mantra2026_white.png',               type: 'img', preview: BASE_IMG + 'e729e77ca_Mantra2026_white.png',               bg: 'bg-black' },
      { name: 'Mantra — Sanctuary Beach (PDF)',          file: 'aa3937b07_Mantra4.pdf',                        type: 'file', preview: BASE_IMG + '679d3611b_Mantra2026_black.png',                bg: 'bg-white' },
      { name: 'Hi.Club BRASS — Logo (PNG)',              file: '88323ccd5_HICLUB.png',                         type: 'img', preview: BASE_IMG + '88323ccd5_HICLUB.png',                         bg: 'bg-white' },
      { name: 'Nemesi — Logo Black (PNG)',               file: '8d35cad0f_nemesiblack.png',                    type: 'img', preview: BASE_IMG + '8d35cad0f_nemesiblack.png',                    bg: 'bg-white' },
      { name: 'Superstar — Logo v1 (PNG)',               file: 'b43415ec2_superstar.png',                      type: 'img', preview: BASE_IMG + 'b43415ec2_superstar.png',                      bg: 'bg-white' },
      { name: 'Superstar — Logo v2 (PNG)',               file: '9894eb649_superstar2.png',                     type: 'img', preview: BASE_IMG + '9894eb649_superstar2.png',                     bg: 'bg-white' },
      { name: 'Bikini La Domenica — Logo (PNG)',         file: 'd5650a49b_BIKINILADOMENICA_WHITE.png',         type: 'img', preview: BASE_IMG + 'd5650a49b_BIKINILADOMENICA_WHITE.png',         bg: 'bg-gray-700' },
      { name: 'BRASS — Logo (PNG)',                      file: '39b78b4cc_BRASS.png',                          type: 'img', preview: BASE_IMG + '39b78b4cc_BRASS.png',                          bg: 'bg-gray-900' },
      { name: 'Toma — Logo (PNG)',                       file: 'a1039a76d_IMG_4521-removebg-preview.png',      type: 'img', preview: BASE_IMG + 'a1039a76d_IMG_4521-removebg-preview.png',      bg: 'bg-white' },
    ],
  },
  {
    id: 'sfondi',
    label: 'Sfondi',
    icon: '🖼️',
    color: '#0ea5e9',
    items: [
      { name: 'Sfondo Vibra HD v1 (PNG)', file: '0229f99cd_SfondoVibraHD.png',  type: 'img', preview: BASE_IMG + '0229f99cd_SfondoVibraHD.png',  bg: 'bg-purple-900' },
      { name: 'Sfondo Vibra HD v2 (PNG)', file: '2d744921d_SfondoVibraHD2.png', type: 'img', preview: BASE_IMG + '2d744921d_SfondoVibraHD2.png', bg: 'bg-purple-900' },
    ],
  },
  {
    id: 'materiali',
    label: 'Materiali Grafici',
    icon: '🎨',
    color: '#22c55e',
    items: [
      { name: 'Le Nostre Serate — Grafica (PNG)', file: '63a0c1980_CopiadiLENOSTRESERATE.png', type: 'img', preview: BASE_IMG + '63a0c1980_CopiadiLENOSTRESERATE.png', bg: 'bg-purple-900' },
    ],
  },
];

// Normalizza un item (statico o DB) in una forma piatta per la ricerca e il download.
export function normalizeDownloadItem(item) {
  const isStatic = !item.file_url;
  const isFile = isStatic ? item.type === 'file' : item.file_type === 'file';
  const url = isStatic
    ? (isFile ? BASE_FILE + item.file : BASE_IMG + item.file)
    : item.file_url;
  const preview = isStatic
    ? item.preview
    : (item.file_type === 'img' ? item.file_url : null);
  return {
    id: item.id || item.file,
    name: item.name,
    url,
    preview,
    isImage: !isFile,
    sectionId: item.section_id,
    sectionLabel: item.section_label,
    sectionIcon: item.section_icon,
    sectionColor: item.section_color,
  };
}

// ── Condivisione verso app esterne (WhatsApp, Telegram, Mail...) via Web Share API ──
// Usata da Download, ricerca (VibraSearch), PiantinaFullscreen e Le mie note.
const SHARE_MIME = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp',
  gif: 'image/gif', svg: 'image/svg+xml', pdf: 'application/pdf',
};

function safeShareName(name) {
  return String(name || 'file').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80) || 'file';
}

// Condivide un file (immagine/PDF) come allegato. Se il device non supporta la
// condivisione di file, condivide il link; in ultima istanza apre il file in una scheda.
// Ritorna: 'shared' | 'cancelled' | 'opened'.
export async function shareMedia(url, name) {
  if (!url) return 'cancelled';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('fetch failed');
    const blob = await res.blob();
    const urlExt = (url.split('?')[0].split('.').pop() || '').toLowerCase();
    const mimeExt = (blob.type.split('/')[1] || '').split('+')[0].replace('jpeg', 'jpg');
    const ext = /^[a-z0-9]{2,4}$/.test(urlExt) ? urlExt : (mimeExt || 'png');
    const type = blob.type && blob.type !== 'application/octet-stream'
      ? blob.type
      : (SHARE_MIME[ext] || blob.type);
    const file = new File([blob], `${safeShareName(name)}.${ext}`, { type });
    if (webNavigator.canShare && webNavigator.canShare({ files: [file] })) {
      await webNavigator.share({ files: [file], title: name });
      return 'shared';
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancelled';
  }
  try {
    if (webNavigator.share) {
      await webNavigator.share({ title: name, url });
      return 'shared';
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancelled';
  }
  webWindow.open(url, '_blank', 'noopener,noreferrer');
  return 'opened';
}

// Condivide un testo (es. formule di entrata). Senza Web Share API lo copia negli appunti.
// Ritorna: 'shared' | 'copied' | 'cancelled' | 'error'.
export async function shareText(text, title) {
  try {
    if (webNavigator.share) {
      await webNavigator.share({ title, text });
      return 'shared';
    }
    await webNavigator.clipboard.writeText(text);
    return 'copied';
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancelled';
    return 'error';
  }
}

// Lista piatta di tutti i materiali (statici + DB) pronti per la ricerca.
export function buildAllDownloadItems(dbItems = []) {
  const items = [];
  STATIC_SECTIONS.forEach(sec => {
    (sec.items || []).forEach(it =>
      items.push(normalizeDownloadItem({
        ...it,
        section_id: sec.id,
        section_label: sec.label,
        section_icon: sec.icon,
        section_color: sec.color,
      }))
    );
  });
  dbItems.forEach(it => items.push(normalizeDownloadItem(it)));
  return items;
}
