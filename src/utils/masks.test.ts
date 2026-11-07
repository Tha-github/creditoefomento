import { describe, expect, it } from 'vitest';

import { formatAmount, formatCnpj, formatPhone } from './masks';

describe('formatPhone', () => {
  it.each([
    ['', ''],
    ['4', '(4'],
    ['42', '(42'],
    ['429', '(42) 9'],
    ['4299847', '(42) 9984-7'],
    ['4233334444', '(42) 3333-4444'],
    ['42998476331', '(42) 99847-6331'],
    ['429984763319999', '(42) 99847-6331'],
    ['+55 42 99847-6331', '(42) 99847-6331'],
    ['abc', ''],
  ])('%s vira %s', (input, expected) => {
    expect(formatPhone(input)).toBe(expected);
  });
});

describe('formatCnpj', () => {
  it.each([
    ['', ''],
    ['11', '11'],
    ['112', '11.2'],
    ['11222333000181', '11.222.333/0001-81'],
    ['12abc34501de35', '12.ABC.345/01DE-35'],
    ['11222333000181999', '11.222.333/0001-81'],
  ])('%s vira %s', (input, expected) => {
    expect(formatCnpj(input)).toBe(expected);
  });
});

describe('formatAmount', () => {
  it.each([
    ['', ''],
    ['0', ''],
    ['abc', ''],
    ['500', 'R$ 500'],
    ['1250000', 'R$ 1.250.000'],
    ['R$ 1.250', 'R$ 1.250'],
    ['007', 'R$ 7'],
  ])('%s vira %s', (input, expected) => {
    expect(formatAmount(input)).toBe(expected);
  });
});
