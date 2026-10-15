// Route /notifiche → pagina portata da src/pages/Notifiche.jsx.
import { memo } from 'react';
import NotifichePage from '../../web/pages/Notifiche';
import Page from '../../web/components/layout/Page';

const Notifiche = memo(NotifichePage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <Notifiche />
  </Page>
);

export default function NotificheRoute() {
  return SCREEN;
}
