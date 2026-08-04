import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export const Checkbox = ({ label, description, ...props }: CheckboxProps) => (
  <label className={styles.label}>
    <input className={styles.input} type="checkbox" {...props} />
    <span className={styles.text}>
      <span className={styles.title}>{label}</span>
      {description ? <span className={styles.description}>{description}</span> : null}
    </span>
  </label>
);
