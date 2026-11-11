import { describe, expect, it } from 'vitest';

import { pages, site } from '../shared/site';
import {
  buildHead,
  buildRobots,
  buildSitemap,
  buildStructuredData,
  metaContentSecurityPolicy,
  parseSiteUrl,
} from './seo';

const URL = 'https://www.exemplo.test';

describe('parseSiteUrl', () => {
  it('aceita a origem, com ou sem barra', () => {
    expect(parseSiteUrl('https://www.exemplo.test')).toBe(URL);
    expect(parseSiteUrl('https://www.exemplo.test/')).toBe(URL);
  });

  it('aceita subcaminho, como no GitHub Pages, sempre em minúsculas', () => {
    expect(parseSiteUrl('https://Tha-github.github.io/creditoefomento/')).toBe(
      'https://tha-github.github.io/creditoefomento',
    );
  });

  it('trata ausência como não configurada', () => {
    expect(parseSiteUrl(undefined)).toBeNull();
    expect(parseSiteUrl('  ')).toBeNull();
  });

  it.each(['exemplo.test', 'ftp://exemplo.test', 'https://exemplo.test/?a=1', 'https://exemplo.test/#x'])(
    'recusa %s',
    (raw) => {
      expect(() => parseSiteUrl(raw)).toThrow();
    },
  );
});

describe('subcaminho e CSP', () => {
  const PAGES_URL = 'https://tha-github.github.io/creditoefomento';

  it('monta canonical, imagem e ícones com o subcaminho', () => {
    const head = buildHead('privacy', PAGES_URL, { base: '/creditoefomento/' });
    expect(head).toContain(`href="${PAGES_URL}/politica-de-privacidade/"`);
    expect(buildHead('home', PAGES_URL)).toContain(`content="${PAGES_URL}/og-image.jpg"`);
    expect(head).toContain('href="/creditoefomento/favicon.png"');
    expect(head).toContain('href="/creditoefomento/apple-touch-icon.png"');
  });

  it('a CSP em <meta> vem antes de tudo e sem diretivas que o <meta> ignora', () => {
    const csp = metaContentSecurityPolicy("default-src 'self'; frame-ancestors 'none'; object-src 'none'");
    expect(csp).toBe("default-src 'self'; object-src 'none'");
    const head = buildHead('home', null, { contentSecurityPolicy: csp });
    expect(head.startsWith('<meta http-equiv="Content-Security-Policy"')).toBe(true);
  });

  it('sem CSP informada, não inclui a meta', () => {
    expect(buildHead('home', null)).not.toContain('http-equiv');
  });
});

describe('buildHead', () => {
  it('usa o title e a description definidos para a home', () => {
    const head = buildHead('home', URL);
    expect(head).toContain('<title>Crédito e Fomento | Soluções Financeiras para Empresas</title>');
    expect(head).toContain(`content="${site.description}"`);
    expect(head).toContain(`<link rel="canonical" href="${URL}/" />`);
    expect(head).toContain(`content="${URL}/og-image.jpg"`);
    expect(head).toContain('application/ld+json');
  });

  it('sem SITE_URL, omite endereços absolutos em vez de inventá-los', () => {
    const head = buildHead('home', null);
    expect(head).not.toContain('canonical');
    expect(head).not.toContain('og:url');
    expect(head).not.toContain('og:image');
    expect(head).toContain('content="summary"');
  });

  it('a política preliminar não é indexada', () => {
    expect(pages.privacy.indexable).toBe(site.privacyPolicyValidated);
    if (!site.privacyPolicyValidated) {
      expect(buildHead('privacy', URL)).toContain('content="noindex, follow"');
    }
    expect(buildHead('privacy', URL)).not.toContain('application/ld+json');
  });

  it('escapa aspas e sinais nos atributos', () => {
    expect(buildHead('home', URL)).not.toMatch(/content="[^"]*<[^"]*"/);
  });
});

describe('dados estruturados', () => {
  it('trazem apenas fatos confirmados', () => {
    const json = JSON.stringify(buildStructuredData(URL));
    expect(json).toContain('"name":"Crédito e Fomento"');
    expect(json).toContain('+55-42-99847-6331');
    for (const invented of ['address', 'taxID', 'legalName', 'aggregateRating', 'review', 'foundingDate', 'logo']) {
      expect(json).not.toContain(`"${invented}"`);
    }
  });
});

describe('robots e sitemap', () => {
  it('robots aponta o sitemap somente com SITE_URL', () => {
    expect(buildRobots(URL)).toContain(`Sitemap: ${URL}/sitemap.xml`);
    expect(buildRobots(null)).not.toContain('Sitemap');
    expect(buildRobots(null)).toContain('Disallow: /api/');
  });

  it('o sitemap lista apenas páginas indexáveis', () => {
    const sitemap = buildSitemap(URL);
    expect(sitemap).toContain(`<loc>${URL}/</loc>`);
    expect(sitemap.includes('/politica-de-privacidade/')).toBe(site.privacyPolicyValidated);
  });
});
