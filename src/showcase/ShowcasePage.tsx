import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { Logo } from '@/components/brand/Logo';
import { Grid } from '@/components/layout/Grid';
import { Section } from '@/components/layout/Section';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FeatureList } from '@/components/ui/FeatureList';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TextLink } from '@/components/ui/TextLink';
import { Divider } from '@/components/visual/Divider';
import { GeometricMark } from '@/components/visual/GeometricMark';
import { IconBadge } from '@/components/visual/IconBadge';
import { products } from '@/data/products';
import { buildProductWhatsAppUrl, buildWhatsAppUrl } from '@/integrations/whatsapp';
import { cx } from '@/utils/cx';

import styles from './ShowcasePage.module.css';

const COLORS = [
  { token: '--color-black', hex: '#080808', use: 'Fundo principal' },
  { token: '--color-black-soft', hex: '#111111', use: 'Seções e cards' },
  { token: '--color-graphite', hex: '#191919', use: 'Seções e destaques' },
  { token: '--color-gold', hex: '#C8A45D', use: 'Ação e detalhes' },
  { token: '--color-gold-light', hex: '#E1C78B', use: 'Hover e foco' },
  { token: '--color-gold-dark', hex: '#98763C', use: 'Estado ativo' },
  { token: '--color-white', hex: '#FFFFFF', use: 'Títulos' },
  { token: '--color-gray-light', hex: '#B7B7B7', use: 'Texto corrido' },
  { token: '--color-gray-soft', hex: '#949494', use: 'Legendas' },
  { token: '--color-gray', hex: '#777777', use: 'Somente decorativo' },
];

const TYPE_SCALE = [
  { token: '--text-display', sample: 'Liquidez empresarial', heading: true },
  { token: '--text-4xl', sample: 'Crédito estruturado', heading: true },
  { token: '--text-3xl', sample: 'Antecipação de recebíveis', heading: true },
  { token: '--text-2xl', sample: 'Soluções financeiras para empresas', heading: true },
  { token: '--text-xl', sample: 'Capital de giro empresarial', heading: true },
  { token: '--text-lg', sample: 'Texto de abertura de seção, em Inter.', heading: false },
  { token: '--text-base', sample: 'Texto corrido, em Inter.', heading: false },
  { token: '--text-sm', sample: 'Listas e botões.', heading: false },
  { token: '--text-xs', sample: 'Rótulos e legendas.', heading: false },
];

const SPACES = ['1', '2', '3', '4', '6', '8', '12', '16', '24', '32'];
const RADII = ['xs', 'sm', 'md'];
const SHADOWS = ['sm', 'md', 'lg'];
const CONTAINERS = [
  { token: '--container-narrow', label: 'Narrow, 768px: textos longos e formulário' },
  { token: '--container-default', label: 'Default, 1280px: maioria das seções' },
  { token: '--container-wide', label: 'Wide, 1600px: composições amplas' },
];

const SECTIONS = [
  ['cores', 'Cores'],
  ['tipografia', 'Tipografia'],
  ['acoes', 'Botões e links'],
  ['cards', 'Cards'],
  ['secoes', 'Seções'],
  ['fundamentos', 'Fundamentos'],
  ['elementos', 'Elementos visuais'],
] as const;

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>{title}</h3>
      {children}
    </div>
  );
}

