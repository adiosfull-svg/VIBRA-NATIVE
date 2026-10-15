// Route /promoter → pagina portata da src/pages/Promoter.jsx (RoleGate "promoter").
import { memo } from 'react';
import PromoterPage from '../../../web/pages/Promoter';
import RoleGate from '../../../web/components/RoleGate';
import Page from '../../../web/components/layout/Page';

const Promoter = memo(PromoterPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <RoleGate routeName="promoter">
      <Promoter />
    </RoleGate>
  </Page>
);

export default function PromoterRoute() {
  return SCREEN;
}
