import { cx } from '@/utils/cx';

import styles from './FeatureList.module.css';

interface FeatureListProps {
  items: readonly string[];
  className?: string;
}

/** Lista de características, com fios divisórios e marcador dourado. */
export function FeatureList({ items, className }: FeatureListProps) {
  return (
    <ul className={cx(styles.list, className)}>
      {items.map((item) => (
        <li key={item} className={styles.item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
