import { type ReactNode, StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

/**
 * No build, o HTML chega pré-renderizado e o React o assume (hidratação).
 * Em desenvolvimento, o elemento chega vazio e é renderizado do zero.
 */
export function mount(page: ReactNode) {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Elemento #root não encontrado.');
  }

  // Sinaliza que há JavaScript: estados iniciais de animação só se aplicam com esta classe,
  // para o conteúdo pré-renderizado nunca ficar invisível sem ele.
  document.documentElement.classList.add('js');

  const tree = <StrictMode>{page}</StrictMode>;
  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, tree);
  } else {
    createRoot(rootElement).render(tree);
  }
}
