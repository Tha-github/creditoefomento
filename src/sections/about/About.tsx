import desktopAvif from '@/assets/images/about/about-desktop.avif';
import desktopWebp from '@/assets/images/about/about-desktop.webp';
import mobileAvif from '@/assets/images/about/about-mobile.avif';
import mobileWebp from '@/assets/images/about/about-mobile.webp';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Divider } from '@/components/visual/Divider';
import { sectionIds } from '@/config/navigation';
import { aboutContent } from '@/content/about';

import styles from './About.module.css';

const DESKTOP_MEDIA = '(min-width: 60em)';
const DESKTOP_SIZE = { width: 1400, height: 1792 };
const MOBILE_SIZE = { width: 1170, height: 878 };

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
          <source media={DESKTOP_MEDIA} type="image/avif" srcSet={desktopAvif} {...DESKTOP_SIZE} />
          <source media={DESKTOP_MEDIA} type="image/webp" srcSet={desktopWebp} {...DESKTOP_SIZE} />
          <source type="image/avif" srcSet={mobileAvif} {...MOBILE_SIZE} />
          <img
            className={styles.image}
            src={mobileWebp}
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
