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

export function Solutions({ portfolio = false }: { portfolio?: boolean }) {
  const { description, productCta, note } = solutionsContent;

  return (
    <Section id={portfolio ? 'portfolio' : sectionIds.solutions} tone="soft" aria-labelledby={portfolio ? 'portfolio-titulo' : 'solucoes-titulo'}>
      <SectionHeading
        eyebrow={portfolio ? 'Portfólio' : 'Crédito empresarial'}
        title={portfolio ? 'Soluções para diferentes necessidades empresariais.' : 'Crédito empresarial alinhado à realidade da sua empresa.'}
        description={portfolio ? description : 'A Crédito e Fomento conecta empresas a alternativas de crédito estruturado, considerando as características e necessidades de cada operação.'}
        titleId={portfolio ? 'portfolio-titulo' : 'solucoes-titulo'}
        layout="split"
      />

      {portfolio && <FeaturedSolution className={styles.featured} />}

      {portfolio && <div className={styles.grid}>
        {otherProducts.map((product) => (
          <Card
            key={product.id}
            id={product.id}
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
      </div>}

      {portfolio && <p className={styles.note}>{note}</p>}
    </Section>
  );
}
