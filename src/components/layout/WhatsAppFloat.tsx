import { MessageCircle } from 'lucide-react';

import { sectionIds } from '@/config/navigation';
import { useAnyInView } from '@/hooks/useAnyInView';
import { buildWhatsAppUrl } from '@/integrations/whatsapp';
import { cx } from '@/utils/cx';
import { externalLinkHint, externalLinkProps } from '@/utils/links';

import styles from './WhatsAppFloat.module.css';

/**
 * Oculto onde cobriria controles ou repetiria um acesso já visível: no hero e no footer, que têm
 * o WhatsApp; no FAQ, cujos botões ocupam a largura toda; e no contato, sobre o formulário.
 */
const HIDDEN_OVER = [sectionIds.hero, sectionIds.faq, sectionIds.contact, sectionIds.footer];

export function WhatsAppFloat() {
  const hidden = useAnyInView(HIDDEN_OVER);

  return (
    <a
      {...externalLinkProps}
      href={buildWhatsAppUrl()}
      className={cx(styles.float, hidden && styles.hidden)}
      aria-label={`Falar pelo WhatsApp ${externalLinkHint}`}
    >
      <MessageCircle size={24} strokeWidth={1.5} aria-hidden />
    </a>
  );
}
