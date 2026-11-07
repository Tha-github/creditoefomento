import { ArrowRight } from 'lucide-react';

import desktopAvif from '@/assets/images/hero/hero-desktop.avif';
import desktopWebp from '@/assets/images/hero/hero-desktop.webp';
import mobileAvif from '@/assets/images/hero/hero-mobile.avif';
import mobileWebp from '@/assets/images/hero/hero-mobile.webp';
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

export function Hero() {
  const { headline, description, primaryCta, secondaryCta, imageAlt } = heroContent;

  return (
    <section id={sectionIds.hero} className={styles.hero} aria-labelledby="hero-titulo">
      <div className={styles.visual}>
        {/* Recortes distintos por tela. Os arquivos AVIF têm preload em index.html. */}
        <picture className={styles.picture}>
          <source media={DESKTOP_MEDIA} type="image/avif" srcSet={desktopAvif} {...DESKTOP_SIZE} />
          <source media={DESKTOP_MEDIA} type="image/webp" srcSet={desktopWebp} {...DESKTOP_SIZE} />
          <source type="image/avif" srcSet={mobileAvif} {...MOBILE_SIZE} />
          <img
            className={styles.image}
            src={mobileWebp}
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
