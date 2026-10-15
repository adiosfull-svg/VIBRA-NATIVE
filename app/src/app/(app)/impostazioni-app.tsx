// Route /impostazioni-app → pagina portata da src/pages/ImpostazioniApp.jsx (RoleGate "admin-console").
import { memo } from 'react';
import ImpostazioniAppPage from '../../web/pages/ImpostazioniApp';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const ImpostazioniApp = memo(ImpostazioniAppPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <RoleGate routeName="admin-console">
      <ImpostazioniApp />
    </RoleGate>
  </Page>
);

export default function ImpostazioniAppRoute() {
  return SCREEN;
}
