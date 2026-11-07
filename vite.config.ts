import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { contactEndpointPlugin } from './server/contact/vitePlugin';

export default defineConfig(({ mode }) => ({
  plugins: [react(), contactEndpointPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
  // A vitrine do design system só é empacotada com `npm run build:showcase`:
  // o build de produção do site usa apenas index.html.
  build:
    mode === 'showcase'
      ? {
          outDir: 'dist-showcase',
          rolldownOptions: { input: 'design-system.html' },
        }
      : undefined,
}));
