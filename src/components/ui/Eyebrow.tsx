import type { ReactNode } from 'react';

import { cx } from '@/utils/cx';

import styles from './Eyebrow.module.css';

interface EyebrowProps {
  children: ReactNode;
  /** Use um nível de título quando o rótulo nomear o bloco que o segue. */
  as?: 'p' | 'h3';
  id?: string;
  className?: string;
}

/** Rótulo curto acima de títulos. */
export function Eyebrow({ children, as: Tag = 'p', id, className }: EyebrowProps) {
  return (
    <Tag id={id} className={cx(styles.eyebrow, className)}>
      {children}
    </Tag>
  );
}
