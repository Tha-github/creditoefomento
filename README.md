# Crédito e Fomento

Site institucional. Requisitos e regras do projeto em [CLAUDE.md](CLAUDE.md).

## Stack

React, TypeScript e Vite. Estilos com CSS nativo: variáveis e camadas globais, CSS Modules nos componentes. Fontes Manrope e Inter auto-hospedadas via Fontsource. Ícones com Lucide React.

## Scripts

| Comando                    | Função                                  |
| -------------------------- | --------------------------------------- |
| `npm run dev`              | Servidor de desenvolvimento             |
| `npm run build`            | Checagem de tipos, build de produção e pré-renderização |
| `npm run preview`          | Serve o build localmente, com os headers de segurança de produção |
| `npm run check`            | Lint, tipos, testes e auditoria de dependências |
| `npm run build:showcase`   | Build separado da vitrine               |
| `npm run preview:showcase` | Serve o build da vitrine                |
| `npm run typecheck`        | Apenas checagem de tipos                |
| `npm test`                 | Testes de validação, máscaras e servidor |
| `npm run lint`             | ESLint (`any` explícito é erro)         |

## Estrutura

```
public/               Arquivos servidos sem processamento (favicon)
design-system.html    Entrada da vitrine, fora do build de produção
politica-de-privacidade/  Entrada da página da Política de Privacidade
api/                  Adaptador do endpoint para a hospedagem
vercel.json           Headers de segurança e cache em produção
tooling/              Geração de SEO e headers do preview
scripts/              Pré-renderização das páginas
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

## Publicação no GitHub Pages

**Endereço: https://tha-github.github.io/creditoefomento/**

A cada push na `main`, [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) roda lint, tipos e testes, faz o build com `BASE_PATH=/creditoefomento/` e `SITE_URL` do Pages e publica o conteúdo de `dist`. Em Settings > Pages, a fonte deve ser **GitHub Actions**.

**Limitações do GitHub Pages**, que só serve arquivos estáticos:

- **O formulário não envia.** Não há como rodar `/api/contact` no Pages: o formulário informa que a solicitação não foi enviada e oferece o WhatsApp. Para enviar, o endpoint precisa de uma hospedagem com funções (Vercel, por exemplo).
- **Sem headers de segurança.** O `vercel.json` é ignorado. A CSP é aplicada pelo próprio HTML (`<meta http-equiv>`), mas a proteção contra incorporação em iframe, o HSTS e os demais headers não existem no Pages. O HTTPS é fornecido pelo próprio GitHub.
- **`robots.txt` não vale em subcaminho:** buscadores só o leem na raiz do domínio (`tha-github.github.io/robots.txt`). O sitemap pode ser enviado pelo Google Search Console.

**Com domínio próprio**, no Pages ou em outra hospedagem, trocar no workflow `BASE_PATH` para `/` e `SITE_URL` para o domínio.

## SEO e páginas

- **Páginas:** `index.html` (home) e `politica-de-privacidade/index.html`, publicada em `/politica-de-privacidade/`.
- **Pré-renderização:** `npm run build` gera o HTML completo de cada página (`src/entry-server.tsx` e `scripts/prerender.mjs`). Buscadores e visitantes recebem o conteúdo antes do JavaScript, e o React o assume no navegador. `npm run dev` não pré-renderiza.
- **Metadados:** title, description, Open Graph, canonical e dados estruturados (Organization e WebSite) são gerados no build por `tooling/seoPlugin.ts`, a partir de `shared/site.ts`.
- **`SITE_URL`:** definir na hospedagem antes do build de produção, por exemplo `https://www.dominio.com.br`. Sem ela, canonical, `og:url`, `og:image` e `sitemap.xml` são omitidos, e o build avisa. O `robots.txt` é gerado sempre.
- **Imagem de compartilhamento:** `public/og-image.jpg` (1200x630) traz o nome em texto. Gerar de novo quando o logotipo original chegar.

### Política de Privacidade

A página permanece em **versão preliminar**: mostra um aviso, recebe `noindex` e fica fora do sitemap. Ela descreve somente os campos e o comportamento conhecido do site; a identificação jurídica, os registros da hospedagem e seus prazos de retenção não foram informados.

Depois de preencher e validar juridicamente o texto, trocar `privacyPolicyValidated` para `true` em `shared/site.ts`.

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

## Performance

- **Imagens:** AVIF com WebP de reserva, duas larguras por recorte, dimensões explícitas. A imagem principal não é adiada e tem preload; a da seção Sobre usa `loading="lazy"`.
- **Fontes:** auto-hospedadas, com `font-display: swap`. O navegador baixa só o subconjunto latino. Fontes nunca são embutidas como `data:` (ver `vite.config.ts`). O preload das fontes existe só na Política de Privacidade: na home, medido no Lighthouse, ele piorava o LCP no mobile ao disputar banda com a imagem principal.
- **Pré-renderização:** o HTML chega completo, então o primeiro conteúdo aparece antes do JavaScript.
- **Animações:** só `transform` e `opacity`, nenhuma em loop. A imagem e o título do hero, candidatos a LCP, entram já visíveis, só com movimento. Com `prefers-reduced-motion`, nenhuma animação roda.
- **JavaScript:** o Lighthouse aponta cerca de 40 KB não usados no carregamento. São componentes que só agem com interação, como o formulário, o FAQ e o menu. Separá-los em arquivos à parte exigiria trocar a hidratação do HTML pré-renderizado por renderização no navegador, com perda maior. Decisão consciente; reavaliar se o site crescer.

