import { site } from '@shared/site';
import logoUrl from '@/assets/images/logo.png';

export interface BrandLogo {
  src: string;
  alt: string;
  /** Dimensões intrínsecas do arquivo, usadas para evitar CLS. */
  width: number;
  height: number;
}

export interface Brand {
  name: string;
  segment: string;
  specialty: string;
  coverage: string;
  /** Logomarca fornecida pela cliente. */
  logo: BrandLogo | null;
  whatsapp: {
    /** Somente dígitos, com DDI e DDD. */
    number: string;
    display: string;
    defaultMessage: string;
  };
}

export const brand: Brand = {
  name: site.name,
  segment: 'Crédito empresarial',
  specialty: 'Antecipação de recebíveis',
  coverage: 'Nacional',
  logo: { src: logoUrl, alt: 'Crédito e Fomento', width: 467, height: 215 },
  whatsapp: {
    number: site.whatsapp.number,
    display: site.whatsapp.display,
    defaultMessage:
      'Olá! Gostaria de conhecer as soluções financeiras da Crédito e Fomento e entender as possibilidades para minha empresa.',
  },
};
