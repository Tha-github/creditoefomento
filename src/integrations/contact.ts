import type {
  ContactErrors,
  ContactPayload,
  ContactResponse,
} from '@shared/contact/validation';

import { withBase } from '@/utils/paths';

/** Em hospedagem só estática, como o GitHub Pages, o endpoint não existe e o formulário informa que não enviou. */
const ENDPOINT = withBase('api/contact');
const TIMEOUT_MS = 20_000;

/** Só existe `success` quando o servidor confirma o envio. Nenhum outro caminho leva a ele. */
export type ContactSubmitResult =
  | { status: 'success' }
  | { status: 'validation'; fieldErrors: ContactErrors }
  | { status: 'too_fast' }
  | { status: 'rate_limited' }
  /** Endpoint inexistente ou sem credenciais: o formulário não está em condições de enviar. */
  | { status: 'unavailable' }
  | { status: 'failed' };

export async function submitContact(payload: ContactPayload): Promise<ContactSubmitResult> {
  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return { status: 'failed' };
  }

  // Sem endpoint: 404 em hospedagem comum; 405 no GitHub Pages, que só serve arquivos.
  if (response.status === 404 || response.status === 405) return { status: 'unavailable' };

  let body: ContactResponse;
  try {
    body = (await response.json()) as ContactResponse;
  } catch {
    return { status: 'failed' };
  }

  if (response.ok && body.ok === true) return { status: 'success' };
  if (body.ok !== false) return { status: 'failed' };

  switch (body.error) {
    case 'validation_failed':
      return { status: 'validation', fieldErrors: body.fieldErrors ?? {} };
    case 'too_fast':
      return { status: 'too_fast' };
    case 'rate_limited':
      return { status: 'rate_limited' };
    case 'not_configured':
      return { status: 'unavailable' };
    default:
      return { status: 'failed' };
  }
}
