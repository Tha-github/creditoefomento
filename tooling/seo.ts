import { type PageKey, pages, site } from '../shared/site';

/**
 * Endereço público do site, sem barra final: `https://www.dominio.com.br` ou, no GitHub Pages,
 * `https://usuario.github.io/repositorio`. Erra cedo em vez de publicar endereços inválidos.
 */
export function parseSiteUrl(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error(`SITE_URL inválida: "${raw}". Use, por exemplo, https://www.dominio.com.br`);
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`SITE_URL deve usar http ou https: "${raw}"`);
  }
  if (url.search || url.hash) {
    throw new Error(`SITE_URL não pode ter parâmetros nem âncora: "${raw}"`);
  }
  return `${url.origin}${url.pathname.replace(/\/+$/, '')}`.toLowerCase();
}

/** Caminho de um arquivo de `public/`, com a base do site. */
function asset(base: string, file: string): string {
  return `${base}${file.replace(/^\//, '')}`;
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function meta(attribute: 'name' | 'property', key: string, content: string) {
  return `<meta ${attribute}="${key}" content="${escapeAttribute(content)}" />`;
}

/** Dados estruturados: somente fatos confirmados no briefing. Sem endereço, CNPJ ou avaliações. */
export function buildStructuredData(siteUrl: string | null) {
  const organizationId = siteUrl ? `${siteUrl}/#organizacao` : undefined;

  const organization = {
    '@type': 'Organization',
    ...(organizationId ? { '@id': organizationId, url: `${siteUrl}/` } : {}),
    name: site.name,
    description: site.description,
    areaServed: { '@type': 'Country', name: 'Brasil' },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.whatsapp.international,
      contactType: 'sales',
      areaServed: 'BR',
      availableLanguage: 'Portuguese',
    },
  };

  const graph: Record<string, unknown>[] = [organization];
  if (siteUrl) {
    graph.push({
      '@type': 'WebSite',
      '@id': `${siteUrl}/#site`,
      url: `${siteUrl}/`,
      name: site.name,
      inLanguage: site.language,
      publisher: { '@id': organizationId },
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

interface HeadOptions {
  /** Base do site, como em `vite.config.ts`. Ex.: `/` ou `/creditoefomento/`. */
  base?: string;
  /** CSP aplicada pelo próprio HTML: o único jeito de ter CSP em hospedagem sem headers, como o GitHub Pages. */
  contentSecurityPolicy?: string | null;
}

export function buildHead(
  pageKey: PageKey,
  siteUrl: string | null,
  { base = '/', contentSecurityPolicy = null }: HeadOptions = {},
): string {
  const page = pages[pageKey];
  const url = siteUrl ? `${siteUrl}${page.path}` : null;
  const image = siteUrl ? `${siteUrl}${site.ogImage.path}` : null;

  const tags = [
    // A CSP vem primeiro: só protege o que aparece depois dela no documento.
    contentSecurityPolicy
      ? `<meta http-equiv="Content-Security-Policy" content="${escapeAttribute(contentSecurityPolicy)}" />`
      : '',
    `<title>${escapeAttribute(page.title)}</title>`,
    meta('name', 'description', page.description),
    meta('name', 'robots', page.indexable ? 'index, follow' : 'noindex, follow'),
    meta('name', 'theme-color', site.themeColor),
    url ? `<link rel="canonical" href="${escapeAttribute(url)}" />` : '',
    `<link rel="icon" type="image/png" sizes="64x64" href="${asset(base, 'favicon.png')}" />`,
    `<link rel="apple-touch-icon" href="${asset(base, 'apple-touch-icon.png')}" />`,
    meta('property', 'og:type', 'website'),
    meta('property', 'og:locale', site.locale),
    meta('property', 'og:site_name', site.name),
    meta('property', 'og:title', page.title),
    meta('property', 'og:description', page.description),
    url ? meta('property', 'og:url', url) : '',
    image ? meta('property', 'og:image', image) : '',
    image ? meta('property', 'og:image:width', String(site.ogImage.width)) : '',
    image ? meta('property', 'og:image:height', String(site.ogImage.height)) : '',
    image ? meta('property', 'og:image:alt', site.ogImage.alt) : '',
    meta('name', 'twitter:card', image ? 'summary_large_image' : 'summary'),
    meta('name', 'twitter:title', page.title),
    meta('name', 'twitter:description', page.description),
    image ? meta('name', 'twitter:image', image) : '',
  ];

  if (pageKey === 'home') {
    // `<` escapado: impede que um texto encerre o bloco de script.
    const json = JSON.stringify(buildStructuredData(siteUrl)).replace(/</g, '\\u003c');
    tags.push(`<script type="application/ld+json">${json}</script>`);
  }

  return tags.filter(Boolean).join('\n    ');
}

/**
 * Versão da CSP para `<meta>`: sem as diretivas que o navegador ignora nesse formato
 * (`frame-ancestors`, `report-uri`, `sandbox`).
 */
export function metaContentSecurityPolicy(headerValue: string): string {
  return headerValue
    .split(';')
    .map((directive) => directive.trim())
    .filter((directive) => directive && !/^(frame-ancestors|report-uri|report-to|sandbox)\b/.test(directive))
    .join('; ');
}

export function buildRobots(siteUrl: string | null): string {
  return ['User-agent: *', 'Allow: /', 'Disallow: /api/', siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml` : '']
    .filter((line) => line !== '')
    .join('\n')
    .concat('\n');
}

export function buildSitemap(siteUrl: string): string {
  const urls = Object.values(pages)
    .filter((page) => page.indexable)
    .map((page) => `  <url>\n    <loc>${siteUrl}${page.path}</loc>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
