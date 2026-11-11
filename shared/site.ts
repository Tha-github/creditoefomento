/**
 * Identidade e páginas do site, usadas pela interface e pela geração de SEO no build.
 * Sem dependências de ambiente: roda no navegador e no Node.
 */
export const site = {
  name: 'Crédito e Fomento',
  description:
    'Conheça as soluções financeiras da Crédito e Fomento. Antecipação de recebíveis, crédito empresarial e alternativas para as necessidades da sua empresa.',
  language: 'pt-BR',
  locale: 'pt_BR',
  themeColor: '#080808',
  whatsapp: {
    number: '5542998476331',
    display: '+55 42 99847-6331',
    /** Formato internacional, para dados estruturados. */
    international: '+55-42-99847-6331',
  },
  ogImage: {
    path: '/og-image.jpg',
    width: 1200,
    height: 630,
    alt: 'Crédito e Fomento: soluções financeiras para empresas.',
  },
  /**
   * Enquanto `false`, a Política de Privacidade mostra o aviso de versão preliminar,
   * fica fora do sitemap e recebe `noindex`. Só mudar depois da validação pela empresa.
   */
  privacyPolicyValidated: false,
} as const;

export interface SitePage {
  path: string;
  title: string;
  description: string;
  indexable: boolean;
}

export const pages = {
  home: {
    path: '/',
    title: 'Crédito e Fomento | Soluções Financeiras para Empresas',
    description: site.description,
    indexable: true,
  },
  privacy: {
    path: '/politica-de-privacidade/',
    title: 'Política de Privacidade | Crédito e Fomento',
    description:
      'Informações sobre os dados solicitados pelo formulário de contato da Crédito e Fomento e sobre o funcionamento conhecido do site.',
    indexable: site.privacyPolicyValidated,
  },
} as const satisfies Record<string, SitePage>;

export type PageKey = keyof typeof pages;
