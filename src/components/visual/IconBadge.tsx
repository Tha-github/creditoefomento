import type { LucideIcon } from 'lucide-react';

import { cx } from '@/utils/cx';

import styles from './IconBadge.module.css';

interface IconBadgeProps {
  icon: LucideIcon;
  className?: string;
}

/** Ícone decorativo em moldura: o significado deve estar no texto ao lado. */
export function IconBadge({ icon: Icon, className }: IconBadgeProps) {
  return (
    <span className={cx(styles.badge, className)}>
      <Icon size={22} strokeWidth={1.5} aria-hidden />
    </span>
  );
}
