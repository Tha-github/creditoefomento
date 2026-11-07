/**
 * Regras do formulário de contato, usadas no navegador e no servidor.
 * O navegador valida para orientar quem preenche; só a validação do servidor é confiável.
 * Sem dependências de ambiente: este arquivo roda nos dois lados.
 */

export const contactProducts = [
  { value: 'antecipacao-de-recebiveis', label: 'Antecipação de recebíveis' },
  { value: 'capital-de-giro', label: 'Capital de giro' },
  { value: 'home-equity', label: 'Home Equity' },
  { value: 'financiamentos', label: 'Financiamentos' },
  { value: 'emprestimo-com-garantia-de-veiculo', label: 'Empréstimo com garantia de veículo' },
  { value: 'credito-estruturado', label: 'Crédito estruturado' },
  { value: 'conta-escrow', label: 'Conta Escrow' },
  { value: 'outros', label: 'Outros' },
] as const;

export interface ContactFormValues {
  name: string;
  company: string;
  cnpj: string;
  email: string;
  phone: string;
  product: string;
  amount: string;
  message: string;
  privacyAccepted: boolean;
}

export type ContactField = keyof ContactFormValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

/** Ordem visual dos campos: define qual erro recebe o foco primeiro. */
export const contactFields: readonly ContactField[] = [
  'name',
  'company',
  'cnpj',
  'email',
  'phone',
  'product',
  'amount',
  'message',
  'privacyAccepted',
];

export const contactLimits = {
  name: 120,
  company: 160,
  email: 254,
  message: 2000,
  amountDigits: 15,
} as const;

const MESSAGE_MIN_LENGTH = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Letras e números do CNPJ, em maiúsculas. O CNPJ alfanumérico usa letras nas 12 primeiras posições. */
export function cnpjCharacters(value: string): string {
  return value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
}

function cnpjCheckDigit(base: string): number {
  // Pesos de 2 a 9, repetidos, da direita para a esquerda. Letras valem o código ASCII menos 48.
  let weight = 2;
  let sum = 0;
  for (let index = base.length - 1; index >= 0; index -= 1) {
    sum += (base.charCodeAt(index) - 48) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

/** Valida formato e dígitos verificadores, para CNPJ numérico e alfanumérico. */
export function isValidCnpj(value: string): boolean {
  const cnpj = cnpjCharacters(value);
  if (!/^[0-9A-Z]{12}[0-9]{2}$/.test(cnpj)) return false;
  if (/^(.)\1{13}$/.test(cnpj)) return false;

  const first = cnpjCheckDigit(cnpj.slice(0, 12));
  const second = cnpjCheckDigit(cnpj.slice(0, 12) + first);
  return cnpj.endsWith(`${first}${second}`);
}

/** Telefone brasileiro com DDD: fixo com 10 dígitos ou celular com 11, começando em 9. */
export function isValidPhone(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 10 && digits.length !== 11) return false;
  if (!/^[1-9][1-9]/.test(digits)) return false;
  if (digits.length === 11) return digits[2] === '9';
  return /^[2-5]$/.test(digits[2] ?? '');
}

export function validateContactField(
  field: ContactField,
  values: ContactFormValues,
): string | undefined {
  switch (field) {
    case 'name': {
      const name = values.name.trim();
      if (!name) return 'Informe seu nome completo.';
      if (name.length > contactLimits.name) return 'O nome está muito longo.';
      if (name.split(/\s+/).length < 2) return 'Informe nome e sobrenome.';
      return undefined;
    }
    case 'company': {
      const company = values.company.trim();
      if (!company) return 'Informe o nome da empresa.';
      if (company.length < 2) return 'Informe o nome completo da empresa.';
      if (company.length > contactLimits.company) return 'O nome da empresa está muito longo.';
      return undefined;
    }
    case 'cnpj':
      if (!values.cnpj.trim()) return undefined;
      return isValidCnpj(values.cnpj) ? undefined : 'Confira o CNPJ ou deixe o campo em branco.';
    case 'email': {
      const email = values.email.trim();
      if (!email) return 'Informe seu e-mail corporativo.';
      if (email.length > contactLimits.email || !EMAIL_PATTERN.test(email)) {
        return 'Informe um e-mail válido, como nome@empresa.com.br.';
      }
      return undefined;
    }
    case 'phone':
      if (!values.phone.trim()) return 'Informe um telefone ou WhatsApp.';
      return isValidPhone(values.phone) ? undefined : 'Informe o telefone com DDD, como (42) 99999-9999.';
    case 'product':
      return contactProducts.some((product) => product.value === values.product)
        ? undefined
        : 'Selecione o produto de interesse.';
    case 'amount': {
      if (!values.amount.trim()) return undefined;
      const digits = onlyDigits(values.amount);
      if (!digits || /^0+$/.test(digits) || digits.length > contactLimits.amountDigits) {
        return 'Confira o valor ou deixe o campo em branco.';
      }
      return undefined;
    }
    case 'message': {
      const message = values.message.trim();
      if (!message) return 'Descreva brevemente a sua necessidade.';
      if (message.length < MESSAGE_MIN_LENGTH) return 'Conte um pouco mais sobre a sua necessidade.';
      if (message.length > contactLimits.message) {
        return `A mensagem deve ter até ${contactLimits.message} caracteres.`;
      }
      return undefined;
    }
    case 'privacyAccepted':
      return values.privacyAccepted === true
        ? undefined
        : 'É necessário aceitar a Política de Privacidade para enviar.';
  }
}

export function validateContact(values: ContactFormValues): {
  valid: boolean;
  errors: ContactErrors;
} {
  const errors: ContactErrors = {};
  for (const field of contactFields) {
    const error = validateContactField(field, values);
    if (error) errors[field] = error;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/** Corpo enviado ao endpoint: os campos, mais os dois sinais antispam. */
export interface ContactPayload extends ContactFormValues {
  /** Campo-armadilha: invisível para pessoas, deve chegar vazio. */
  website: string;
  /** Instante, em milissegundos, em que o formulário foi exibido. */
  startedAt: number;
}

/** Respostas de erro do endpoint. */
export type ContactErrorCode =
  | 'method_not_allowed'
  | 'forbidden_origin'
  | 'unsupported_media_type'
  | 'payload_too_large'
  | 'invalid_body'
  | 'too_fast'
  | 'validation_failed'
  | 'rate_limited'
  | 'not_configured'
  | 'send_failed';

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: ContactErrorCode; fieldErrors?: ContactErrors };
