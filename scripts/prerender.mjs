// Grava o HTML de cada página dentro de dist, a partir do build de servidor (dist-ssr).
// Buscadores e visitantes recebem o conteúdo completo antes do JavaScript; o React o assume no navegador.
// Também adiciona o preload das fontes latinas, cujos nomes só existem depois do build.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

// Só o subconjunto latino: o português não usa os demais, que o navegador nem chega a baixar.
const FONT_FILES = [/^manrope-latin-wght-normal-.+\.woff2$/, /^inter-latin-wght-normal-.+\.woff2$/];
// Mesma base do build (BASE_PATH): `/` ou, no GitHub Pages, `/creditoefomento/`.
const rawBase = (process.env.BASE_PATH ?? '').trim().replace(/^\/+|\/+$/g, '');
const BASE = rawBase ? `/${rawBase}/` : '/';
const assets = await readdir('dist/assets');
const fontPreloads = FONT_FILES.map((pattern) => {
  const file = assets.find((name) => pattern.test(name));
  if (!file) throw new Error(`Fonte não encontrada em dist/assets: ${pattern}`);
  // `crossorigin` é obrigatório para fontes, mesmo na mesma origem, ou o arquivo é baixado duas vezes.
  return `<link rel="preload" as="font" type="font/woff2" href="${BASE}assets/${file}" crossorigin />`;
}).join('\n    ');

const ROOT_MARKER = '<div id="root"></div>';
// Preload de fontes só onde ele ajuda. Na home, medido no Lighthouse (mobile, mediana de 3 rodadas),
// ele disputa banda com a imagem principal e piora o LCP (2,39 s sem, 2,76 s com). Na política, sem
// imagem principal, ele evita o deslocamento de layout na troca de fonte (CLS de 0,031 para 0).
const PAGES = [
  { key: 'home', file: 'dist/index.html', preloadFonts: false },
  { key: 'privacy', file: 'dist/politica-de-privacidade/index.html', preloadFonts: true },
];

const { render } = await import(pathToFileURL('dist-ssr/entry-server.js').href);

for (const { key, file, preloadFonts } of PAGES) {
  const html = await readFile(file, 'utf8');
  if (!html.includes(ROOT_MARKER)) {
    throw new Error(`${file}: marcador ${ROOT_MARKER} não encontrado.`);
  }
  const markup = render(key);
  const withFonts = preloadFonts ? html.replace('</head>', `  ${fontPreloads}\n  </head>`) : html;
  const output = withFonts.replace(ROOT_MARKER, `<div id="root">${markup}</div>`);
  await writeFile(file, output);
  console.log(`pré-renderizado: ${file} (${Math.round(markup.length / 1024)} KB de HTML)`);
}

await rm('dist-ssr', { recursive: true, force: true });
