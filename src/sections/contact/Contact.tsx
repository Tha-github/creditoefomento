import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TextLink } from '@/components/ui/TextLink';
import { brand } from '@/config/brand';
import { sectionIds } from '@/config/navigation';
import { contactContent } from '@/content/contact';
import { buildWhatsAppUrl } from '@/integrations/whatsapp';

import styles from './Contact.module.css';
import { ContactForm } from './ContactForm';

export function Contact() {
  const { eyebrow, title, description, whatsappLabel, sensitiveDataNote } = contactContent;

  return (
    <Section id={sectionIds.contact} aria-labelledby="contato-titulo">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            titleId="contato-titulo"
          />
          <div className={styles.channel}>
            <p className={styles.channelLabel}>{whatsappLabel}</p>
            <TextLink href={buildWhatsAppUrl()} external>
              {brand.whatsapp.display}
            </TextLink>
          </div>
          <p className={styles.note}>{sensitiveDataNote}</p>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}
