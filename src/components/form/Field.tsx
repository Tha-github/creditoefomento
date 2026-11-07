import { ChevronDown, CircleAlert } from 'lucide-react';
import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useLayoutEffect,
  useRef,
} from 'react';

import { cx } from '@/utils/cx';

import styles from './Field.module.css';

interface FieldBaseProps {
  id: string;
  label: string;
  error?: string | undefined;
  /** Marca o campo como opcional no rótulo. Os demais são obrigatórios. */
  optional?: boolean;
  className?: string | undefined;
}

function describedBy(id: string, error: string | undefined) {
  return error ? `${id}-erro` : undefined;
}

function FieldError({ id, error }: { id: string; error: string | undefined }) {
  if (!error) return null;
  return (
    <p id={`${id}-erro`} className={styles.error}>
      <CircleAlert size={16} strokeWidth={1.75} aria-hidden />
      <span>{error}</span>
    </p>
  );
}

function FieldShell({
  id,
  label,
  error,
  optional,
  className,
  children,
}: FieldBaseProps & { children: ReactNode }) {
  return (
    <div className={cx(styles.field, error && styles.hasError, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> (opcional)</span>}
      </label>
      {children}
      <FieldError id={id} error={error} />
    </div>
  );
}

function isMaskCharacter(character: string) {
  return !/[0-9a-zA-Z]/.test(character);
}

function countCharacters(value: string) {
  return value.split('').filter((character) => !isMaskCharacter(character)).length;
}

/**
 * Posição do cursor no texto com máscara, mantendo a mesma quantidade de caracteres depois dele.
 * Conta a partir do fim porque prefixos da máscara, como "R$", ficam sempre antes do cursor.
 */
function caretPosition(formatted: string, charactersAfter: number) {
  let position = formatted.length;
  let seen = 0;
  while (position > 0 && seen < charactersAfter) {
    position -= 1;
    if (!isMaskCharacter(formatted[position] ?? '')) seen += 1;
  }
  return position;
}

type TextFieldProps = FieldBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'onChange' | 'value' | 'className'> & {
    value: string;
    onValueChange: (value: string) => void;
    /** Máscara aplicada a cada alteração. */
    format?: (value: string) => string;
  };

export function TextField({
  id,
  label,
  error,
  optional,
  className,
  value,
  onValueChange,
  format,
  ...inputProps
}: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaret = useRef<number | null>(null);

  // Depois de aplicar a máscara, devolve o cursor ao caractere digitado, e não ao fim do campo.
  // Síncrono, antes da próxima tecla: adiar para depois da pintura faria dígitos caírem fora do lugar.
  useLayoutEffect(() => {
    if (pendingCaret.current === null) return;
    inputRef.current?.setSelectionRange(pendingCaret.current, pendingCaret.current);
    pendingCaret.current = null;
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if (!format) {
      onValueChange(input.value);
      return;
    }
    const charactersAfter = countCharacters(input.value.slice(input.selectionStart ?? input.value.length));
    const formatted = format(input.value);
    pendingCaret.current = caretPosition(formatted, charactersAfter);
    onValueChange(formatted);
  };

  return (
    <FieldShell {...{ id, label, error, optional, className }}>
      <input
        {...inputProps}
        ref={inputRef}
        id={id}
        name={id}
        className={styles.control}
        value={value}
        onChange={handleChange}
        aria-required={!optional}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error)}
      />
    </FieldShell>
  );
}

type TextareaFieldProps = FieldBaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'onChange' | 'value' | 'className'> & {
    value: string;
    onValueChange: (value: string) => void;
  };

export function TextareaField({
  id,
  label,
  error,
  optional,
  className,
  value,
  onValueChange,
  ...textareaProps
}: TextareaFieldProps) {
  return (
    <FieldShell {...{ id, label, error, optional, className }}>
      <textarea
        {...textareaProps}
        id={id}
        name={id}
        className={cx(styles.control, styles.textarea)}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        aria-required={!optional}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error)}
      />
    </FieldShell>
  );
}

type SelectFieldProps = FieldBaseProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'onChange' | 'value' | 'className'> & {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: readonly { value: string; label: string }[];
  };

export function SelectField({
  id,
  label,
  error,
  optional,
  className,
  value,
  onValueChange,
  placeholder,
  options,
  ...selectProps
}: SelectFieldProps) {
  return (
    <FieldShell {...{ id, label, error, optional, className }}>
      <div className={styles.selectWrap}>
        <select
          {...selectProps}
          id={id}
          name={id}
          className={cx(styles.control, styles.select, !value && styles.placeholder)}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          aria-required={!optional}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error)}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.selectIcon} size={20} strokeWidth={1.5} aria-hidden />
      </div>
    </FieldShell>
  );
}

interface CheckboxFieldProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string | undefined;
  className?: string | undefined;
}

export function CheckboxField({
  id,
  label,
  checked,
  onCheckedChange,
  error,
  className,
}: CheckboxFieldProps) {
  return (
    <div className={cx(styles.checkboxField, error && styles.hasError, className)}>
      <label htmlFor={id} className={styles.checkboxLabel}>
        <input
          id={id}
          name={id}
          type="checkbox"
          className={styles.checkbox}
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          aria-required
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error)}
        />
        <span>{label}</span>
      </label>
      <FieldError id={id} error={error} />
    </div>
  );
}
