import { useEffect, useState } from 'react';

/**
 * Indica se ao menos um dos elementos, buscados por id, está na tela. Continua observando.
 * Começa como `true`: quem usa só reage a uma confirmação de que nenhum está visível.
 * A lista precisa ser estável entre renderizações.
 */
export function useAnyInView(ids: readonly string[]): boolean {
  const [anyInView, setAnyInView] = useState(true);

  useEffect(() => {
    const visible = new Set<Element>();

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setAnyInView(visible.size > 0);
    });

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [ids]);

  return anyInView;
}
