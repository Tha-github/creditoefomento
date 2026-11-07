import type { HTMLAttributes } from 'react';

import { cx } from '@/utils/cx';

import { Container, type ContainerSize } from './Container';
import styles from './Section.module.css';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: 'base' | 'soft' | 'graphite';
  spacing?: 'default' | 'compact';
  containerSize?: ContainerSize;
  /** Fio divisório no topo, para separar seções de mesma tonalidade. */
  divider?: boolean;
}

/** Padrão de seção: define fundo, ritmo vertical e largura do conteúdo. */
export function Section({
  tone = 'base',
  spacing = 'default',
  containerSize = 'default',
  divider = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      {...props}
      className={cx(styles.section, styles[tone], styles[spacing], divider && styles.divider, className)}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
