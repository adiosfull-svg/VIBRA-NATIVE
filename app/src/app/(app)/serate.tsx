// Route /serate → pagina portata da src/pages/Serate.jsx (RoleGate "serate").
import { memo } from 'react';
import SeratePage from '../../web/pages/Serate';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const Serate = memo(SeratePage);

export default function SerateRoute() {
  return (
    <Page>
      <RoleGate routeName="serate">
        <Serate />
      </RoleGate>
    </Page>
  );
}
