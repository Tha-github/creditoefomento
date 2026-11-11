import { describe, expect, it } from 'vitest';
import { isValidCnpj, isValidPhone, validateContact } from './validation';

const valid = { company: '  Empresa Exemplo Ltda  ', cnpj: '11.222.333/0001-81', phone: '(42) 99847-6331', email: '' };

describe('formulário de contato', () => {
  it('aceita empresa, CNPJ e WhatsApp válidos com e-mail vazio', () => {
    expect(validateContact(valid)).toEqual({ valid: true, errors: {} });
  });
  it('exige empresa, CNPJ e WhatsApp', () => {
    expect(Object.keys(validateContact({ company: '', cnpj: '', phone: '', email: '' }).errors).sort())
      .toEqual(['cnpj', 'company', 'phone']);
  });
  it('valida o formato e os dígitos verificadores do CNPJ', () => {
    expect(isValidCnpj(valid.cnpj)).toBe(true);
    expect(isValidCnpj('11.222.333/0001-80')).toBe(false);
  });
  it('valida a quantidade e o formato do WhatsApp', () => {
    expect(isValidPhone(valid.phone)).toBe(true);
    expect(isValidPhone('999')).toBe(false);
  });
  it('valida e-mail somente quando preenchido', () => {
    expect(validateContact({ ...valid, email: 'contato@empresa.com.br' }).valid).toBe(true);
    expect(validateContact({ ...valid, email: 'invalido' }).errors.email).toBeDefined();
  });
  it('limpa espaços nas pontas do nome da empresa para validação', () => {
    expect(validateContact({ ...valid, company: '   ' }).errors.company).toBeDefined();
  });
});
