// Config di riferimento: come l'originale ma senza il plugin Base44 (solo React + alias).
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';

const nativeLib = path.resolve(__dirname, '../../../app/src/lib');

export default defineConfig({
  logLevel: 'error',
  plugins: [react()],
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
