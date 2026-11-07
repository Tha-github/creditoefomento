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

/** Botão de destaque do header, que abre o WhatsApp comercial. */
export const headerCtaLabel = 'Solicitar atendimento';
