import { pages } from '@shared/site';

import { withBase } from '@/utils/paths';

/** Ids das âncoras da página. As seções e os links usam estes valores. */
export const sectionIds = {
  main: 'conteudo',
  hero: 'inicio',
  solutions: 'solucoes',
  about: 'sobre',
  differentials: 'diferenciais',
  process: 'como-funciona',
  approach: 'como-atuamos',
  faq: 'perguntas-frequentes',
  contact: 'contato',
  footer: 'rodape',
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const navItems: readonly NavItem[] = [
  { label: 'Soluções financeiras', href: `#${sectionIds.solutions}` },
  { label: 'Sobre nós', href: `#${sectionIds.about}` },
  { label: 'Contato', href: `#${sectionIds.contact}` },
];

export const footerNavItems: readonly NavItem[] = [
  { label: 'Sobre nós', href: `#${sectionIds.about}` },
  { label: 'Soluções financeiras', href: `#${sectionIds.solutions}` },
  { label: 'Como funciona', href: `#${sectionIds.process}` },
  { label: 'Perguntas frequentes', href: `#${sectionIds.faq}` },
  { label: 'Contato', href: `#${sectionIds.contact}` },
];

export const homeHref = withBase(pages.home.path);
export const privacyPolicyHref = withBase(pages.privacy.path);

/**
 * Prefixo dos links de âncora: vazio na home e o endereço da home nas demais páginas,
 * para que `#contato` leve à seção da home.
 */
export type LinkBase = '' | typeof homeHref;

export function anchorHref(base: LinkBase, hash: string): string {
  return `${base}${hash}`;
}

/** Botão de destaque do header, que abre o WhatsApp comercial. */
export const headerCtaLabel = 'Solicitar atendimento';
