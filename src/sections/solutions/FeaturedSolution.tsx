import { ArrowRight } from 'lucide-react';

import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { FeatureList } from '@/components/ui/FeatureList';
import { solutionsContent } from '@/content/solutions';
import { featuredProduct } from '@/data/products';
import { buildWhatsAppUrl } from '@/integrations/whatsapp';
import { cx } from '@/utils/cx';

import styles from './FeaturedSolution.module.css';
import { ReceivablesDiagram } from './ReceivablesDiagram';

interface FeaturedSolutionProps {
  className?: string;
}

/** Composição exclusiva do produto principal. */
export function FeaturedSolution({ className }: FeaturedSolutionProps) {
  const { statement, cta, ctaMessage } = solutionsContent.featured;

  return (
    <article
      id={featuredProduct.id}
      className={cx(styles.featured, className)}
      aria-labelledby="antecipacao-titulo"
    >
      <div className={styles.text}>
        <Eyebrow as="h3" id="antecipacao-titulo">
          {featuredProduct.name}
        </Eyebrow>
        <p className={styles.statement}>
          {statement.lead} <span className={styles.highlight}>{statement.highlight}</span>
        </p>
        <p className={styles.description}>{featuredProduct.description}</p>
        <ButtonLink
          className={styles.cta}
          href={buildWhatsAppUrl(ctaMessage)}
          external
          size="lg"
          icon={ArrowRight}
        >
          {cta}
        </ButtonLink>
      </div>

      <div className={styles.aside}>
        <ReceivablesDiagram />
        <FeatureList items={featuredProduct.highlights} />
      </div>
    </article>
  );
}
