// Port di src/components/layout/HomepageRouter.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { useAuth } from '@/lib/auth';
import { Navigate } from '@/web/router';
const Dashboard = React.lazy(() => import('@/web/pages/Dashboard'));

export default function HomepageRouter() {
  const { user } = useAuth();

  if (!user) return null;

  // Admin e super4 vedono Dashboard, altri reindirizzati a il-mio-vibra
  if (user.role === 'admin' || user.role === 'super4') {
    return <Dashboard />;
  }

  // Tutti gli altri ruoli (capogruppo, pr) reindirizzati a il-mio-vibra
  return <Navigate to="/il-mio-vibra" replace />;
}