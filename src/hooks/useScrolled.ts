import { useCallback, useSyncExternalStore } from 'react';

function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

/** Indica se a página rolou além do limite. Só provoca nova renderização quando o resultado muda. */
export function useScrolled(threshold: number): boolean {
  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold]);
  // No HTML pré-renderizado a página está no topo: a hidratação parte do mesmo estado.
  return useSyncExternalStore(subscribeToScroll, getSnapshot, () => false);
}
