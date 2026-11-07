import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { sectionIds } from '@/config/navigation';
import { differentialsContent } from '@/content/about';

import styles from './Differentials.module.css';

export function Differentials() {
  const { eyebrow, title, pillars } = differentialsContent;

  return (
    <Section id={sectionIds.differentials} aria-labelledby="diferenciais-titulo">
      <SectionHeading eyebrow={eyebrow} title={title} titleId="diferenciais-titulo" />

      <ol className={styles.pillars}>
        {pillars.map((pillar, index) => (
          <li key={pillar.title} className={styles.pillar}>
            {/* Apenas a ordem dos pilares: a lista já a informa a leitores de tela. */}
            <span className={styles.order} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className={styles.title}>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
