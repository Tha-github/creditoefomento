import { ArrowRight } from 'lucide-react';
import type { AnchorHTMLAttributes } from 'react';

import { cx } from '@/utils/cx';
import { externalLinkHint, externalLinkProps } from '@/utils/links';

import styles from './TextLink.module.css';

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Abre em nova aba com `rel` seguro. */
  external?: boolean;
}

/** Link de ação, com seta. Links dentro de parágrafos usam o elemento `a` sem este componente. */
export function TextLink({ external = false, className, children, ...props }: TextLinkProps) {
  return (
    <a
      {...props}
      {...(external ? externalLinkProps : {})}
      className={cx(styles.link, className)}
    >
      <span className={styles.label}>{children}</span>
      {external && <span className="visually-hidden"> {externalLinkHint}</span>}
      <ArrowRight className={styles.icon} size={16} strokeWidth={1.75} aria-hidden />
    </a>
  );
}
