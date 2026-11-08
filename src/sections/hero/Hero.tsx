import { ArrowRight } from 'lucide-react';

import desktopAvif1200 from '@/assets/images/hero/hero-desktop-1200.avif';
import desktopWebp1200 from '@/assets/images/hero/hero-desktop-1200.webp';
import desktopAvif1800 from '@/assets/images/hero/hero-desktop-1800.avif';
import desktopWebp1800 from '@/assets/images/hero/hero-desktop-1800.webp';
import mobileAvif600 from '@/assets/images/hero/hero-mobile-600.avif';
import mobileWebp600 from '@/assets/images/hero/hero-mobile-600.webp';
import mobileAvif900 from '@/assets/images/hero/hero-mobile-900.avif';
import mobileWebp900 from '@/assets/images/hero/hero-mobile-900.webp';
import { Container } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GeometricMark } from '@/components/visual/GeometricMark';
import { brand } from '@/config/brand';
import { sectionIds } from '@/config/navigation';
import { heroContent } from '@/content/hero';
import { buildWhatsAppUrl } from '@/integrations/whatsapp';

import styles from './Hero.module.css';

const DESKTOP_MEDIA = '(min-width: 60em)';
const DESKTOP_SIZE = { width: 1800, height: 1402 };
const MOBILE_SIZE = { width: 900, height: 900 };
// Largura exibida: 62% da tela no desktop e a tela inteira no mobile (ver Hero.module.css).
// O preload em index.html usa os mesmos valores.
const DESKTOP_SIZES = '62vw';
const MOBILE_SIZES = '100vw';

export function Hero() {
  const { headline, description, primaryCta, secondaryCta, imageAlt } = heroContent;

  return (
    <section id={sectionIds.hero} className={styles.hero} aria-labelledby="hero-titulo">
      <div className={styles.visual}>
        {/*
          Recortes distintos por tela, cada um em duas larguras: o navegador escolhe pela tela e pela
          densidade de pixels. Imagem principal: sem carregamento adiado, com prioridade e preload.
        */}
        <picture className={styles.picture}>
          <source
            media={DESKTOP_MEDIA}
            type="image/avif"
            srcSet={`${desktopAvif1200} 1200w, ${desktopAvif1800} 1800w`}
            sizes={DESKTOP_SIZES}
            {...DESKTOP_SIZE}
          />
          <source
            media={DESKTOP_MEDIA}
            type="image/webp"
            srcSet={`${desktopWebp1200} 1200w, ${desktopWebp1800} 1800w`}
            sizes={DESKTOP_SIZES}
            {...DESKTOP_SIZE}
          />
          <source
            type="image/avif"
            srcSet={`${mobileAvif600} 600w, ${mobileAvif900} 900w`}
            sizes={MOBILE_SIZES}
            {...MOBILE_SIZE}
          />
          <img
            className={styles.image}
            src={mobileWebp900}
            srcSet={`${mobileWebp600} 600w, ${mobileWebp900} 900w`}
            sizes={MOBILE_SIZES}
            alt={imageAlt}
            fetchPriority="high"
            {...MOBILE_SIZE}
          />
        </picture>
      </div>

      <div className={styles.markWrap}>
        <GeometricMark variant="structure" className={styles.mark} />
      </div>

      <Container>
        <div className={styles.copy}>
          <SectionHeading
            as="h1"
            size="xl"
            titleId="hero-titulo"
            eyebrow={brand.segment}
            title={
              <>
                <span className={styles.highlight}>{headline.highlight}</span> {headline.rest}
              </>
            }
            description={description}
          />
          <div className={styles.actions}>
            <ButtonLink href={`#${sectionIds.solutions}`} size="lg" icon={ArrowRight}>
              {primaryCta}
            </ButtonLink>
            <ButtonLink href={buildWhatsAppUrl()} external variant="secondary" size="lg">
              {secondaryCta}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
