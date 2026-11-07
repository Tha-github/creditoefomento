# Crédito e Fomento

Site institucional. Requisitos e regras do projeto em [CLAUDE.md](CLAUDE.md).

## Stack

React, TypeScript e Vite. Estilos com CSS nativo: variáveis e camadas globais, CSS Modules nos componentes. Fontes Manrope e Inter auto-hospedadas via Fontsource. Ícones com Lucide React.

## Scripts

| Comando                    | Função                                  |
| -------------------------- | --------------------------------------- |
| `npm run dev`              | Servidor de desenvolvimento             |
| `npm run build`            | Checagem de tipos e build de produção   |
| `npm run preview`          | Serve o build localmente                |
| `npm run build:showcase`   | Build separado da vitrine               |
| `npm run preview:showcase` | Serve o build da vitrine                |
| `npm run typecheck`        | Apenas checagem de tipos                |
| `npm test`                 | Testes de validação, máscaras e servidor |
| `npm run lint`             | ESLint (`any` explícito é erro)         |

## Estrutura

```
public/               Arquivos servidos sem processamento (favicon)
design-system.html    Entrada da vitrine, fora do build de produção
api/                  Adaptador do endpoint para a hospedagem
server/contact/       Endpoint do formulário: validação, limite de envios e e-mail
shared/contact/       Regras do formulário, usadas no navegador e no servidor
src/
  assets/brand/       Logotipo original da cliente (ver README da pasta)
  assets/images/      Fotografias, com origem e licença no README da pasta
  components/
    brand/            Logo: único ponto de renderização da marca
    form/             Campos de formulário
    layout/           Container, Section, Grid, Header, MobileMenu, SkipLink, WhatsAppFloat
    ui/               Button, ButtonLink, TextLink, Card, FeatureList, Eyebrow, SectionHeading, Accordion
    visual/           Divider, IconBadge, GeometricMark
  config/             Marca e configurações globais
  content/            Textos institucionais
  data/               Dados dos produtos
  hooks/              Hooks reutilizáveis
  integrations/       Serviços externos (WhatsApp, envio do formulário)
  pages/              Composição das páginas
  sections/           Seções independentes da página
  showcase/           Vitrine do design system
  styles/             Reset, variáveis e estilos base
  utils/              Utilitários
```

Imports internos usam o alias `@/`, que aponta para `src/`.

## Design system

Com `npm run dev`, a vitrine fica em `/design-system.html`. O build de produção (`npm run build`) não a inclui. Para gerar uma versão estática, por exemplo para apresentar à cliente, usar `npm run build:showcase`, que grava em `dist-showcase/`.

Regras de uso:

- Valores visuais vêm de `src/styles/tokens.css`. Não fixar cores, tamanhos ou espaçamentos nos componentes.
- O dourado fica reservado a ações, rótulos e pequenos detalhes.
- `--color-gray` e `--color-gold-dark` não têm contraste suficiente para texto pequeno em todos os fundos. Para legendas, usar `--color-text-subtle`.
- `Card` com `variant="featured"` é reservado à antecipação de recebíveis.
- Cada `Section` define o tom do fundo e, com ele, a superfície dos cards. Não definir o fundo do card manualmente.
- Efeitos de hover ficam em `@media (hover: hover)`, para não ficarem presos em telas de toque.

## Formulário de contato

> **Não está pronto para produção.** O código está completo, mas o envio real depende das credenciais abaixo. Sem elas, o endpoint responde `503`, o formulário informa que a solicitação não foi enviada e oferece o WhatsApp. Nunca há confirmação sem envio.

Fluxo: `ContactForm` → `src/integrations/contact.ts` → `POST /api/contact` → `server/contact/handler.ts` → API do Resend → e-mail da equipe comercial. As regras de validação ficam em `shared/contact/validation.ts` e rodam nos dois lados.

### Para colocar em produção

1. Definir o e-mail que recebe as solicitações e o domínio de envio, verificado no [Resend](https://resend.com).
2. Criar um banco [Upstash Redis](https://upstash.com), para o limite de envios valer entre instâncias.
3. Cadastrar na hospedagem as variáveis de [.env.example](.env.example). Em desenvolvimento, copiá-las para `.env.local`.
4. Publicar o endpoint. `api/contact.ts` é o adaptador para funções serverless da Vercel, ainda não testado em uma implantação real. Em outra hospedagem, basta chamar `handleContactRequest` com um `Request` padrão.
5. Enviar uma solicitação real e confirmar o recebimento.

### Proteções do endpoint

- Validação no servidor com as mesmas regras do navegador, aceitando apenas os campos conhecidos.
- Limite de 5 tentativas a cada 10 minutos por IP. O IP é guardado apenas como hash e pelo tempo da janela. Sem Upstash, o limite é por instância, o que não protege em hospedagem serverless.
- Antispam: campo-armadilha, que recebe uma resposta de sucesso sem nada ser enviado, para não orientar o robô; e tempo mínimo de preenchimento de 3 segundos.
- Somente a origem do próprio site e as de `CONTACT_ALLOWED_ORIGINS`; somente JSON; corpo de até 16 KB.
- Nada é armazenado: os dados só seguem por e-mail, em texto puro.
- Os logs registram apenas códigos técnicos, nunca os dados enviados nem a resposta do provedor.

O IP vem de `x-real-ip` ou `x-forwarded-for`, cabeçalhos confiáveis apenas atrás de um proxy que os reescreva, como a Vercel. Em outra hospedagem, conferir esse ponto.

Em `npm run dev` e `npm run preview`, o mesmo endpoint é servido localmente pelo plugin em `server/contact/vitePlugin.ts`, que não entra no build do site.

## Credenciais

Variáveis `VITE_*` são embutidas no JavaScript público: nunca usar esse prefixo para segredos. Credenciais ficam apenas no servidor ou na hospedagem. Arquivos `.env` estão no `.gitignore`.

## Pendências

- Logotipo original: não fornecido. Até lá, a marca aparece como texto simples e o favicon é neutro e provisório.
- Referência ONCredz: não consultada diretamente. A direção visual segue a descrição do `CLAUDE.md`.
- **Formulário de contato: não está pronto para produção.** Ver "Formulário de contato" acima.
- Política de Privacidade: o formulário traz apenas um resumo. A versão completa ainda deve ser redigida e validada pela empresa antes da publicação.
- Ações da seção de soluções: abrem o WhatsApp com o produto identificado. Avaliar direcioná-las ao formulário.
- Textos das soluções, FAQ e descrições de "Como atuamos": redigidos a partir do briefing, a validar pela cliente.
- Imagens do hero e da seção Sobre: fotografias CC0 de banco público, a aprovar pela cliente.
- Domínio de produção: necessário para canonical, `og:url`, `sitemap.xml` e `robots.txt`.
- Hospedagem: necessária para definir headers de segurança e CSP.
- Portfólio de produtos: validar com a cliente.
