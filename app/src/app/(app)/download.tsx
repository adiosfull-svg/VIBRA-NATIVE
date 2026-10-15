// Route /download → pagina portata da src/pages/Download.jsx.
import { memo } from 'react';
import DownloadPage from '../../web/pages/Download';
import Page from '../../web/components/layout/Page';

const Download = memo(DownloadPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <Download />
  </Page>
);

export default function DownloadRoute() {
  return SCREEN;
}
