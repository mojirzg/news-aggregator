import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  endAdornment?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  label?: string;
}

const joinIds = (...ids: Array<string | undefined>): string | undefined => {
  const value = ids.filter(Boolean).join(' ');
  return value || undefined;
};

const isAriaInvalid = (
  value: InputHTMLAttributes<HTMLInputElement>['aria-invalid'],
): boolean => value !== undefined && value !== false && value !== 'false';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      className = '',
      endAdornment,
      error,
      hint,
      id,
      label,
      ...inputProps
    },
    ref,
  ) => {
    const reactId = useId().replaceAll(':', '');
    const inputId = id ?? `input-${reactId}`;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const invalid = Boolean(error) || isAriaInvalid(ariaInvalid);

    return (
      <div className={styles.container}>
        {label ? (
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>
        ) : null}

        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            {...inputProps}
            id={inputId}
            aria-describedby={joinIds(describedBy, hintId, errorId)}
            aria-invalid={error ? true : ariaInvalid}
            className={[
              styles.input,
              invalid ? styles.invalid : '',
              endAdornment ? styles.hasEndAdornment : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          />

          {endAdornment ? (
            <span className={styles.endAdornment} aria-hidden="true">
              {endAdornment}
            </span>
          ) : null}
        </div>

        {hint ? (
          <p className={styles.hint} id={hintId}>
            {hint}
          </p>
        ) : null}

        {error ? (
          <p className={styles.error} id={errorId} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
