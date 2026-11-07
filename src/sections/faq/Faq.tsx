import { Section } from '@/components/layout/Section';
import { Accordion } from '@/components/ui/Accordion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TextLink } from '@/components/ui/TextLink';
import { sectionIds } from '@/config/navigation';
import { faqContent } from '@/content/faq';

import styles from './Faq.module.css';

export function Faq() {
  const { eyebrow, title, description, entries } = faqContent;

  const items = entries.map(({ id, question, answer, action }) => ({
    id,
    question,
    answer: (
      <>
        <p>{answer}</p>
        {action && <TextLink href={action.href}>{action.label}</TextLink>}
      </>
    ),
  }));

  return (
    <Section id={sectionIds.faq} tone="soft" aria-labelledby="faq-titulo">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        titleId="faq-titulo"
        layout="split"
      />
      <Accordion className={styles.accordion} items={items} />
    </Section>
  );
}
