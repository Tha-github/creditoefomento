import { ArrowRight, Menu, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { headerCtaLabel, navItems } from '@/config/navigation';
import { buildWhatsAppUrl } from '@/integrations/whatsapp';

import styles from './MobileMenu.module.css';

const DESKTOP_QUERY = '(min-width: 60em)';

interface MobileMenuProps {
  className?: string;
}

/**
 * Usa `dialog` modal: o navegador cuida da captura de foco, do fechamento com Esc,
 * da devolução do foco ao botão e de tornar o restante da página inerte.
 */
export function MobileMenu({ className }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const close = () => dialogRef.current?.close();

  // O menu não existe em telas largas: fecha se a janela crescer com ele aberto.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) dialogRef.current?.close();
    };
    query.addEventListener('change', closeOnDesktop);
    return () => query.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <div className={className}>
      <button
        type="button"
        className={styles.iconButton}
        aria-haspopup="dialog"
        aria-label="Abrir menu"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Menu size={24} strokeWidth={1.5} aria-hidden />
      </button>

      <dialog ref={dialogRef} className={styles.menu} aria-label="Menu">
        <div className={styles.top}>
          <Logo />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Fechar menu"
            onClick={close}
          >
            <X size={24} strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Principal">
          <ul className={styles.list}>
            {navItems.map((item) => (
              <li key={item.href} className={styles.item}>
                <a className={styles.link} href={item.href} onClick={close}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ButtonLink
          className={styles.cta}
          href={buildWhatsAppUrl()}
          external
          size="lg"
          fullWidth
          icon={ArrowRight}
          onClick={close}
        >
          {headerCtaLabel}
        </ButtonLink>
      </dialog>
    </div>
  );
}
