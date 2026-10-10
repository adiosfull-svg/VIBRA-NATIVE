// Port di src/lib/vibragptConversations.js (convertito da scripts/port/codemod.mjs).
import { base44 } from '@/lib/base44';

import { storage as webStorage } from '@/web/shims/dom';

// Cache condivisa delle conversazioni VibraGPT: precaricata a idle dall'AppLayout
// così l'apertura di VibraGPT mostra la lista chat istantaneamente (senza spinner),
// poi ChatStrategica ricalcola in background per freschezza.

const AGENTS = ['consulente_strategico', 'consulente_strategico_lite'];
const HIDDEN_KEY = 'hidden_conv_ids';
const NAMES_KEY = 'conv_custom_names';

let cache = null;       // { conversations, fetchedAt }
let fetching = null;    // Promise in corso

export async function fetchVibraGPTConversations() {
  const [convsA, convsB] = await Promise.all([
    base44.agents.listConversations({ agent_name: AGENTS[0] }).catch(() => []),
    base44.agents.listConversations({ agent_name: AGENTS[1] }).catch(() => []),
  ]);
  const convs = [...(convsA || []), ...(convsB || [])]
    .sort((a, b) => (b.updated_date || '').localeCompare(a.updated_date || ''));

  const hiddenIds = JSON.parse(webStorage.getItem(HIDDEN_KEY) || '[]');
  const localNames = JSON.parse(webStorage.getItem(NAMES_KEY) || '{}');
  let serverNames = {};
  try {
    const settings = await base44.entities.AppSettings.list();
    settings.forEach(s => {
      if (s.key?.startsWith('chat_name_')) serverNames[s.key.replace('chat_name_', '')] = s.value;
    });
  } catch { /* read-only per tutti, non dovrebbe fallire */ }
  const mergedNames = { ...localNames, ...serverNames };
  webStorage.setItem(NAMES_KEY, JSON.stringify(mergedNames));

  const visible = convs
    .filter(c => !hiddenIds.includes(c.id))
    .map(c => ({ ...c, _customName: mergedNames[c.id] || c.metadata?.name || null }));

  cache = { conversations: visible, fetchedAt: Date.now() };
  return visible;
}

export function prefetchVibraGPTConversations() {
  if (cache || fetching) return fetching;
  fetching = fetchVibraGPTConversations().catch(() => { fetching = null; });
  return fetching;
}

export function getCachedConversations() {
  return cache?.conversations || null;
}