## Segurança

Os headers de produção estão em [vercel.json](vercel.json). `npm run preview` aplica os mesmos headers, lidos desse arquivo, para que a CSP seja testada localmente. Em http://localhost, ficam de fora o HSTS e o `upgrade-insecure-requests`.

| Header | Valor e motivo |
| --- | --- |
| `Content-Security-Policy` | Tudo restrito à própria origem: scripts, estilos, imagens, fontes e conexões. Sem `unsafe-inline` nem `unsafe-eval`. Proíbe incorporação em iframe (`frame-ancestors 'none'`) e força HTTPS nos recursos. |
| `Strict-Transport-Security` | 2 anos, sem `includeSubDomains`: subdomínios da empresa podem não ter HTTPS. Ampliar depois de confirmar. |
| `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` | Proteções padrão; câmera, microfone, localização e pagamento ficam desativados. |
| `Cache-Control` em `/assets/` | Um ano e `immutable`: os nomes mudam a cada versão. |

**Se a CSP mudar:** o JSON-LD é um bloco de dados e não é afetado. Qualquer script, estilo inline ou serviço externo novo, como análise de navegação, chat ou fontes de terceiros, precisa ser incluído na política, ou será bloqueado.

**O que foi verificado:**
- sem `dangerouslySetInnerHTML`, `innerHTML` ou `eval`;
- o e-mail sai em texto puro;
- o JSON-LD é escapado;
- o código do navegador não lê variáveis de ambiente;
- o build público não contém credenciais, código do servidor nem source maps;
- todos os links em nova aba usam `noopener noreferrer`;
- os links do WhatsApp não levam dados pessoais;
- não há armazenamento no navegador.

O endpoint do formulário está descrito em "Formulário de contato".

**Dependências:** `npm audit` sem vulnerabilidades. A versão do `minimatch`, usada só pelo ESLint em desenvolvimento, é forçada em `overrides` no `package.json` para corrigir um aviso de negação de serviço. Remover o override quando o ESLint atualizar a dependência.

Headers não tornam um site seguro por si sós. Eles reduzem classes específicas de ataque e dependem de a hospedagem aplicá-los.

## Depende de infraestrutura externa

| Item | Situação |
| --- | --- |
| Hospedagem | Não definida. `vercel.json` e `api/contact.ts` foram escritos para a Vercel e ainda não foram testados em uma implantação real. Em outra hospedagem, os headers precisam ser recriados no formato dela. |
| HTTPS | Depende da hospedagem e do domínio. O HSTS e o `upgrade-insecure-requests` só fazem efeito com HTTPS ativo. |
| Domínio (`SITE_URL`) | Necessário para canonical, Open Graph e sitemap. |
| Envio do formulário | Resend: conta, domínio verificado e e-mail de destino. |
| Limite de envios | Upstash Redis. Sem ele, o limite vale só por instância. |
| Página 404 | A hospedagem mostra a página padrão dela. Não há página 404 própria. |

## LGPD

**Revisão do formulário e do tratamento de dados:**
- **Coleta mínima:** nome da empresa, CNPJ e WhatsApp são obrigatórios; e-mail corporativo é opcional. O formulário não solicita documentos ou dados sensíveis.
- **Consentimento:** a caixa de aceite começa desmarcada e é obrigatória no navegador e no servidor. O servidor exige o valor booleano `true`. Não há consentimento para marketing.
- **Armazenamento e exposição:** nada fica guardado no site; os dados seguem só por e-mail. O IP vira hash por 10 minutos. Nenhum dado pessoal aparece em URLs ou logs. O site não usa cookies, análise de navegação ou armazenamento local.
- **Política de Privacidade:** versão preliminar, com 8 pendências que dependem da empresa.

Esta revisão é técnica e não substitui a validação jurídica.

## Credenciais

Variáveis `VITE_*` são embutidas no JavaScript público: nunca usar esse prefixo para segredos. Credenciais ficam apenas no servidor ou na hospedagem. Arquivos `.env` estão no `.gitignore`.

## Pendências

- Logotipo original: não fornecido. Até lá, a marca aparece como texto simples e o favicon é neutro e provisório.
- Referência ONCredz: não consultada diretamente. A direção visual segue a descrição do `CLAUDE.md`.
- **Formulário de contato: não está pronto para produção.** Ver "Formulário de contato" acima.
- Política de Privacidade: versão preliminar publicada em `/politica-de-privacidade/`, com pendências marcadas. Ver "SEO e páginas".
- Domínio (`SITE_URL`): necessário para canonical, Open Graph e sitemap.
- Ações da seção de soluções: abrem o WhatsApp com o produto identificado. Avaliar direcioná-las ao formulário.
- Textos das soluções, FAQ e descrições de "Como atuamos": redigidos a partir do briefing, a validar pela cliente.
- Imagens do hero e da seção Sobre: fotografias CC0 de banco público, a aprovar pela cliente.
- Hospedagem: necessária para definir headers de segurança e CSP.
- Portfólio de produtos: validar com a cliente.
