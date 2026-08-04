import type { ReactNode } from 'react';
import styles from './Chip.module.css';

interface ChipProps {
  children: ReactNode;
  onRemove?: () => void;
}

export const Chip = ({ children, onRemove }: ChipProps) => {
  const accessibleLabel =
    typeof children === 'string' || typeof children === 'number'
      ? String(children)
      : 'chip';

  return (
    <span className={styles.chip}>
      {children}
      {onRemove ? (
        <button
          className={styles.remove}
          type="button"
          aria-label={`Remove ${accessibleLabel}`}
          onClick={onRemove}
        >
          ×
        </button>
      ) : null}
    </span>
  );
};
