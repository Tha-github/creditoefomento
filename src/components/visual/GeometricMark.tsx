import { cx } from '@/utils/cx';

import styles from './GeometricMark.module.css';

interface GeometricMarkProps {
  /** `ascent`: colunas em progressão, para crescimento. `structure`: planos sobrepostos, para solidez. */
  variant?: 'ascent' | 'structure';
  className?: string;
}

const ASCENT_HEIGHTS = [44, 72, 104, 128, 164, 208];

/** Composição geométrica decorativa, de traço fino. Oculta de leitores de tela. */
export function GeometricMark({ variant = 'ascent', className }: GeometricMarkProps) {
  return (
    <svg
      className={cx(styles.mark, className)}
      viewBox="0 0 240 240"
      width="240"
      height="240"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {variant === 'ascent' ? (
        <>
          <line className={styles.line} x1="0" y1="232" x2="240" y2="232" />
          {ASCENT_HEIGHTS.map((height, index) => {
            const x = 20 + index * 40;
            const isLast = index === ASCENT_HEIGHTS.length - 1;
            return (
              <line
                key={x}
                className={isLast ? styles.accent : styles.line}
                x1={x}
                y1={232}
                x2={x}
                y2={232 - height}
              />
            );
          })}
        </>
      ) : (
        <>
          <rect className={styles.line} x="8" y="56" width="176" height="176" />
          <rect className={styles.line} x="56" y="8" width="176" height="176" />
          <path className={styles.accent} d="M56 56h128v128" />
        </>
      )}
    </svg>
  );
}
