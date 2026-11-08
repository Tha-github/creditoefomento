import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

import { contactEndpointPlugin } from './server/contact/vitePlugin';
import { previewSecurityHeaders } from './tooling/securityHeaders';
import { seoPlugin } from './tooling/seoPlugin';

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

/** Caminho base do site: `/` em domínio próprio, `/creditoefomento/` no GitHub Pages. */
function resolveBase(raw: string | undefined): string {
  if (!raw?.trim()) return '/';
  const base = `/${raw.trim().replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
  if (!/^\/[\w\-/]*$/.test(base)) throw new Error(`BASE_PATH inválido: "${raw}"`);
  return base;
}

function buildOptions(mode: string, isSsrBuild: boolean | undefined) {
  // Fontes nunca são embutidas como `data:`: assim a CSP aceita fontes só da própria origem.
  const assetsInlineLimit = (file: string) => (file.endsWith('.woff2') ? false : undefined);

  // A vitrine do design system só é empacotada com `npm run build:showcase`.
  if (mode === 'showcase') {
    return {
      outDir: 'dist-showcase',
      assetsInlineLimit,
      rolldownOptions: { input: 'design-system.html' },
    };
  }
  // O build de servidor usa a entrada de `--ssr` e serve apenas à pré-renderização.
  if (isSsrBuild) return { assetsInlineLimit };
  return {
    assetsInlineLimit,
    rolldownOptions: {
      input: {
        main: fromRoot('./index.html'),
        privacy: fromRoot('./politica-de-privacidade/index.html'),
      },
    },
  };
}

export default defineConfig(({ mode, isSsrBuild }) => ({
  base: resolveBase(loadEnv(mode, process.cwd(), '').BASE_PATH),
  // Site de múltiplas páginas: endereço inexistente responde 404, e não a home com status 200.
  appType: 'mpa',
  plugins: [react(), contactEndpointPlugin(), seoPlugin(fromRoot('./vercel.json'))],
  resolve: {
    alias: {
      '@': fromRoot('./src'),
      '@shared': fromRoot('./shared'),
    },
  },
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  build: buildOptions(mode, isSsrBuild),
  // Mesmos headers de produção (vercel.json), para testar a CSP localmente.
  preview: {
    headers: previewSecurityHeaders(fromRoot('./vercel.json')),
  },
}));
