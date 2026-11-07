import {
  type ContactErrorCode,
  type ContactErrors,
  type ContactFormValues,
  type ContactResponse,
  validateContact,
} from '../../shared/contact/validation';
import { createResendSender, type ContactSender } from './email';
import { createMemoryRateLimiter, createUpstashRateLimiter, type RateLimiter } from './rateLimit';

const MAX_BODY_BYTES = 16 * 1024;
/** Tempo mínimo entre exibir o formulário e enviá-lo. Abaixo disso, é provável que seja um robô. */
const MIN_FILL_TIME_MS = 3000;
const DEFAULT_EMAIL_API_URL = 'https://api.resend.com/emails';

export type ContactEnv = Record<string, string | undefined>;

export interface ContactDeps {
  rateLimiter: RateLimiter;
  /** `null` quando o envio de e-mail não está configurado. */
  sender: ContactSender | null;
  allowedOrigins: readonly string[];
  now: () => number;
}

const fallbackLimiter = createMemoryRateLimiter();

/** Lê a configuração do ambiente. Credenciais existem somente aqui, no servidor. */
export function createContactDeps(env: ContactEnv): ContactDeps {
  const { RESEND_API_KEY, CONTACT_EMAIL_FROM, CONTACT_EMAIL_TO } = env;
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env;

  return {
    rateLimiter:
      UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN
        ? createUpstashRateLimiter(
            { url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN },
            fallbackLimiter,
          )
        : fallbackLimiter,
    sender:
      RESEND_API_KEY && CONTACT_EMAIL_FROM && CONTACT_EMAIL_TO
        ? createResendSender({
            apiKey: RESEND_API_KEY,
            from: CONTACT_EMAIL_FROM,
            to: CONTACT_EMAIL_TO,
            apiUrl: env.RESEND_API_URL || DEFAULT_EMAIL_API_URL,
          })
        : null,
    allowedOrigins: (env.CONTACT_ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    now: Date.now,
  };
}

function json(status: number, body: ContactResponse, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    },
  });
}

function failure(
  status: number,
  error: ContactErrorCode,
  extra: { fieldErrors?: ContactErrors; headers?: Record<string, string> } = {},
) {
  const body: ContactResponse = { ok: false, error };
  if (extra.fieldErrors) body.fieldErrors = extra.fieldErrors;
  return json(status, body, extra.headers);
}

/** Só aceita envios do próprio site, ou das origens configuradas. */
function isAllowedOrigin(request: Request, allowedOrigins: readonly string[]): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;

  try {
    return new URL(origin).host === request.headers.get('host');
  } catch {
    return false;
  }
}

/** O cabeçalho é confiável apenas atrás de um proxy que o reescreve, como a hospedagem em produção. */
function clientIdentifier(request: Request): string {
  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

function text(value: unknown, keepLineBreaks = false): string {
  if (typeof value !== 'string') return '';
  // Remove caracteres de controle, mantendo as quebras de linha somente onde fazem sentido.
  const cleaned = keepLineBreaks
    ? value.replace(/[^\P{Cc}\r\n]/gu, '')
    : value.replace(/\p{Cc}+/gu, ' ');
  return cleaned.trim();
}

/** Aceita somente os campos conhecidos: o restante do corpo é descartado. */
function readValues(body: Record<string, unknown>): ContactFormValues {
  return {
    name: text(body.name),
    company: text(body.company),
    cnpj: text(body.cnpj),
    email: text(body.email),
    phone: text(body.phone),
    product: text(body.product),
    amount: text(body.amount),
    message: text(body.message, true),
    privacyAccepted: body.privacyAccepted === true,
  };
}

/** O tamanho declarado pode ser omitido ou falso: para de ler assim que o limite é ultrapassado. */
async function readLimitedBody(request: Request): Promise<string | null> {
  if (!request.body) return '';

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let result = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) return result + decoder.decode();
    total += value.length;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    result += decoder.decode(value, { stream: true });
  }
}

export async function handleContactRequest(request: Request, deps: ContactDeps): Promise<Response> {
  if (request.method !== 'POST') {
    return failure(405, 'method_not_allowed', { headers: { Allow: 'POST' } });
  }

  if (!isAllowedOrigin(request, deps.allowedOrigins)) {
    return failure(403, 'forbidden_origin');
  }

  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return failure(415, 'unsupported_media_type');
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return failure(413, 'payload_too_large');
  }

  // Conta toda tentativa, válida ou não, antes de qualquer processamento custoso.
  const limit = await deps.rateLimiter(clientIdentifier(request));
  if (!limit.allowed) {
    return failure(429, 'rate_limited', {
      headers: { 'Retry-After': String(limit.retryAfterSeconds) },
    });
  }

  if (!deps.sender) {
    console.error('contact: email_not_configured');
    return failure(503, 'not_configured');
  }

  const raw = await readLimitedBody(request);
  if (raw === null) {
    return failure(413, 'payload_too_large');
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return failure(400, 'invalid_body');
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return failure(400, 'invalid_body');
  }
  const payload = body as Record<string, unknown>;

  // Armadilha preenchida: é um robô. Responde como sucesso para não ensiná-lo a contornar, sem enviar nada.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return json(200, { ok: true });
  }

  const startedAt = payload.startedAt;
  if (typeof startedAt !== 'number' || deps.now() - startedAt < MIN_FILL_TIME_MS) {
    return failure(400, 'too_fast');
  }

  const values = readValues(payload);
  const { valid, errors } = validateContact(values);
  if (!valid) {
    return failure(422, 'validation_failed', { fieldErrors: errors });
  }

  try {
    await deps.sender(values);
  } catch (error) {
    // Registra apenas o motivo técnico: nunca os dados enviados.
    const reason = error instanceof Error ? error.message : 'unknown';
    console.error(`contact: send_failed ${/^[\w-]+$/.test(reason) ? reason : 'unknown'}`);
    return failure(502, 'send_failed');
  }

  return json(200, { ok: true });
}
