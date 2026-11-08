/**
 * Caminho base do site, definido no build (`BASE_PATH`): `/` em domínio próprio,
 * `/creditoefomento/` no GitHub Pages. Sempre começa e termina com `/`.
 */
export const basePath = import.meta.env.BASE_URL;

/** Caminho interno com a base do site. Ex.: `withBase('politica-de-privacidade/')`. */
export function withBase(path: string): string {
  return `${basePath}${path.replace(/^\//, '')}`;
}
