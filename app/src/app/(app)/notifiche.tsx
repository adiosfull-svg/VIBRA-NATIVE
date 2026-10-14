// Route /notifiche → pagina portata da src/pages/Notifiche.jsx.
import { memo } from 'react';
import NotifichePage from '../../web/pages/Notifiche';
import Page from '../../web/components/layout/Page';

const Notifiche = memo(NotifichePage);

export default function NotificheRoute() {
  return (
    <Page>
      <Notifiche />
    </Page>
  );
}