function Cover() {
  return (
    <Section>
      <div className={styles.coverGrid}>
        <div className={styles.coverText}>
          <Logo />
          <SectionHeading
            as="h1"
            size="display"
            eyebrow="Design system"
            title="Identidade visual em preto e dourado"
            description="Referência dos fundamentos e componentes do site. Esta página não faz parte do site publicado."
          />
          <nav aria-label="Índice do design system">
            <ul className={styles.index}>
              {SECTIONS.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <GeometricMark className={styles.coverMark} />
      </div>
    </Section>
  );
}

function Colors() {
  return (
    <Section id="cores" divider aria-labelledby="cores-titulo">
      <SectionHeading
        titleId="cores-titulo"
        eyebrow="01 / Cores"
        title="O dourado aparece pouco e sempre com função"
        description="Os fundos variam em três tons de preto. O dourado fica reservado a ações, rótulos e pequenos detalhes."
        layout="split"
      />
      <ul className={styles.swatches}>
        {COLORS.map(({ token, hex, use }) => (
          <li key={token} className={styles.swatch}>
            <span className={styles.swatchColor} style={{ backgroundColor: `var(${token})` }} />
            <strong className={styles.swatchHex}>{hex}</strong>
            <span>{use}</span>
            <code className={styles.token}>{token}</code>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Typography() {
  return (
    <Section id="tipografia" tone="soft" aria-labelledby="tipografia-titulo">
      <SectionHeading
        titleId="tipografia-titulo"
        eyebrow="02 / Tipografia"
        title="Manrope nos títulos, Inter nos textos"
        description="A escala é fluida entre 360px e 1600px de largura, sem saltos entre breakpoints."
        layout="split"
      />
      <ul className={styles.typeScale}>
        {TYPE_SCALE.map(({ token, sample, heading }) => (
          <li key={token} className={styles.typeRow}>
            <code className={styles.token}>{token}</code>
            <span
              className={heading ? styles.typeHeading : undefined}
              style={{ fontSize: `var(${token})` }}
            >
              {sample}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Actions() {
  return (
    <Section id="acoes" aria-labelledby="acoes-titulo">
      <SectionHeading
        titleId="acoes-titulo"
        eyebrow="03 / Botões e links"
        title="Uma ação principal por contexto"
        description="Passe o cursor sobre os elementos ou navegue com a tecla Tab para ver os estados de hover e foco."
        layout="split"
      />
      <div className={styles.blocks}>
        <Block title="Primário e secundário">
          <div className={styles.row}>
            <ButtonLink href={buildWhatsAppUrl()} external size="lg" icon={ArrowRight}>
              Falar pelo WhatsApp
            </ButtonLink>
            <ButtonLink href="#cards" variant="secondary" size="lg">
              Ver os cards
            </ButtonLink>
          </div>
        </Block>
        <Block title="Tamanho padrão">
          <div className={styles.row}>
            <ButtonLink href={buildWhatsAppUrl()} external icon={ArrowRight}>
              Falar pelo WhatsApp
            </ButtonLink>
            <ButtonLink href="#cards" variant="secondary">
              Ver os cards
            </ButtonLink>
          </div>
        </Block>
        <Block title="Desabilitado">
          <div className={styles.row}>
            <Button disabled>Primário</Button>
            <Button disabled variant="secondary">
              Secundário
            </Button>
          </div>
        </Block>
        <Block title="Links">
          <div className={styles.linkExamples}>
            <TextLink href="#cards">Link de ação</TextLink>
            <p>
              Em um parágrafo, o link fica sublinhado para se distinguir do texto:{' '}
              <a href="#fundamentos">ver os fundamentos</a>.
            </p>
          </div>
        </Block>
      </div>
    </Section>
  );
}

function Cards() {
  return (
    <Section id="cards" tone="soft" aria-labelledby="cards-titulo">
      <SectionHeading
        titleId="cards-titulo"
        eyebrow="04 / Cards"
        title="O produto principal se destaca dos demais"
        description="O destaque é reservado à antecipação de recebíveis. Os textos são os do portfólio, e os links abrem o WhatsApp."
        layout="split"
      />
      <Grid className={styles.cards}>
        {products.map((product) => (
          <Card
            key={product.id}
            title={product.name}
            description={product.description}
            icon={product.icon}
            variant={product.featured ? 'featured' : 'default'}
            action={
              <TextLink
                href={buildProductWhatsAppUrl(product.name)}
                external
                aria-label={`Consultar ${product.name} pelo WhatsApp (abre em nova aba)`}
              >
                Consultar pelo WhatsApp
              </TextLink>
            }
          >
            {product.highlights.length > 0 && <FeatureList items={product.highlights} />}
          </Card>
        ))}
      </Grid>
    </Section>
  );
}

function SectionPatterns() {
  return (
    <div id="secoes">
      <Section tone="graphite" spacing="compact" aria-labelledby="secoes-titulo">
        <SectionHeading
          titleId="secoes-titulo"
          eyebrow="05 / Seções"
          title="Empilhado, para uma abertura direta"
          description="Tom grafite com espaçamento compacto. O layout empilhado concentra a leitura em uma coluna."
        />
      </Section>
      <Section tone="base" aria-labelledby="secoes-split">
        <SectionHeading
          titleId="secoes-split"
          as="h3"
          eyebrow="Assimétrico"
          title="Dividido, para uma composição editorial"
          description="Tom preto com espaçamento padrão. Em telas largas, a descrição se desloca à direita e se alinha à base do título."
          layout="split"
        />
      </Section>
      <Section tone="soft" spacing="compact" containerSize="narrow" aria-labelledby="secoes-narrow">
        <SectionHeading
          titleId="secoes-narrow"
          as="h3"
          size="md"
          eyebrow="Container estreito"
          title="Para textos longos e formulário"
          description="Tom preto secundário, com a largura de linha limitada para manter a leitura confortável."
        />
      </Section>
    </div>
  );
}

function Foundations() {
  return (
    <Section id="fundamentos" aria-labelledby="fundamentos-titulo">
      <SectionHeading
        titleId="fundamentos-titulo"
        eyebrow="06 / Fundamentos"
        title="Espaçamento, bordas e profundidade"
        layout="split"
      />
      <div className={styles.blocks}>
        <Block title="Espaçamentos">
          <ul className={styles.spaces}>
            {SPACES.map((space) => (
              <li key={space} className={styles.spaceRow}>
                <code className={styles.token}>--space-{space}</code>
                <span className={styles.spaceBar} style={{ width: `var(--space-${space})` }} />
              </li>
            ))}
          </ul>
        </Block>
        <Block title="Raios">
          <ul className={styles.samples}>
            {RADII.map((radius) => (
              <li key={radius} className={styles.sample}>
                <span
                  className={styles.sampleBox}
                  style={{ borderRadius: `var(--radius-${radius})` }}
                />
                <code className={styles.token}>--radius-{radius}</code>
              </li>
            ))}
          </ul>
        </Block>
        <Block title="Sombras">
          <ul className={cx(styles.samples, styles.shadowStage)}>
            {SHADOWS.map((shadow) => (
              <li key={shadow} className={styles.sample}>
                <span
                  className={styles.sampleBox}
                  style={{ boxShadow: `var(--shadow-${shadow})` }}
                />
                <code className={styles.token}>--shadow-{shadow}</code>
              </li>
            ))}
          </ul>
        </Block>
        <Block title="Containers">
          <ul className={styles.containers}>
            {CONTAINERS.map(({ token, label }) => (
              <li key={token} className={styles.containerBar} style={{ maxWidth: `var(${token})` }}>
                {label}
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </Section>
  );
}

function VisualElements() {
  const FeaturedIcon = products[0]?.icon;

  return (
    <Section id="elementos" tone="soft" aria-labelledby="elementos-titulo">
      <SectionHeading
        titleId="elementos-titulo"
        eyebrow="07 / Elementos visuais"
        title="Geometria discreta, com traço fino"
        description="As composições sugerem crescimento e solidez sem depender de imagens genéricas."
        layout="split"
      />
      <div className={styles.elements}>
        <figure className={styles.element}>
          <GeometricMark variant="ascent" />
          <figcaption>Progressão, para crescimento</figcaption>
        </figure>
        <figure className={styles.element}>
          <GeometricMark variant="structure" />
          <figcaption>Planos sobrepostos, para solidez</figcaption>
        </figure>
        <div className={styles.elementDetails}>
          <Block title="Divisor padrão">
            <Divider />
          </Block>
          <Block title="Divisor de destaque">
            <Divider variant="accent" />
          </Block>
          {FeaturedIcon && (
            <Block title="Ícone em moldura">
              <IconBadge icon={FeaturedIcon} />
            </Block>
          )}
        </div>
      </div>
    </Section>
  );
}

/** Vitrine do design system. Ver "Design system" no README para acessar e publicar. */
export function ShowcasePage() {
  return (
    <main>
      <Cover />
      <Colors />
      <Typography />
      <Actions />
      <Cards />
      <SectionPatterns />
      <Foundations />
      <VisualElements />
    </main>
  );
}
