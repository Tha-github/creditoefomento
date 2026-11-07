import { Plus } from 'lucide-react';
import { type ReactNode, useId, useState } from 'react';

import { cx } from '@/utils/cx';

import styles from './Accordion.module.css';

export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
}

interface AccordionProps {
  items: readonly AccordionItem[];
  headingLevel?: 'h3' | 'h4';
  className?: string;
}

/**
 * Segue o padrão de accordion da WAI-ARIA: título com botão, `aria-expanded` e painel ligado a ele.
 * Um item aberto por vez. Botões nativos garantem Tab, Enter e Espaço.
 */
export function Accordion({ items, headingLevel: Heading = 'h3', className }: AccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cx(styles.accordion, className)}>
      {items.map(({ id, question, answer }) => {
        const isOpen = openId === id;
        const buttonId = `${baseId}-${id}-botao`;
        const panelId = `${baseId}-${id}-painel`;

        return (
          <div key={id} className={cx(styles.item, isOpen && styles.open)}>
            <Heading className={styles.heading}>
              <button
                type="button"
                id={buttonId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : id)}
              >
                <span>{question}</span>
                <Plus className={styles.icon} size={22} strokeWidth={1.5} aria-hidden />
              </button>
            </Heading>
            {/* `visibility` tira o conteúdo fechado da navegação por teclado e de leitores de tela. */}
            <div id={panelId} role="region" aria-labelledby={buttonId} className={styles.panel}>
              <div className={styles.panelInner}>
                <div className={styles.answer}>{answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
