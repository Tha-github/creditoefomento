import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ShowcasePage } from '@/showcase/ShowcasePage';
import '@/styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento #root não encontrado em design-system.html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ShowcasePage />
  </StrictMode>,
);
