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
  /** `null` enquanto o arquivo original da cliente não for fornecido. */
  logo: BrandLogo | null;
  whatsapp: {
    /** Somente dígitos, com DDI e DDD. */
    number: string;
    display: string;
    defaultMessage: string;
  };
}

export const brand: Brand = {
  name: 'Crédito e Fomento',
  segment: 'Crédito empresarial',
  specialty: 'Antecipação de recebíveis',
  coverage: 'Nacional',
  // Instruções para receber o arquivo em src/assets/brand/README.md
  logo: null,
  whatsapp: {
    number: '5542998476331',
    display: '+55 42 99847-6331',
    defaultMessage:
      'Olá! Gostaria de conhecer as soluções financeiras da Crédito e Fomento e entender as possibilidades para minha empresa.',
  },
};
