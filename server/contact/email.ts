import { contactProducts, type ContactFormValues } from '../../shared/contact/validation';

export interface EmailConfig {
  apiKey: string;
  from: string;
  to: string;
  apiUrl: string;
}

export type ContactSender = (values: ContactFormValues) => Promise<void>;

/** Impede quebras de linha em campos de uma linha só, como o assunto. */
function singleLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, ' ').trim();
}

/** Somente texto puro: o conteúdo do visitante nunca é interpretado como HTML. */
export function buildContactEmail(values: ContactFormValues) {
  const product =
    contactProducts.find(({ value }) => value === values.product)?.label ?? values.product;

  return {
    subject: singleLine(`Nova solicitação: ${product} | ${values.company}`),
    text: [
      `Nome: ${singleLine(values.name)}`,
      `Empresa: ${singleLine(values.company)}`,
      `CNPJ: ${singleLine(values.cnpj) || 'Não informado'}`,
      `E-mail: ${singleLine(values.email)}`,
      `Telefone/WhatsApp: ${singleLine(values.phone)}`,
      `Produto de interesse: ${product}`,
      `Valor aproximado: ${singleLine(values.amount) || 'Não informado'}`,
      '',
      'Mensagem:',
      values.message.trim(),
      '',
      'Política de Privacidade aceita no envio do formulário.',
    ].join('\n'),
    replyTo: singleLine(values.email),
  };
}

/** Envia pela API REST do Resend. A resposta do provedor não é registrada, pois pode conter dados pessoais. */
export function createResendSender(
  { apiKey, from, to, apiUrl }: EmailConfig,
  fetcher: typeof fetch = fetch,
): ContactSender {
  return async (values) => {
    const { subject, text, replyTo } = buildContactEmail(values);

    const response = await fetcher(apiUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, text, reply_to: replyTo }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) throw new Error(`email_provider_status_${response.status}`);
  };
}
