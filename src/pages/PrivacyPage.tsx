import { CircleAlert } from 'lucide-react';

import { site } from '@shared/site';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Section } from '@/components/layout/Section';
import { SkipLink } from '@/components/layout/SkipLink';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { homeHref, sectionIds } from '@/config/navigation';
import { type PolicyBlock, privacyPolicyContent } from '@/content/privacyPolicy';

import styles from './PrivacyPage.module.css';

function Block({ block }: { block: PolicyBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p>{block.text}</p>;
    case 'list':
      return (
        <ul className={styles.list}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
  }
}

export function PrivacyPage() {
  const { eyebrow, title, intro, draftNotice, tocLabel, sections } = privacyPolicyContent;

  return (
    <>
      <SkipLink />
      <Header linkBase={homeHref} />
      <main id={sectionIds.main} tabIndex={-1} className={styles.main}>
        <Section containerSize="narrow" aria-labelledby="politica-titulo">
          <SectionHeading
            as="h1"
            size="lg"
            eyebrow={eyebrow}
            title={title}
            description={intro}
            titleId="politica-titulo"
          />

          <div className={styles.meta}>
            {!site.privacyPolicyValidated && (
              <p className={styles.draft} role="note">
                <CircleAlert size={18} strokeWidth={1.75} aria-hidden />
                <span>{draftNotice}</span>
              </p>
            )}
          </div>

          <nav className={styles.toc} aria-labelledby="politica-indice">
            <h2 id="politica-indice" className={styles.tocTitle}>
              {tocLabel}
            </h2>
            <ol className={styles.tocList}>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className={styles.sections}>
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className={styles.section} aria-labelledby={`${section.id}-titulo`}>
                <h2 id={`${section.id}-titulo`} className={styles.sectionTitle}>
                  <span className={styles.number} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </h2>
                {section.blocks.map((block, blockIndex) => (
                  <Block key={blockIndex} block={block} />
                ))}
              </section>
            ))}
          </div>
        </Section>
      </main>
      <Footer linkBase={homeHref} />
    </>
  );
}
