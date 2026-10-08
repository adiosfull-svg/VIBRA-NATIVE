# Inventario VIBRA (Base44) → vibra-mobile

Sorgente letta in sola lettura dall'app Base44 `69de4f1f7f53d9f187d01392` (464 file, ~80.000 righe).
Nessuna modifica è stata fatta su Base44.

## Dimensioni per area (righe)

| Area | Righe | Note porting |
|---|---|---|
| components/client | 12.192 | la parte più grande (Clienti, mappa, albero referral, import) |
| pages | 8.941 | 22 pagine, Clienti.jsx da sola 2.123 |
| components/ilmiovibra | 8.380 | guadagni, progressi, achievement, Vibra VS, team |
| components/promoter | 8.023 | grafici uPlot/recharts, heatmap, obiettivi |
| components/programmazione | 7.333 | Weekend, semine (drag & drop, flip card) |
| utils | 5.730 | **logica pura, copiabile 1:1** |
| base44/functions + shared | 4.432 | → Supabase Edge Functions (Deno, stesso linguaggio) |
| impostazioni | 3.293 | admin |
| lib + hooks | 5.513 | in gran parte specifici del web (scroll, sticky, gesture): da eliminare |
| resto (layout, report, instagram, dashboard, academy, ai, ui...) | ~15.000 | |

## Uso dell'SDK Base44 nel frontend

- Entità: `list` (129), `update` (96), `filter` (89), `create` (71), `delete` (39), `get` (17), `bulkUpdate`, `deleteMany`, `bulkCreate`, `aggregate` (1).
  Filtri **solo di uguaglianza** (nessun operatore Mongo) → adapter semplice su supabase-js.
- `subscribe` (realtime): Notification, AISuggestion, ProgrammazionePlan, Semina.
- `functions.invoke` (19 chiamate) → Edge Functions.
- `integrations.Core`: UploadFile/UploadPublicFile/UploadPrivateFile/CreateFileSignedUrl → Supabase Storage; InvokeLLM → Edge Function con Claude.
- `agents.*` (VibraGPT, consulente strategico) → Edge Function con Claude + tabella conversazioni.
- `auth.me/logout/redirectToLogin` → Supabase Auth.

## Librerie web → nativo

| Web | Usi | Nativo |
|---|---|---|
| lucide-react | 200 | lucide-react-native |
| @tanstack/react-query | 104 | invariato |
| date-fns | 98 | invariato |
| react-router-dom | 31 | expo-router |
| framer-motion | 26 | react-native-reanimated |
| recharts / uplot | 27 | grafici nativi (da scegliere: victory-native / gifted-charts) |
| jspdf | 3 | expo-print |
| @hello-pangea/dnd | 3 | react-native-draggable-flatlist |
| react-leaflet | 2 | react-native-maps |
| react-markdown | 2 | react-native-markdown-display |
| Radix/shadcn (components/ui) | — | primitive proprie con NativeWind |
| Stripe, Quill, html2canvas | 0 | non usati: non si portano |

## Logica riusabile senza modifiche
Senza dipendenze dal browser: `utils/` achievementLogic, rankSystem, goalProgress, goalTypes, clientBadges,
clientPrecomputed, clientTrend, clientAge, promoterAggregates, promoterRecords, promoterQuickInfo, reportData,
seminaParse, tables, vibraRanking, whatsappTemplates, dateUtils, relativeTime, academyContent;
`lib/campaniaLocations.js`; `base44/shared/clientStats.ts`, `promoterStats.ts`.
Con piccole modifiche (accesso a SDK/storage): clientRanking, chunkedBulk, creditEstimate, safeData, attendanceQueries, eventSync.

## Ruoli e accessi (`useRoleAccess`)
- admin: tutto; super4: tutte le sezioni, modifica solo clienti e il-mio-vibra.
- capogruppo / pr: niente dashboard, promoter, serate, locali, promoter-detail, admin-console.

## Dati (stima, ottobre 2026)
18 utenti; Client < 5.000; EventAttendance < 10.000; InstagramMessage > 10.000.

## Navigazione
Tab bar mobile: Dashboard (o Semine per i PR) · Weekend · Clienti · Cerca · Il Mio Vibra.
Menu laterale: Promoter, Messaggi, Serate, Locali, Formazione, Download, Vibra GPT, Notifiche, Impostazioni/Report/Admin (admin).
