import { createContactDeps, handleContactRequest } from '../server/contact/handler';

/**
 * Adaptador para funções serverless da Vercel, que publicam este arquivo em /api/contact.
 * Outras hospedagens só precisam chamar `handleContactRequest` com um `Request` padrão.
 */
export function POST(request: Request): Promise<Response> {
  return handleContactRequest(request, createContactDeps(process.env));
}
