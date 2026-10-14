// Route /download → pagina portata da src/pages/Download.jsx.
import { memo } from 'react';
import DownloadPage from '../../web/pages/Download';
import Page from '../../web/components/layout/Page';

const Download = memo(DownloadPage);

export default function DownloadRoute() {
  return (
    <Page>
      <Download />
    </Page>
  );
}
