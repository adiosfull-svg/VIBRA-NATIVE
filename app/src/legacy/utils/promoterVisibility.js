/**
 * Helper di visibilità statistiche promoter.
 *
 * Un promoter è visibile nei grafici storici aziendali se:
 *  - è "attivo", OPPURE
 *  - è "inattivo" ma ha show_in_stats !== false (toggle esplicito nel form).
 *
 * `show_in_stats !== false` gestisce i record preesistenti (undefined) come
 * visibili di default, allineandosi al comportamento richiesto: mettendo un
 * promoter inattivo, le sue statistiche restano nei grafici storici a meno che
 * l'admin non spenga esplicitamente il toggle.
 */
export const isVisibleInStats = (p) => !!p && (p.status === 'attivo' || p.show_in_stats !== false);