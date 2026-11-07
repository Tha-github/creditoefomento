import { useEffect, useRef, useState } from 'react';

import {
  type ContactErrors,
  type ContactField,
  contactFields,
  type ContactFormValues,
  validateContact,
  validateContactField,
} from '@shared/contact/validation';

import { submitContact } from '@/integrations/contact';

export type ContactFormStatus =
  | 'idle'
  | 'submitting'
  | 'success'
  | 'validation'
  | 'too_fast'
  | 'rate_limited'
  | 'unavailable'
  | 'failed';

const EMPTY_VALUES: ContactFormValues = {
  name: '',
  company: '',
  cnpj: '',
  email: '',
  phone: '',
  product: '',
  amount: '',
  message: '',
  privacyAccepted: false,
};

export function contactFieldId(field: ContactField): string {
  return `contato-${field}`;
}

function focusFirstInvalid(errors: ContactErrors) {
  const first = contactFields.find((field) => errors[field]);
  if (first) document.getElementById(contactFieldId(first))?.focus();
}

export function useContactForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<ContactFormStatus>('idle');
  const [website, setWebsite] = useState('');

  // Referência, e não estado: bloqueia o segundo clique antes mesmo da nova renderização.
  const inFlight = useRef(false);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const setField = <K extends ContactField>(field: K, value: ContactFormValues[K]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Depois de apontar um erro, acompanha a correção enquanto a pessoa digita.
    if (errors[field]) {
      setErrors({ ...errors, [field]: validateContactField(field, next) });
    }
  };

  /** Ao sair de um campo vazio, não acusa erro: a pessoa pode estar apenas navegando. */
  const blurField = (field: ContactField) => {
    const value = values[field];
    if (typeof value === 'string' && !value.trim() && !errors[field]) return;
    setErrors((current) => ({ ...current, [field]: validateContactField(field, values) }));
  };

  const submit = async () => {
    if (inFlight.current) return;

    const validation = validateContact(values);
    setErrors(validation.errors);
    if (!validation.valid) {
      setStatus('validation');
      focusFirstInvalid(validation.errors);
      return;
    }

    inFlight.current = true;
    setStatus('submitting');
    const result = await submitContact({ ...values, website, startedAt: startedAt.current });
    inFlight.current = false;

    if (result.status === 'validation') {
      setErrors(result.fieldErrors);
      setStatus('validation');
      focusFirstInvalid(result.fieldErrors);
      return;
    }

    setStatus(result.status);
  };

  const reset = () => {
    setValues(EMPTY_VALUES);
    setErrors({});
    setWebsite('');
    setStatus('idle');
    startedAt.current = Date.now();
  };

  return { values, errors, status, website, setWebsite, setField, blurField, submit, reset };
}
