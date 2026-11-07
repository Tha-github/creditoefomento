import {
  Building2,
  Landmark,
  Layers,
  type LucideIcon,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Truck,
} from 'lucide-react';

/**
 * Portfólio proposto a partir da referência comercial (CLAUDE.md, seção 5).
 * Não acrescentar taxas, valores, prazos, limites, parceiros ou garantias não confirmados pela cliente.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Produto principal, com maior destaque no site. */
  featured: boolean;
  highlights: readonly string[];
}

export const featuredProduct: Product = {
  id: 'antecipacao-de-recebiveis',
  name: 'Antecipação de recebíveis',
  description:
    'A antecipação de recebíveis permite que sua empresa tenha acesso antecipado a valores provenientes de vendas e contratos, contribuindo para o equilíbrio do fluxo de caixa e a continuidade das operações.',
  icon: ReceiptText,
  featured: true,
  highlights: [
    'Liquidez para operações empresariais.',
    'Antecipação de valores a receber.',
    'Análise personalizada.',
    'Possibilidade de adequação às características de cada operação.',
  ],
};

export const otherProducts: readonly Product[] = [
  {
    id: 'capital-de-giro',
    name: 'Capital de giro',
    description:
      'Recursos para sustentar a operação da empresa e equilibrar o fluxo de caixa diante de necessidades de curto e médio prazo.',
    icon: RefreshCw,
    featured: false,
    highlights: [],
  },
  {
    id: 'home-equity',
    name: 'Home Equity',
    description:
      'Crédito com garantia imobiliária para empresas e operações, sujeito à análise do imóvel e das condições de cada caso.',
    icon: Building2,
    featured: false,
    highlights: [],
  },
  {
    id: 'financiamentos',
    name: 'Financiamentos',
    description:
      'Alternativas para adquirir bens e ativos que fortaleçam a estrutura operacional e apoiem a expansão do negócio.',
    icon: Landmark,
    featured: false,
    highlights: [],
  },
  {
    id: 'emprestimo-com-garantia-de-veiculo',
    name: 'Empréstimo com garantia de veículo',
    description:
      'Crédito com o veículo como garantia, sujeito à avaliação do bem e às condições da operação.',
    icon: Truck,
    featured: false,
    highlights: [],
  },
  {
    id: 'credito-estruturado',
    name: 'Crédito estruturado',
    description:
      'Soluções desenhadas para necessidades específicas da empresa, como investimentos, expansão e aquisição de ativos.',
    icon: Layers,
    featured: false,
    highlights: [],
  },
  {
    id: 'conta-escrow',
    name: 'Conta Escrow',
    description:
      'Conta vinculada para operações que exigem controle e segurança na movimentação de recursos entre as partes envolvidas.',
    icon: ShieldCheck,
    featured: false,
    highlights: [],
  },
];

export const products: readonly Product[] = [featuredProduct, ...otherProducts];
