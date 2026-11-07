import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildContactEmail, createResendSender } from './email';
import { createContactDeps, handleContactRequest, type ContactDeps } from './handler';
import { createMemoryRateLimiter, createUpstashRateLimiter, RATE_LIMIT } from './rateLimit';

const NOW = 1_000_000;
const PII = 'maria.sigilosa@empresa.com.br';

const validBody = {
  name: 'Maria Souza',
  company: 'Empresa Exemplo Ltda',
  cnpj: '',
  email: PII,
  phone: '(42) 99847-6331',
  product: 'capital-de-giro',
  amount: '',
  message: 'Gostaria de entender as possibilidades.',
  privacyAccepted: true,
  website: '',
  startedAt: NOW - 10_000,
};

function makeRequest(body: unknown = validBody, init: RequestInit & { origin?: string | null } = {}) {
  const { origin = 'https://site.test', ...rest } = init;
  const headers = new Headers({ 'content-type': 'application/json', host: 'site.test' });
  if (origin) headers.set('origin', origin);
  new Headers(rest.headers).forEach((value, name) => headers.set(name, value));
  return new Request('https://site.test/api/contact', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    ...rest,
    headers,
  });
}

function makeDeps(overrides: Partial<ContactDeps> = {}) {
  const sender = vi.fn(async () => {});
  const deps: ContactDeps = {
    rateLimiter: async () => ({ allowed: true, retryAfterSeconds: 0 }),
    sender,
    allowedOrigins: [],
    now: () => NOW,
    ...overrides,
  };
  return { deps, sender };
}

describe('handleContactRequest', () => {
  let logged: string[];

  beforeEach(() => {
    logged = [];
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      logged.push(args.join(' '));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('envia e confirma quando tudo é válido', async () => {
    const { deps, sender } = makeDeps();
    const response = await handleContactRequest(makeRequest(), deps);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(sender).toHaveBeenCalledOnce();
  });

  it('recusa método diferente de POST', async () => {
    const { deps, sender } = makeDeps();
    const response = await handleContactRequest(
      new Request('https://site.test/api/contact', { method: 'GET' }),
      deps,
    );
    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('POST');
    expect(sender).not.toHaveBeenCalled();
  });

  it.each([[null], ['https://outro-site.test']])('recusa a origem %s', async (origin) => {
    const { deps, sender } = makeDeps();
    const response = await handleContactRequest(makeRequest(validBody, { origin }), deps);
    expect(response.status).toBe(403);
    expect(sender).not.toHaveBeenCalled();
  });

  it('aceita origem configurada', async () => {
    const { deps } = makeDeps({ allowedOrigins: ['https://www.site.test'] });
    const response = await handleContactRequest(
      makeRequest(validBody, { origin: 'https://www.site.test' }),
      deps,
    );
    expect(response.status).toBe(200);
  });

  it('recusa conteúdo que não seja JSON', async () => {
    const { deps } = makeDeps();
    const response = await handleContactRequest(
      makeRequest('a=1', { headers: { 'content-type': 'application/x-www-form-urlencoded' } }),
      deps,
    );
    expect(response.status).toBe(415);
  });

  it('recusa corpo grande demais, sem ler o conteúdo', async () => {
    const { deps, sender } = makeDeps();
    const response = await handleContactRequest(
      makeRequest({ ...validBody, message: 'a'.repeat(20_000) }),
      deps,
    );
    expect(response.status).toBe(413);
    expect(sender).not.toHaveBeenCalled();
  });

  it.each(['não é json', '[]', 'null', '1'])('recusa o corpo inválido %s', async (body) => {
    const { deps } = makeDeps();
    const response = await handleContactRequest(makeRequest(body), deps);
    expect(response.status).toBe(400);
  });

  it('valida no servidor e devolve os erros por campo, sem enviar', async () => {
    const { deps, sender } = makeDeps();
    const response = await handleContactRequest(
      makeRequest({ ...validBody, email: 'invalido', privacyAccepted: false }),
      deps,
    );
    expect(response.status).toBe(422);
    const body = (await response.json()) as { fieldErrors: Record<string, string> };
    expect(Object.keys(body.fieldErrors).sort()).toEqual(['email', 'privacyAccepted']);
    expect(sender).not.toHaveBeenCalled();
  });

  it('exige que o aceite seja verdadeiro, e não apenas preenchido', async () => {
    const { deps, sender } = makeDeps();
    const response = await handleContactRequest(
      makeRequest({ ...validBody, privacyAccepted: 'true' }),
      deps,
    );
    expect(response.status).toBe(422);
    expect(sender).not.toHaveBeenCalled();
  });

  it('trata tipos inesperados como campos vazios', async () => {
    const { deps, sender } = makeDeps();
    const response = await handleContactRequest(
      makeRequest({ ...validBody, name: { $ne: 1 }, email: ['a@b.com'] }),
      deps,
    );
    expect(response.status).toBe(422);
    expect(sender).not.toHaveBeenCalled();
  });

  it('descarta a armadilha preenchida sem enviar nada', async () => {
    const { deps, sender } = makeDeps();
    const response = await handleContactRequest(
      makeRequest({ ...validBody, website: 'https://spam.test' }),
      deps,
    );
    expect(response.status).toBe(200);
    expect(sender).not.toHaveBeenCalled();
  });

  it.each([[NOW - 500], ['ontem'], [undefined]])(
    'recusa envio rápido demais ou sem horário: %s',
    async (startedAt) => {
      const { deps, sender } = makeDeps();
      const response = await handleContactRequest(makeRequest({ ...validBody, startedAt }), deps);
      expect(response.status).toBe(400);
      expect(sender).not.toHaveBeenCalled();
    },
  );

  it('responde 429 com Retry-After quando o limite é atingido', async () => {
    const { deps, sender } = makeDeps({
      rateLimiter: async () => ({ allowed: false, retryAfterSeconds: 120 }),
    });
    const response = await handleContactRequest(makeRequest(), deps);
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('120');
    expect(sender).not.toHaveBeenCalled();
  });

  it('nunca confirma sem credenciais: responde 503', async () => {
    const response = await handleContactRequest(makeRequest(), {
      ...createContactDeps({}),
      now: () => NOW,
    });
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, error: 'not_configured' });
  });

  it('informa falha quando o provedor recusa, sem registrar dados pessoais', async () => {
    const { deps } = makeDeps({
      sender: async () => {
        throw new Error(`falha ao enviar para ${PII}`);
      },
    });
    const response = await handleContactRequest(makeRequest(), deps);
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain(PII);
    expect(logged.join('\n')).not.toContain(PII);
    expect(logged.join('\n')).toContain('send_failed');
  });

  it('nas respostas, não devolve o que foi enviado nem permite cache', async () => {
    const { deps } = makeDeps();
    const response = await handleContactRequest(makeRequest(), deps);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.text()).not.toContain(PII);
  });
});

