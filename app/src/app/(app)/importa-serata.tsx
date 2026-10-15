// Route /importa-serata → pagina portata da src/pages/ImportaSerataBatch.jsx (RoleGate "serate").
import { memo } from 'react';
import ImportaSerataBatchPage from '../../web/pages/ImportaSerataBatch';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const ImportaSerataBatch = memo(ImportaSerataBatchPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <RoleGate routeName="serate">
      <ImportaSerataBatch />
    </RoleGate>
  </Page>
);

export default function ImportaSerataBatchRoute() {
  return SCREEN;
}
