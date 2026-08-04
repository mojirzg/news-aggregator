import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = ({
  label,
  hint,
  id,
  className = '',
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={styles.group}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`${styles.input} ${className}`}
        {...props}
      />
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </div>
  );
};
