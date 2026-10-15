// Route /serate → pagina portata da src/pages/Serate.jsx (RoleGate "serate").
import { memo } from 'react';
import { diagMark } from '../../lib/testDiag';
import SeratePage from '../../web/pages/Serate';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const Serate = memo(SeratePage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <RoleGate routeName="serate">
      <Serate />
    </RoleGate>
  </Page>
);

export default function SerateRoute() {
  diagMark('route serate');
  return SCREEN;
}
