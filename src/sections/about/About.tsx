import desktopAvif800 from '@/assets/images/about/about-desktop-800.avif';
import desktopWebp800 from '@/assets/images/about/about-desktop-800.webp';
import desktopAvif1400 from '@/assets/images/about/about-desktop-1400.avif';
import desktopWebp1400 from '@/assets/images/about/about-desktop-1400.webp';
import mobileAvif800 from '@/assets/images/about/about-mobile-800.avif';
import mobileWebp800 from '@/assets/images/about/about-mobile-800.webp';
import mobileAvif1170 from '@/assets/images/about/about-mobile-1170.avif';
import mobileWebp1170 from '@/assets/images/about/about-mobile-1170.webp';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Divider } from '@/components/visual/Divider';
import { sectionIds } from '@/config/navigation';
import { aboutContent } from '@/content/about';

import styles from './About.module.css';

const DESKTOP_MEDIA = '(min-width: 60em)';
const DESKTOP_SIZE = { width: 1400, height: 1792 };
const MOBILE_SIZE = { width: 1170, height: 878 };
// Largura exibida: 5 de 12 colunas no desktop e a tela inteira abaixo disso (ver About.module.css).
const DESKTOP_SIZES = '42vw';
const MOBILE_SIZES = '100vw';

export function About() {
  const { eyebrow, title, paragraphs, imageAlt } = aboutContent;

  return (
    <section id={sectionIds.about} className={styles.about} aria-labelledby="sobre-titulo">
      <SectionHeading
        className={styles.heading}
        eyebrow={eyebrow}
        title={title}
        titleId="sobre-titulo"
      />

      <div className={styles.figure}>
        <picture>
          <source
            media={DESKTOP_MEDIA}
            type="image/avif"
            srcSet={`${desktopAvif800} 800w, ${desktopAvif1400} 1400w`}
            sizes={DESKTOP_SIZES}
            {...DESKTOP_SIZE}
          />
          <source
            media={DESKTOP_MEDIA}
            type="image/webp"
            srcSet={`${desktopWebp800} 800w, ${desktopWebp1400} 1400w`}
            sizes={DESKTOP_SIZES}
            {...DESKTOP_SIZE}
          />
          <source
            type="image/avif"
            srcSet={`${mobileAvif800} 800w, ${mobileAvif1170} 1170w`}
            sizes={MOBILE_SIZES}
            {...MOBILE_SIZE}
          />
          <img
            className={styles.image}
            src={mobileWebp1170}
            srcSet={`${mobileWebp800} 800w, ${mobileWebp1170} 1170w`}
            sizes={MOBILE_SIZES}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            {...MOBILE_SIZE}
          />
        </picture>
      </div>

      <div className={styles.body}>
        <Divider variant="accent" />
        {paragraphs.map((paragraph, index) => (
          <p key={paragraph} className={index === 0 ? styles.lead : undefined}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
