import type { HTMLAttributes } from 'react';

import { cx } from '@/utils/cx';

import styles from './Container.module.css';

export type ContainerSize = 'narrow' | 'default' | 'wide';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

export function Container({ size = 'default', className, ...props }: ContainerProps) {
  return <div {...props} className={cx(styles.container, styles[size], className)} />;
}
