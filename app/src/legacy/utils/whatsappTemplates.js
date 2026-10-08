// ── Template messaggi WhatsApp "Smart" per VIBRA ────────────────────────────
// Ogni template compila un messaggio personalizzato a partire dal cliente e
// dal contesto (locale dell'ultima presenza, giorni di assenza, evento futuro).
// Il promoter può poi modificare il testo al volo prima di inviarlo.

export const WHATSAPP_TEMPLATES = [
  {
    id: 'invito',
    label: 'Invito Weekend',
    emoji: '🍾',
    build: ({ client, venue }) => {
      const name = client?.name?.split(' ')[0] || '';
      const venuePart = venue ? ` da ${venue}` : '';
      return `Ciao ${name}! 👋 Ti aspetto questo weekend alle serate Vibra${venuePart}. Fammi sapere se passi! 🍾`;
    },
  },
  {
    id: 'recupero',
    label: 'Recupero assenza',
    emoji: '👋',
    build: ({ client, daysAgo, lastVenue }) => {
      const name = client?.name?.split(' ')[0] || '';
      const daysPart = daysAgo ? ` È da ${daysAgo} giorni che non ti fai vedere` : ' È da un po\' che non ti fai vedere';
      const venuePart = lastVenue ? `, l'ultima volta da ${lastVenue}` : '';
      return `Ciao ${name}!${daysPart}${venuePart}. Ti va di passare a trovarci questo weekend? 😎`;
    },
  },
  {
    id: 'grazie',
    label: 'Grazie per la serata',
    emoji: '🙌',
    build: ({ client, venue }) => {
      const name = client?.name?.split(' ')[0] || '';
      const venuePart = venue ? ` da ${venue}` : '';
      return `Grazie mille per la serata${venuePart}, ${name}! 🙌 Spero ti sia divertito, a presto! 🍾`;
    },
  },
  {
    id: 'generico',
    label: 'Saluto veloce',
    emoji: '✏️',
    build: ({ client }) => {
      const name = client?.name?.split(' ')[0] || '';
      return `Ciao ${name}! 👋`;
    },
  },
];

export function getWhatsAppTemplate(id) {
  return WHATSAPP_TEMPLATES.find(t => t.id === id);
}

export function compileWhatsAppMessage(templateId, ctx = {}) {
  const t = getWhatsAppTemplate(templateId) || WHATSAPP_TEMPLATES[3];
  return t.build(ctx);
}

// Normalizza il numero: solo cifre. Se è un mobile italiano senza prefisso
// internazionale (10 cifre che iniziano per 3), antepone 39.
export function sanitizePhone(phone) {
  if (!phone) return '';
  let d = phone.replace(/[^0-9]/g, '');
  if (d.length === 10 && d.startsWith('3')) d = '39' + d;
  return d;
}

export function buildWhatsAppUrl(phone, message) {
  const d = sanitizePhone(phone);
  if (!d) return null;
  const base = `https://wa.me/${d}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function buildWhatsAppUrlForTemplate(templateId, ctx) {
  return buildWhatsAppUrl(ctx?.client?.phone, compileWhatsAppMessage(templateId, ctx));
}

export function computeDaysAgo(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
}