describe('limite de envios', () => {
  it('bloqueia acima do máximo e libera na janela seguinte', async () => {
    let time = 0;
    const limiter = createMemoryRateLimiter(() => time);
    for (let attempt = 0; attempt < RATE_LIMIT.maxRequests; attempt += 1) {
      expect((await limiter('1.1.1.1')).allowed).toBe(true);
    }
    const blocked = await limiter('1.1.1.1');
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect((await limiter('2.2.2.2')).allowed).toBe(true);

    time += RATE_LIMIT.windowSeconds * 1000 + 1;
    expect((await limiter('1.1.1.1')).allowed).toBe(true);
  });

  it('usa o Upstash sem enviar o IP em texto puro', async () => {
    const fetcher = vi.fn(async () =>
      Response.json([{ result: 6 }, { result: 0 }, { result: 300 }]),
    );
    const limiter = createUpstashRateLimiter(
      { url: 'https://redis.test/', token: 'segredo' },
      createMemoryRateLimiter(),
      fetcher as unknown as typeof fetch,
    );
    const result = await limiter('203.0.113.9');
    expect(result).toEqual({ allowed: false, retryAfterSeconds: 300 });
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://redis.test/pipeline');
    expect(String(init.body)).not.toContain('203.0.113.9');
  });

  it('recorre à reserva em memória se o Upstash falhar', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const limiter = createUpstashRateLimiter(
      { url: 'https://redis.test', token: 'segredo' },
      createMemoryRateLimiter(),
      (async () => {
        throw new Error('fora do ar');
      }) as unknown as typeof fetch,
    );
    expect((await limiter('1.1.1.1')).allowed).toBe(true);
    vi.restoreAllMocks();
  });
});

describe('e-mail', () => {
  const values = { ...validBody, company: 'Empresa\r\nBcc: alvo@spam.test' };

  it('remove quebras de linha dos campos de uma linha', () => {
    const { subject, text } = buildContactEmail(values);
    expect(subject).not.toMatch(/[\r\n]/);
    expect(text).toContain('Empresa: Empresa Bcc: alvo@spam.test');
  });

  it('chama o provedor somente com texto puro e a chave no cabeçalho', async () => {
    const fetcher = vi.fn(async () => new Response('{}', { status: 200 }));
    await createResendSender(
      { apiKey: 'chave-secreta', from: 'de@site.test', to: 'para@site.test', apiUrl: 'https://mail.test' },
      fetcher as unknown as typeof fetch,
    )(values);
    const [, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    expect(body.html).toBeUndefined();
    expect(body.reply_to).toBe(PII);
    expect(String(init.body)).not.toContain('chave-secreta');
    expect(new Headers(init.headers).get('authorization')).toBe('Bearer chave-secreta');
  });

  it('lança erro sem detalhes quando o provedor recusa', async () => {
    const sender = createResendSender(
      { apiKey: 'k', from: 'a@a.a', to: 'b@b.b', apiUrl: 'https://mail.test' },
      (async () => new Response('corpo', { status: 500 })) as unknown as typeof fetch,
    );
    await expect(sender(values)).rejects.toThrow('email_provider_status_500');
  });
});
