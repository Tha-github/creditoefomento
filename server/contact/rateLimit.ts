import { createHash } from 'node:crypto';

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export type RateLimiter = (clientId: string) => Promise<RateLimitResult>;

export const RATE_LIMIT = {
  maxRequests: 5,
  windowSeconds: 600,
} as const;

/** O IP só existe em forma de hash e pelo tempo da janela: nenhum dado pessoal fica armazenado. */
export function hashClientId(clientId: string): string {
  return createHash('sha256').update(clientId).digest('hex').slice(0, 32);
}

/**
 * Limitador em memória. Vale por instância: em hospedagem serverless, cada instância conta
 * separadamente. É suficiente em desenvolvimento e como reserva, não como proteção de produção.
 */
export function createMemoryRateLimiter(now: () => number = Date.now): RateLimiter {
  const windows = new Map<string, { count: number; resetAt: number }>();

  return async (clientId) => {
    const key = hashClientId(clientId);
    const time = now();

    for (const [storedKey, window] of windows) {
      if (window.resetAt <= time) windows.delete(storedKey);
    }

    const current = windows.get(key) ?? {
      count: 0,
      resetAt: time + RATE_LIMIT.windowSeconds * 1000,
    };
    current.count += 1;
    windows.set(key, current);

    return {
      allowed: current.count <= RATE_LIMIT.maxRequests,
      retryAfterSeconds: Math.ceil((current.resetAt - time) / 1000),
    };
  };
}

interface UpstashConfig {
  url: string;
  token: string;
}

/**
 * Limitador compartilhado entre instâncias, pela API REST do Upstash Redis.
 * Se o serviço falhar, usa a reserva em memória: o formulário continua no ar, com proteção menor.
 */
export function createUpstashRateLimiter(
  { url, token }: UpstashConfig,
  fallback: RateLimiter,
  fetcher: typeof fetch = fetch,
): RateLimiter {
  return async (clientId) => {
    const key = `contact:rate:${hashClientId(clientId)}`;

    try {
      const response = await fetcher(`${url.replace(/\/$/, '')}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, RATE_LIMIT.windowSeconds, 'NX'],
          ['TTL', key],
        ]),
        signal: AbortSignal.timeout(3000),
      });
      if (!response.ok) throw new Error(`status ${response.status}`);

      const results = (await response.json()) as Array<{ result?: unknown }>;
      const count = results[0]?.result;
      const ttl = results[2]?.result;
      if (typeof count !== 'number') throw new Error('resposta inesperada');

      return {
        allowed: count <= RATE_LIMIT.maxRequests,
        retryAfterSeconds:
          typeof ttl === 'number' && ttl > 0 ? ttl : RATE_LIMIT.windowSeconds,
      };
    } catch {
      console.error('contact: rate_limit_store_unavailable');
      return fallback(clientId);
    }
  };
}
