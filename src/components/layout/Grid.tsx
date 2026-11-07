import type { HTMLAttributes } from 'react';

import { cx } from '@/utils/cx';

import styles from './Grid.module.css';

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Colunas em telas largas. Sempre uma coluna no mobile. */
  columns?: 2 | 3;
}

export function Grid({ columns = 3, className, ...props }: GridProps) {
  return (
    <div
      {...props}
      className={cx(styles.grid, columns === 2 ? styles.two : styles.three, className)}
    />
  );
}
