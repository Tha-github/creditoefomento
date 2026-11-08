# Imagens

Todas as fotografias estão em CC0, sem exigência de atribuição. Foram convertidas para preto e branco, com brilho reduzido, e cada recorte existe em duas larguras, em AVIF e WebP. O navegador escolhe a largura pela tela e pela densidade de pixels (`srcset` e `sizes`).

## hero/

"Looking up at the skyscrapers in San Francisco DSF3562", de Levi Meir Clancy.

- Origem: https://commons.wikimedia.org/wiki/File:Looking_up_at_the_skyscrapers_in_San_Francisco_DSF3562.jpg
- Desktop: 1200 e 1800 px de largura. Mobile: 600 e 900 px.

É a imagem principal (LCP): carrega sem adiamento, com prioridade alta e com preload em `index.html`. Se os arquivos mudarem, atualizar o preload, que precisa das mesmas larguras e do mesmo `sizes` de `src/sections/hero/Hero.tsx`.

## about/

"Dark glass facade", de Mike Wilson.

- Origem: https://commons.wikimedia.org/wiki/File:Dark_glass_facade_(Unsplash).jpg
- Desktop: 800 e 1400 px de largura. Mobile: 800 e 1170 px.

Carregamento adiado (`loading="lazy"`), por estar fora da primeira dobra.
