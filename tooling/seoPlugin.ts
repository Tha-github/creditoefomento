import { readFileSync } from 'node:fs';

import { loadEnv, type Plugin } from 'vite';

import type { PageKey } from '../shared/site';
import {
  buildHead,
  buildRobots,
  buildSitemap,
  metaContentSecurityPolicy,
  parseSiteUrl,
} from './seo';

const PLACEHOLDER = '<!-- seo -->';

function pageForHtml(path: string): PageKey | null {
  if (path === '/index.html' || path === '/') return 'home';
  if (path.startsWith('/politica-de-privacidade/')) return 'privacy';
  return null;
}

/** CSP definida em vercel.json: a mesma política vale como header e como `<meta>`. */
function readContentSecurityPolicy(vercelJsonPath: string): string {
  const config = JSON.parse(readFileSync(vercelJsonPath, 'utf8')) as {
    headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
  };
  const value = config.headers
    .find((entry) => entry.source === '/(.*)')
    ?.headers.find((header) => header.key === 'Content-Security-Policy')?.value;
  if (!value) throw new Error('vercel.json: Content-Security-Policy não encontrada.');
  return value;
}

/**
 * Injeta title, metas, Open Graph, canonical, dados estruturados e a CSP no HTML,
 * e gera robots.txt e sitemap.xml. Endereços absolutos dependem de SITE_URL:
 * sem ela, são omitidos e o build avisa.
 */
export function seoPlugin(vercelJsonPath: string): Plugin {
  let siteUrl: string | null = null;
  let base = '/';
  let isBuild = false;
  let emitFiles = true;

  return {
    name: 'seo',
    configResolved(config) {
      const env = loadEnv(config.mode, config.envDir || process.cwd(), '');
      siteUrl = parseSiteUrl(env.SITE_URL);
      base = config.base;
      isBuild = config.command === 'build';
      emitFiles = isBuild && !config.build.ssr && config.mode !== 'showcase';
    },
    transformIndexHtml(html, context) {
      const page = pageForHtml(context.path);
      if (!page || !html.includes(PLACEHOLDER)) return html;
      // Em desenvolvimento, a CSP bloquearia os estilos que o Vite injeta para recarregar a página.
      const contentSecurityPolicy = isBuild
        ? metaContentSecurityPolicy(readContentSecurityPolicy(vercelJsonPath))
        : null;
      return html.replace(PLACEHOLDER, buildHead(page, siteUrl, { base, contentSecurityPolicy }));
    },
    generateBundle() {
      if (!emitFiles) return;
      if (!siteUrl) {
        this.warn(
          'SITE_URL não definida: canonical, og:url, og:image e sitemap.xml foram omitidos. Defina-a antes de publicar.',
        );
      }
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(siteUrl) });
      if (siteUrl) {
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(siteUrl) });
      }
    },
  };
}
