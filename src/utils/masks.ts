import { cnpjCharacters, contactLimits, onlyDigits } from '@shared/contact/validation';

/** (42) 99999-9999 ou (42) 3333-3333, conforme a quantidade de dígitos. */
export function formatPhone(value: string): string {
  let digits = onlyDigits(value);
  // Número colado com o DDI do Brasil.
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2);
  digits = digits.slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;

  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);
  const prefixLength = number.length > 8 ? 5 : 4;
  if (number.length <= prefixLength) return `(${ddd}) ${number}`;
  return `(${ddd}) ${number.slice(0, prefixLength)}-${number.slice(prefixLength)}`;
}

/** 00.000.000/0000-00, aceitando letras nas posições permitidas pelo CNPJ alfanumérico. */
export function formatCnpj(value: string): string {
  const characters = cnpjCharacters(value).slice(0, 14);
  let formatted = characters.slice(0, 2);
  if (characters.length > 2) formatted += `.${characters.slice(2, 5)}`;
  if (characters.length > 5) formatted += `.${characters.slice(5, 8)}`;
  if (characters.length > 8) formatted += `/${characters.slice(8, 12)}`;
  if (characters.length > 12) formatted += `-${characters.slice(12)}`;
  return formatted;
}

/** R$ 1.250.000, em reais inteiros: o campo pede um valor aproximado. */
export function formatAmount(value: string): string {
  const digits = onlyDigits(value).replace(/^0+/, '').slice(0, contactLimits.amountDigits);
  if (!digits) return '';
  return `R$ ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}
