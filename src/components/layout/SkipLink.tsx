import { sectionIds } from '@/config/navigation';

import styles from './SkipLink.module.css';

/** Permite a quem navega pelo teclado saltar o header. Só aparece ao receber foco. */
export function SkipLink() {
  return (
    <a className={styles.skipLink} href={`#${sectionIds.main}`}>
      Ir para o conteúdo
    </a>
  );
}
