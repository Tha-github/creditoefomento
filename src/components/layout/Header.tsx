import { brand } from '@/config/brand';
import { headerCtaLabel, navItems, sectionIds } from '@/config/navigation';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { useScrolled } from '@/hooks/useScrolled';
import { buildWhatsAppUrl } from '@/integrations/whatsapp';
import { cx } from '@/utils/cx';

import { Container } from './Container';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';

const SCROLL_THRESHOLD = 16;

export function Header() {
  const scrolled = useScrolled(SCROLL_THRESHOLD);

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled)}>
      <Container className={styles.inner}>
        <a
          className={styles.brand}
          href={`#${sectionIds.main}`}
          aria-label={`${brand.name}, ir para o início`}
        >
          <Logo />
        </a>

        <nav className={styles.nav} aria-label="Principal">
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <a className={styles.navLink} href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ButtonLink className={styles.cta} href={buildWhatsAppUrl()} external>
          {headerCtaLabel}
        </ButtonLink>

        <MobileMenu className={styles.mobileMenu} />
      </Container>
    </header>
  );
}
