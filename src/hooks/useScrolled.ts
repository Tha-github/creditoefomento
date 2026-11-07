import { useCallback, useSyncExternalStore } from 'react';

function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

/** Indica se a página rolou além do limite. Só provoca nova renderização quando o resultado muda. */
export function useScrolled(threshold: number): boolean {
  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold]);
  return useSyncExternalStore(subscribeToScroll, getSnapshot);
}
