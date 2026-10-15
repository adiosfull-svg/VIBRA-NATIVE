// Route /report → pagina portata da src/pages/Report.jsx (RoleGate "admin-console").
import { memo } from 'react';
import ReportPage from '../../web/pages/Report';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const Report = memo(ReportPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <RoleGate routeName="admin-console">
      <Report />
    </RoleGate>
  </Page>
);

export default function ReportRoute() {
  return SCREEN;
}
