import type { LucideIcon } from 'lucide-react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import { cx } from '@/utils/cx';
import { externalLinkHint, externalLinkProps } from '@/utils/links';

import styles from './Button.module.css';

interface ButtonStyleProps {
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
  /** Ícone à direita do texto. */
  icon?: LucideIcon;
  /** Ocupa toda a largura disponível. */
  fullWidth?: boolean;
}

function buttonClassName(
  { variant = 'primary', size = 'md', fullWidth = false }: ButtonStyleProps,
  className?: string,
) {
  return cx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className);
}

function ButtonIcon({ icon: Icon }: { icon: LucideIcon | undefined }): ReactNode {
  return Icon ? <Icon className={styles.icon} size={18} strokeWidth={1.75} aria-hidden /> : null;
}

type ButtonProps = ButtonStyleProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    /**
     * Ação em andamento. O botão continua focável, para o foco não se perder durante o envio,
     * e quem o usa deve ignorar novos acionamentos.
     */
    loading?: boolean;
  };

/** Para ações na própria página, como enviar um formulário. Para navegação, usar ButtonLink. */
export function Button({
  variant,
  size,
  icon,
  fullWidth,
  loading = false,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      className={cx(
        buttonClassName({ variant, size, fullWidth }, className),
        loading && styles.loading,
      )}
    >
      {children}
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : <ButtonIcon icon={icon} />}
    </button>
  );
}

type ButtonLinkProps = ButtonStyleProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    /** Abre em nova aba com `rel` seguro. */
    external?: boolean;
  };

export function ButtonLink({
  variant,
  size,
  icon,
  fullWidth,
  external = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      {...props}
      {...(external ? externalLinkProps : {})}
      className={buttonClassName({ variant, size, fullWidth }, className)}
    >
      {children}
      {external && <span className="visually-hidden"> {externalLinkHint}</span>}
      <ButtonIcon icon={icon} />
    </a>
  );
}
