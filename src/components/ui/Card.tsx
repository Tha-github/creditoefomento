import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { IconBadge } from '@/components/visual/IconBadge';
import { cx } from '@/utils/cx';

import styles from './Card.module.css';

interface CardProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  /** Ação do card, como um TextLink. */
  action?: ReactNode;
  /**
   * `featured` ocupa toda a linha do Grid e divide o conteúdo em duas colunas em telas largas.
   * `wide` é um card horizontal, com a ação à direita do texto em telas largas.
   */
  variant?: 'default' | 'featured' | 'wide';
  /** Estende a área clicável do link da ação a todo o card. */
  stretchedAction?: boolean;
  headingLevel?: 'h2' | 'h3' | 'h4';
  /** Conteúdo adicional, exibido entre a descrição e a ação. */
  children?: ReactNode;
  className?: string;
}

export function Card({
  title,
  description,
  icon,
  action,
  variant = 'default',
  stretchedAction = false,
  headingLevel: Heading = 'h3',
  children,
  className,
}: CardProps) {
  return (
    <article
      className={cx(
        styles.card,
        styles[variant],
        stretchedAction && styles.stretched,
        className,
      )}
    >
      <div className={styles.intro}>
        {icon && <IconBadge icon={icon} className={styles.badge} />}
        <Heading className={styles.title}>{title}</Heading>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {(children || action) && (
        <div className={styles.details}>
          {children}
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
    </article>
  );
}
