import { cx } from '@/utils/cx';

import styles from './Divider.module.css';

interface DividerProps {
  /** `line` ocupa toda a largura; `accent` é um fio dourado curto. */
  variant?: 'line' | 'accent';
  className?: string;
}

export function Divider({ variant = 'line', className }: DividerProps) {
  return <hr className={cx(styles.divider, styles[variant], className)} />;
}
