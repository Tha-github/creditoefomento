import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TextLink } from '@/components/ui/TextLink';
import { sectionIds } from '@/config/navigation';
import { solutionsContent } from '@/content/solutions';
import { otherProducts } from '@/data/products';
import { buildProductWhatsAppUrl } from '@/integrations/whatsapp';

import { FeaturedSolution } from './FeaturedSolution';
import styles from './Solutions.module.css';

/** O último produto ocupa a linha inteira em um card horizontal. */
const WIDE_PRODUCT_ID = 'conta-escrow';

export function Solutions() {
  const { eyebrow, title, description, productCta, note } = solutionsContent;

  return (
    <Section id={sectionIds.solutions} tone="soft" aria-labelledby="solucoes-titulo">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        titleId="solucoes-titulo"
        layout="split"
      />

      <FeaturedSolution className={styles.featured} />

      <div className={styles.grid}>
        {otherProducts.map((product) => (
          <Card
            key={product.id}
            className={styles.card}
            title={product.name}
            description={product.description}
            icon={product.icon}
            variant={product.id === WIDE_PRODUCT_ID ? 'wide' : 'default'}
            stretchedAction
            action={
              <TextLink href={buildProductWhatsAppUrl(product.name)} external>
                {productCta}
                <span className="visually-hidden">: {product.name}</span>
              </TextLink>
            }
          />
        ))}
      </div>

      <p className={styles.note}>{note}</p>
    </Section>
  );
}
