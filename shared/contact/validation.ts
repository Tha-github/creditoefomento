/** Validação compartilhada entre navegador e endpoint. */
export interface ContactFormValues {
  company: string;
  cnpj: string;
  phone: string;
  email: string;
}

export type ContactField = keyof ContactFormValues;
export type ContactErrors = Partial<Record<ContactField, string>>;
export const contactFields: readonly ContactField[] = ['company', 'cnpj', 'phone', 'email'];
export const contactLimits = { company: 160, email: 254 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function onlyDigits(value: string): string { return value.replace(/\D/g, ''); }
export function cnpjCharacters(value: string): string { return value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase(); }

function cnpjCheckDigit(base: string): number {
  let weight = 2;
  let sum = 0;
  for (let index = base.length - 1; index >= 0; index -= 1) {
    sum += (base.charCodeAt(index) - 48) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(value: string): boolean {
  const cnpj = cnpjCharacters(value);
  if (!/^[0-9A-Z]{12}[0-9]{2}$/.test(cnpj) || /^(.)\1{13}$/.test(cnpj)) return false;
  const first = cnpjCheckDigit(cnpj.slice(0, 12));
  const second = cnpjCheckDigit(cnpj.slice(0, 12) + first);
  return cnpj.endsWith(`${first}${second}`);
}

export function isValidPhone(value: string): boolean {
  let digits = onlyDigits(value);
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2);
  if (digits.length !== 10 && digits.length !== 11) return false;
  if (!/^[1-9][1-9]/.test(digits)) return false;
  if (digits.length === 11) return digits[2] === '9';
  return /^[2-5]$/.test(digits[2] ?? '');
}

export function validateContactField(field: ContactField, values: ContactFormValues): string | undefined {
  switch (field) {
    case 'company': {
      const company = values.company.trim();
      if (!company) return 'Informe o nome da empresa.';
      if (company.length > contactLimits.company) return 'O nome da empresa está muito longo.';
      return undefined;
    }
    case 'cnpj':
      if (!values.cnpj.trim()) return 'Informe o CNPJ.';
      return isValidCnpj(values.cnpj) ? undefined : 'CNPJ inválido. Confira os números e dígitos verificadores.';
    case 'phone':
      if (!values.phone.trim()) return 'Informe seu WhatsApp.';
      return isValidPhone(values.phone) ? undefined : 'WhatsApp inválido. Informe um número brasileiro com DDD.';
    case 'email': {
      const email = values.email.trim();
      if (!email) return undefined;
      return email.length <= contactLimits.email && EMAIL_PATTERN.test(email)
        ? undefined
        : 'Informe um e-mail válido, como nome@empresa.com.br.';
    }
  }
}

export function validateContact(values: ContactFormValues): { valid: boolean; errors: ContactErrors } {
  const errors: ContactErrors = {};
  for (const field of contactFields) {
    const error = validateContactField(field, values);
    if (error) errors[field] = error;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export interface ContactPayload extends ContactFormValues {
  website: string;
  startedAt: number;
}

export type ContactErrorCode =
  | 'method_not_allowed' | 'forbidden_origin' | 'unsupported_media_type' | 'payload_too_large'
  | 'invalid_body' | 'too_fast' | 'validation_failed' | 'rate_limited' | 'not_configured' | 'send_failed';
export type ContactResponse =
  | { ok: true }
  | { ok: false; error: ContactErrorCode; fieldErrors?: ContactErrors };
