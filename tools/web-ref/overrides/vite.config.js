// Config di riferimento: come l'originale ma senza il plugin Base44 (solo React + alias).
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';

const nativeLib = path.resolve(__dirname, '../../../app/src/lib');

// Build della gara (tools/gara/build-ref.sh, VIBRA_GARA=1): ogni import() dinamico (pagine lazy)
// passa da window.__garaImp, così la sonda conta anche il codice caricato a richiesta come rete in corso.
const garaImports = {
  name: 'gara-imports',
  renderDynamicImport: () => ({ left: '(window.__garaImp||(p=>p))(import(', right: '))' }),
};

export default defineConfig({
  logLevel: 'error',
  plugins: [react(), ...(process.env.VIBRA_GARA ? [garaImports] : [])],
  resolve: {
    alias: {
      '@native': nativeLib,
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: { fs: { allow: [path.resolve(__dirname, '../../..')] } },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'dev'),
  },
});
