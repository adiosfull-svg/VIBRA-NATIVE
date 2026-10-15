// Route /locali → pagina portata da src/pages/Locali.jsx (RoleGate "locali").
import { memo } from 'react';
import LocaliPage from '../../web/pages/Locali';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const Locali = memo(LocaliPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <RoleGate routeName="locali">
      <Locali />
    </RoleGate>
  </Page>
);

export default function LocaliRoute() {
  return SCREEN;
}
