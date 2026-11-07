import type { ReactNode } from 'react';

import { cx } from '@/utils/cx';

import { Eyebrow } from './Eyebrow';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Nível semântico, independente do tamanho visual. */
  as?: 'h1' | 'h2' | 'h3';
  size?: 'md' | 'lg' | 'xl' | 'display';
  /** `split` coloca a descrição deslocada à direita do título em telas largas. */
  layout?: 'stacked' | 'split';
  /** Para ligar a seção ao título com `aria-labelledby`. */
  titleId?: string;
  className?: string;
}

export function SectionHeading({
  title,
  eyebrow,
  description,
  as: Heading = 'h2',
  size = 'lg',
  layout = 'stacked',
  titleId,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cx(styles.heading, styles[layout], className)}>
      {eyebrow && <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow>}
      <Heading id={titleId} className={cx(styles.title, styles[size])}>
        {title}
      </Heading>
      {description && <p className={styles.description}>{description}</p>}
    </header>
  );
}
