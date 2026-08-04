import type { ReactNode } from 'react';
import styles from './Chip.module.css';

interface ChipProps {
  children: ReactNode;
  onRemove?: () => void;
}

export const Chip = ({ children, onRemove }: ChipProps) => (
  <span className={styles.chip}>
    {children}
    {onRemove ? <button className={styles.remove} type="button" aria-label={`Remove ${String(children)}`} onClick={onRemove}>×</button> : null}
  </span>
);
