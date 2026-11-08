import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';

import type { PageKey } from '@shared/site';

import { App } from '@/App';
import { PrivacyPage } from '@/pages/PrivacyPage';

/** Usado somente no build (scripts/prerender.mjs). Nunca chega ao navegador. */
export function render(page: PageKey): string {
  const Page = page === 'home' ? App : PrivacyPage;
  return renderToString(
    <StrictMode>
      <Page />
    </StrictMode>,
  );
}
