import { readFileSync } from 'node:fs';

interface VercelConfig {
  headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
}

/**
 * Headers globais definidos em vercel.json, para `npm run preview` testar a mesma política de produção.
 * Em http://localhost, remove o que só faz sentido com HTTPS: `upgrade-insecure-requests` tentaria
 * buscar os arquivos locais por HTTPS, e o HSTS é ignorado pelos navegadores fora de HTTPS.
 */
export function previewSecurityHeaders(vercelJsonPath: string): Record<string, string> {
  const config = JSON.parse(readFileSync(vercelJsonPath, 'utf8')) as VercelConfig;
  const global = config.headers.find((entry) => entry.source === '/(.*)');
  if (!global) throw new Error('vercel.json: bloco de headers "/(.*)" não encontrado.');

  const headers: Record<string, string> = {};
  for (const { key, value } of global.headers) {
    if (key === 'Strict-Transport-Security') continue;
    headers[key] =
      key === 'Content-Security-Policy'
        ? value.replace(/;\s*upgrade-insecure-requests/, '')
        : value;
  }
  return headers;
}
