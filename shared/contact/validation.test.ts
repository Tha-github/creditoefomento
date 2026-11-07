import { describe, expect, it } from 'vitest';

import { products } from '../../src/data/products';
import {
  contactProducts,
  type ContactFormValues,
  isValidCnpj,
  isValidPhone,
  validateContact,
  validateContactField,
} from './validation';

const valid: ContactFormValues = {
  name: 'Maria Souza',
  company: 'Empresa Exemplo Ltda',
  cnpj: '',
  email: 'maria@empresa.com.br',
  phone: '(42) 99847-6331',
  product: 'capital-de-giro',
  amount: '',
  message: 'Gostaria de entender as possibilidades.',
  privacyAccepted: true,
};

describe('CNPJ', () => {
  it.each(['11.222.333/0001-81', '11222333000181'])('aceita o numérico válido %s', (cnpj) => {
    expect(isValidCnpj(cnpj)).toBe(true);
  });

  // Exemplo publicado pela Receita Federal para o CNPJ alfanumérico.
  it.each(['12.ABC.345/01DE-35', '12abc34501de35'])('aceita o alfanumérico válido %s', (cnpj) => {
    expect(isValidCnpj(cnpj)).toBe(true);
  });

  it.each([
    '11.222.333/0001-80',
    '12.ABC.345/01DE-36',
    '00000000000000',
    '11111111111111',
    '1122233300018',
    '12ABC34501DEAB',
    'abc',
  ])('recusa %s', (cnpj) => {
    expect(isValidCnpj(cnpj)).toBe(false);
  });
});

describe('telefone', () => {
  it.each(['(42) 99847-6331', '42998476331', '(11) 3333-4444'])('aceita %s', (phone) => {
    expect(isValidPhone(phone)).toBe(true);
  });

  it.each(['(42) 89847-6331', '(01) 99847-6331', '(42) 1333-4444', '999', '429984763310'])(
    'recusa %s',
    (phone) => {
      expect(isValidPhone(phone)).toBe(false);
    },
  );
});

describe('formulário', () => {
  it('aceita o preenchimento mínimo', () => {
    expect(validateContact(valid)).toEqual({ valid: true, errors: {} });
  });

  it('não exige os campos opcionais, mas confere se preenchidos', () => {
    expect(validateContactField('cnpj', valid)).toBeUndefined();
    expect(validateContactField('amount', valid)).toBeUndefined();
    expect(validateContactField('cnpj', { ...valid, cnpj: '123' })).toBeDefined();
    expect(validateContactField('amount', { ...valid, amount: 'R$ 0' })).toBeDefined();
  });

  it('informa todos os campos obrigatórios vazios', () => {
    const { valid: isValid, errors } = validateContact({
      name: '',
      company: '',
      cnpj: '',
      email: '',
      phone: '',
      product: '',
      amount: '',
      message: '',
      privacyAccepted: false,
    });
    expect(isValid).toBe(false);
    expect(Object.keys(errors).sort()).toEqual(
      ['company', 'email', 'message', 'name', 'phone', 'privacyAccepted', 'product'].sort(),
    );
  });

  it.each(['maria', 'maria@', '@empresa.com', 'maria@empresa', 'ma ria@empresa.com', 'a@b..com'])(
    'recusa o e-mail %s',
    (email) => {
      expect(validateContactField('email', { ...valid, email })).toBeDefined();
    },
  );

  it('exige nome e sobrenome', () => {
    expect(validateContactField('name', { ...valid, name: 'Maria' })).toBeDefined();
  });

  it('recusa produto fora da lista', () => {
    expect(validateContactField('product', { ...valid, product: 'cripto' })).toBeDefined();
  });

  it('exige o aceite', () => {
    expect(validateContactField('privacyAccepted', { ...valid, privacyAccepted: false })).toBeDefined();
  });

  it('limita o tamanho da mensagem', () => {
    expect(validateContactField('message', { ...valid, message: 'a'.repeat(2001) })).toBeDefined();
  });
});

describe('produtos', () => {
  it('o select tem os produtos do site, na mesma ordem, mais "Outros"', () => {
    expect(contactProducts.map(({ value, label }) => ({ value, label }))).toEqual([
      ...products.map(({ id, name }) => ({ value: id, label: name })),
      { value: 'outros', label: 'Outros' },
    ]);
  });
});
