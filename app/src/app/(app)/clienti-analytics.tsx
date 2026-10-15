// Route /clienti-analytics → pagina portata da src/pages/ClientiAnalytics.jsx (RoleGate "clienti-analytics").
import { memo } from 'react';
import ClientiAnalyticsPage from '../../web/pages/ClientiAnalytics';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const ClientiAnalytics = memo(ClientiAnalyticsPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <RoleGate routeName="clienti-analytics">
      <ClientiAnalytics />
    </RoleGate>
  </Page>
);

export default function ClientiAnalyticsRoute() {
  return SCREEN;
}
