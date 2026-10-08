// Stima crediti consumati per chiamata InvokeLLM in base al modello.
// Allineato ai costi reali della piattaforma Base44.
const CREDIT_BY_MODEL = {
  automatic: 1,
  gpt_5_mini: 1,
  gemini_3_flash: 5,
  gemini_3_1_pro: 10,
  gpt_5_4: 10,
  gpt_5_6_sol: 10,
  gpt_5_6_luna: 10,
  claude_sonnet_4_6: 15,
  claude_sonnet_5: 15,
  claude_opus_4_6: 30,
  claude_opus_4_7: 30,
  claude_opus_4_8: 30,
  claude_opus_5: 40,
};

export function estimateCredits(model) {
  if (!model || model === 'automatic') return 1;
  return CREDIT_BY_MODEL[model] || 1;
}

// Crea un log di consumo crediti (fire-and-forget, non blocca l'UI).
// Usato dalle chiamate AI frontend (RicercaAI, ImportaSerataBatch) per
// allineare il pannello admin con il consumo reale delle chiamate.
export function logCreditUsage({ base44, promoterId, promoterName, feature, model, detail }) {
  try {
    base44.entities.CreditUsageLog.create({
      promoter_id: promoterId || 'unknown',
      promoter_name: promoterName || '',
      feature,
      credits: estimateCredits(model),
      detail: detail || '',
    }).catch(() => {});
  } catch {}
}