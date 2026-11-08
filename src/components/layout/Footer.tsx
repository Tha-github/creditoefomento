import { MapPin } from 'lucide-react';

import { Logo } from '@/components/brand/Logo';
import { TextLink } from '@/components/ui/TextLink';
import { brand } from '@/config/brand';
import {
  anchorHref,
  footerNavItems,
  homeHref,
  type LinkBase,
  privacyPolicyHref,
  sectionIds,
} from '@/config/navigation';
import { footerContent } from '@/content/footer';
import { products } from '@/data/products';
import { buildWhatsAppUrl } from '@/integrations/whatsapp';

import { Container } from './Container';
import styles from './Footer.module.css';

interface FooterProps {
  linkBase?: LinkBase;
}

/** Sem endereço, CNPJ ou razão social: não foram fornecidos pela empresa. */
export function Footer({ linkBase = '' }: FooterProps) {
  const {
    description,
    coverage,
    navigationTitle,
    solutionsTitle,
    contactTitle,
    whatsappLabel,
    privacyLabel,
    rights,
  } = footerContent;

  return (
    <footer id={sectionIds.footer} className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href={linkBase === '' ? `#${sectionIds.hero}` : homeHref} className={styles.logo}>
              <Logo />
              <span className="visually-hidden">, voltar ao início</span>
            </a>
            <p className={styles.description}>{description}</p>
            <p className={styles.coverage}>
              <MapPin size={16} strokeWidth={1.5} aria-hidden />
              {coverage}
            </p>
          </div>

          <nav className={styles.column} aria-labelledby="rodape-navegacao">
            <h2 id="rodape-navegacao" className={styles.title}>
              {navigationTitle}
            </h2>
            <ul className={styles.links}>
              {footerNavItems.map((item) => (
                <li key={item.href}>
                  <a href={anchorHref(linkBase, item.href)}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.column} aria-labelledby="rodape-solucoes">
            <h2 id="rodape-solucoes" className={styles.title}>
              {solutionsTitle}
            </h2>
            <ul className={styles.links}>
              {products.map((product) => (
                <li key={product.id}>
                  <a href={anchorHref(linkBase, `#${product.id}`)}>{product.name}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.column}>
            <h2 className={styles.title}>{contactTitle}</h2>
            <p className={styles.label}>{whatsappLabel}</p>
            <TextLink href={buildWhatsAppUrl()} external>
              {brand.whatsapp.display}
            </TextLink>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {__BUILD_YEAR__} {brand.name}. {rights}
          </p>
          <a href={privacyPolicyHref}>{privacyLabel}</a>
        </div>
      </Container>
    </footer>
  );
}
