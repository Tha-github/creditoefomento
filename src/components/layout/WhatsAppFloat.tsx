import { MessageCircle } from 'lucide-react';

import { sectionIds } from '@/config/navigation';
import { useAnyInView } from '@/hooks/useAnyInView';
import { buildWhatsAppUrl } from '@/integrations/whatsapp';
import { cx } from '@/utils/cx';
import { externalLinkHint, externalLinkProps } from '@/utils/links';

import styles from './WhatsAppFloat.module.css';

/** No hero e no contato, o WhatsApp já tem botão visível, e o flutuante cobriria botões e campos. */
const HIDDEN_OVER = [sectionIds.hero, sectionIds.contact];

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
