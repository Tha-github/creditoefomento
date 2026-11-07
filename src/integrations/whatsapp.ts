import { brand } from '@/config/brand';

/** Monta o link wa.me. Não incluir dados pessoais do visitante na mensagem, pois ela vai na URL. */
export function buildWhatsAppUrl(message: string = brand.whatsapp.defaultMessage): string {
  return `https://wa.me/${brand.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/** Link com a mensagem já identificando o produto de interesse. */
export function buildProductWhatsAppUrl(productName: string): string {
  return buildWhatsAppUrl(
    `Olá! Tenho interesse na solução "${productName}" da ${brand.name} e gostaria de entender as possibilidades para a minha empresa.`,
  );
}
