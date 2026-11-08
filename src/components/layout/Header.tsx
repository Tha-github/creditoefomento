import { brand } from '@/config/brand';
import {
  anchorHref,
  headerCtaLabel,
  homeHref,
  type LinkBase,
  navItems,
  sectionIds,
} from '@/config/navigation';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { useScrolled } from '@/hooks/useScrolled';
import { buildWhatsAppUrl } from '@/integrations/whatsapp';
import { cx } from '@/utils/cx';

import { Container } from './Container';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';

const SCROLL_THRESHOLD = 16;

interface HeaderProps {
  /** Endereço da home fora dela, para os links levarem às seções da página inicial. */
  linkBase?: LinkBase;
}

export function Header({ linkBase = '' }: HeaderProps) {
  const scrolled = useScrolled(SCROLL_THRESHOLD);
  const onHome = linkBase === '';

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled)}>
      <Container className={styles.inner}>
        <a
          className={styles.brand}
          href={onHome ? `#${sectionIds.main}` : homeHref}
          aria-label={onHome ? `${brand.name}, ir para o início` : `${brand.name}, página inicial`}
        >
          <Logo />
        </a>

        <nav className={styles.nav} aria-label="Principal">
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <a className={styles.navLink} href={anchorHref(linkBase, item.href)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ButtonLink className={styles.cta} href={buildWhatsAppUrl()} external>
          {headerCtaLabel}
        </ButtonLink>

        <MobileMenu className={styles.mobileMenu} linkBase={linkBase} />
      </Container>
    </header>
  );
}
