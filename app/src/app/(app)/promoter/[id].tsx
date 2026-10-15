// Route /promoter/:id → pagina portata da src/pages/PromoterDetail.jsx (RoleGate "promoter-detail").
import { memo } from 'react';
import PromoterDetailPage from '../../../web/pages/PromoterDetail';
import RoleGate from '../../../web/components/RoleGate';
import Page from '../../../web/components/layout/Page';

const PromoterDetail = memo(PromoterDetailPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <RoleGate routeName="promoter-detail">
      <PromoterDetail />
    </RoleGate>
  </Page>
);

export default function PromoterDetailRoute() {
  return SCREEN;
}
