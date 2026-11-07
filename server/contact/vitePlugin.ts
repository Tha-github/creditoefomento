import type { IncomingMessage, ServerResponse } from 'node:http';

import { loadEnv, type Connect, type Plugin } from 'vite';

import { createContactDeps, handleContactRequest } from './handler';

const ENDPOINT = '/api/contact';
const MAX_READ_BYTES = 64 * 1024;

/** Lê até o fim, mesmo acima do limite: interromper a leitura derrubaria a conexão antes da resposta. */
async function readBody(req: IncomingMessage): Promise<Buffer | null> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string);
    total += buffer.length;
    if (total <= MAX_READ_BYTES) chunks.push(buffer);
  }
  return total > MAX_READ_BYTES ? null : Buffer.concat(chunks);
}

async function toRequest(req: IncomingMessage, body: Buffer | null): Promise<Request> {
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(name, value);
  }
  // Como a hospedagem em produção: o IP vem da conexão, e não de um cabeçalho do cliente.
  headers.delete('x-forwarded-for');
  headers.set('x-real-ip', req.socket.remoteAddress ?? 'unknown');

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  return new Request(`http://${req.headers.host ?? 'localhost'}${req.url ?? ENDPOINT}`, {
    method: req.method,
    headers,
    ...(hasBody && body ? { body: new Uint8Array(body) } : {}),
  });
}

async function send(res: ServerResponse, response: Response) {
  res.statusCode = response.status;
  response.headers.forEach((value, name) => res.setHeader(name, value));
  res.end(await response.text());
}

/**
 * Serve o endpoint real em `npm run dev` e `npm run preview`, lendo `.env.local`.
 * Não entra no build do site: em produção, quem serve o endpoint é a hospedagem (ver api/contact.ts).
 */
export function contactEndpointPlugin(): Plugin {
  let env: Record<string, string> = {};

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    if (req.url?.split('?')[0] !== ENDPOINT) {
      next();
      return;
    }

    void (async () => {
      const body = await readBody(req);
      if (body === null) {
        // Corpo maior que o limite de leitura: informa o tamanho e deixa o handler recusar.
        req.headers['content-length'] = String(MAX_READ_BYTES + 1);
      }
      const request = await toRequest(req, body);
      await send(res, await handleContactRequest(request, createContactDeps(env)));
    })().catch(() => {
      console.error('contact: dev_endpoint_error');
      res.statusCode = 500;
      res.end();
    });
  };

  return {
    name: 'contact-endpoint',
    configResolved(config) {
      env = loadEnv(config.mode, config.envDir || process.cwd(), '');
    },
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
