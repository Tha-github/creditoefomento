import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { sectionIds } from '@/config/navigation';
import { approachContent } from '@/content/process';

import styles from './Approach.module.css';

export function Approach() {
  const { eyebrow, title, items } = approachContent;

  return (
    <Section id={sectionIds.approach} tone="graphite" aria-labelledby="atuacao-titulo">
      <div className={styles.layout}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId="atuacao-titulo" />

        <ul className={styles.items}>
          {items.map(({ title: itemTitle, description, icon: Icon }) => (
            <li key={itemTitle} className={styles.item}>
              <Icon className={styles.icon} size={22} strokeWidth={1.5} aria-hidden />
              <h3 className={styles.title}>{itemTitle}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
