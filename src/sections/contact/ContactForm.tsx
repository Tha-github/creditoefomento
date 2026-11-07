import { ArrowRight, ChevronDown, CircleCheck } from 'lucide-react';
import { type FormEvent, useEffect, useRef } from 'react';

import { contactLimits, contactProducts } from '@shared/contact/validation';

import {
  CheckboxField,
  SelectField,
  TextareaField,
  TextField,
} from '@/components/form/Field';
import { Button } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';
import { contactContent } from '@/content/contact';
import { buildWhatsAppUrl } from '@/integrations/whatsapp';
import { formatAmount, formatCnpj, formatPhone } from '@/utils/masks';

import styles from './ContactForm.module.css';
import { contactFieldId, type ContactFormStatus, useContactForm } from './useContactForm';

const { fields, privacy, success, errors: errorMessages } = contactContent;

function isProblem(status: ContactFormStatus): status is keyof typeof errorMessages & ContactFormStatus {
  return status !== 'idle' && status !== 'submitting' && status !== 'success';
}

function SuccessPanel({ onReset }: { onReset: () => void }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Leva o foco à confirmação: o formulário, onde o foco estava, deixa de existir.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <div className={styles.panel}>
      <div className={styles.success}>
        <CircleCheck className={styles.successIcon} size={32} strokeWidth={1.25} aria-hidden />
        <h3 ref={titleRef} tabIndex={-1} className={styles.successTitle}>
          {success.title}
        </h3>
        <p className={styles.successText}>{success.text}</p>
        <p className={styles.successNote}>{success.note}</p>
        <Button variant="secondary" onClick={onReset}>
          {success.again}
        </Button>
      </div>
    </div>
  );
}

export function ContactForm() {
  const { values, errors, status, website, setWebsite, setField, blurField, submit, reset } =
    useContactForm();

  if (status === 'success') {
    return <SuccessPanel onReset={reset} />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  const submitting = status === 'submitting';
  const canUseWhatsApp = status === 'failed' || status === 'unavailable' || status === 'rate_limited';

  return (
    <form className={styles.panel} onSubmit={handleSubmit} noValidate aria-label="Formulário de contato">
      <div className={styles.grid}>
        <TextField
          className={styles.full}
          id={contactFieldId('name')}
          label={fields.name.label}
          autoComplete={fields.name.autoComplete}
          maxLength={contactLimits.name}
          value={values.name}
          error={errors.name}
          onValueChange={(value) => setField('name', value)}
          onBlur={() => blurField('name')}
        />
        <TextField
          id={contactFieldId('company')}
          label={fields.company.label}
          autoComplete={fields.company.autoComplete}
          maxLength={contactLimits.company}
          value={values.company}
          error={errors.company}
          onValueChange={(value) => setField('company', value)}
          onBlur={() => blurField('company')}
        />
        <TextField
          id={contactFieldId('cnpj')}
          label={fields.cnpj.label}
          optional
          placeholder={fields.cnpj.placeholder}
          autoComplete="off"
          autoCapitalize="characters"
          format={formatCnpj}
          value={values.cnpj}
          error={errors.cnpj}
          onValueChange={(value) => setField('cnpj', value)}
          onBlur={() => blurField('cnpj')}
        />
        <TextField
          id={contactFieldId('email')}
          label={fields.email.label}
          type="email"
          inputMode="email"
          placeholder={fields.email.placeholder}
          autoComplete={fields.email.autoComplete}
          maxLength={contactLimits.email}
          value={values.email}
          error={errors.email}
          onValueChange={(value) => setField('email', value)}
          onBlur={() => blurField('email')}
        />
        <TextField
          id={contactFieldId('phone')}
          label={fields.phone.label}
          type="tel"
          inputMode="tel"
          placeholder={fields.phone.placeholder}
          autoComplete={fields.phone.autoComplete}
          format={formatPhone}
          value={values.phone}
          error={errors.phone}
          onValueChange={(value) => setField('phone', value)}
          onBlur={() => blurField('phone')}
        />
        <SelectField
          className={styles.full}
          id={contactFieldId('product')}
          label={fields.product.label}
          placeholder={fields.product.placeholder}
          options={contactProducts}
          value={values.product}
          error={errors.product}
          onValueChange={(value) => setField('product', value)}
          onBlur={() => blurField('product')}
        />
        <TextField
          className={styles.full}
          id={contactFieldId('amount')}
          label={fields.amount.label}
          optional
          inputMode="numeric"
          placeholder={fields.amount.placeholder}
          autoComplete="off"
          format={formatAmount}
          value={values.amount}
          error={errors.amount}
          onValueChange={(value) => setField('amount', value)}
          onBlur={() => blurField('amount')}
        />
        <TextareaField
          className={styles.full}
          id={contactFieldId('message')}
          label={fields.message.label}
          rows={4}
          maxLength={contactLimits.message}
          value={values.message}
          error={errors.message}
          onValueChange={(value) => setField('message', value)}
          onBlur={() => blurField('message')}
        />
      </div>

      {/* Armadilha para robôs: fora da tela, do teclado e de leitores de tela. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contato-website">Não preencha este campo</label>
        <input
          id="contato-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <details className={styles.privacy}>
        <summary className={styles.privacySummary}>
          <span>{privacy.summary}</span>
          <ChevronDown className={styles.privacyIcon} size={18} strokeWidth={1.5} aria-hidden />
        </summary>
        <dl className={styles.privacyList}>
          {privacy.items.map(({ term, text }) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </details>

      <CheckboxField
        id={contactFieldId('privacyAccepted')}
        label={privacy.accept}
        checked={values.privacyAccepted}
        error={errors.privacyAccepted}
        onCheckedChange={(checked) => setField('privacyAccepted', checked)}
      />

      {isProblem(status) && (
        <div className={styles.problem} role="alert">
          <p>{errorMessages[status]}</p>
          {canUseWhatsApp && (
            <TextLink href={buildWhatsAppUrl()} external>
              {errorMessages.whatsapp}
            </TextLink>
          )}
        </div>
      )}

      <div className={styles.footer}>
        <Button type="submit" size="lg" icon={ArrowRight} loading={submitting}>
          {submitting ? contactContent.submitting : contactContent.submit}
        </Button>
        {/* Anuncia o andamento a leitores de tela; o resultado é anunciado pelo alerta ou pela confirmação. */}
        <span className="visually-hidden" role="status">
          {submitting ? contactContent.submitting : ''}
        </span>
      </div>
    </form>
  );
}
