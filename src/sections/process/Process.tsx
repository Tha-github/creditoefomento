import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { sectionIds } from '@/config/navigation';
import { processContent } from '@/content/process';
import { useInView } from '@/hooks/useInView';
import { cx } from '@/utils/cx';

import styles from './Process.module.css';

interface ProcessStepProps {
  order: number;
  title: string;
  description: string;
}

function ProcessStep({ order, title, description }: ProcessStepProps) {
  const [ref, inView] = useInView<HTMLLIElement>();

  return (
    <li ref={ref} className={cx(styles.step, inView && styles.visible)}>
      {/* A lista ordenada já informa a sequência a leitores de tela. */}
      <span className={styles.number} aria-hidden="true">
        {String(order).padStart(2, '0')}
      </span>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p>{description}</p>
      </div>
    </li>
  );
}

export function Process() {
  const { eyebrow, title, steps, note } = processContent;

  return (
    <Section id={sectionIds.process} aria-labelledby="processo-titulo">
      <SectionHeading eyebrow={eyebrow} title={title} titleId="processo-titulo" />

      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <ProcessStep
            key={step.title}
            order={index + 1}
            title={step.title}
            description={step.description}
          />
        ))}
      </ol>

      <p className={styles.note}>{note}</p>
    </Section>
  );
}
