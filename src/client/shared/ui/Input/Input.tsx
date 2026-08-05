import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ endAdornment, className = '', ...inputProps }, ref) => (
    <div className={styles.container}>
      <input
        ref={ref}
        className={[
          styles.input,
          endAdornment ? styles.hasEndAdornment : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...inputProps}
      />

      {endAdornment ? (
        <span className={styles.endAdornment} aria-hidden="true">
          {endAdornment}
        </span>
      ) : null}
    </div>
  ),
);

Input.displayName = 'Input';
