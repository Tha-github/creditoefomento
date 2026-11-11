# Logotipo da Crédito e Fomento

Pasta reservada ao arquivo original fornecido pela cliente. Não redesenhar nem recriar a marca.

Formato preferencial: SVG. Na falta dele, PNG ou WebP em alta resolução com fundo transparente, em versão legível sobre fundo preto.

## Como ativar

1. Copiar o arquivo para esta pasta, por exemplo `logo.svg`.
2. Em `src/config/brand.ts`, importar o arquivo e preencher `logo`:

   ```ts
   import logoUrl from '@/assets/brand/logo.svg';

   logo: { src: logoUrl, alt: 'Crédito e Fomento', width: 240, height: 60 },
   ```

   `width` e `height` devem ser as dimensões reais do arquivo, para evitar CLS.

3. Gerar o favicon e o ícone Apple a partir do arquivo original, substituindo `public/favicon.png` e `public/apple-touch-icon.png`.

O componente `src/components/brand/Logo.tsx` passa a exibir a imagem automaticamente.
