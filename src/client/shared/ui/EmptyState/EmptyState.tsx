import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

export const EmptyState = ({ title, description, action }: { title: string; description: string; action?: ReactNode }) => (
  <section className={styles.state}>
    <div className={styles.icon} aria-hidden="true">⌁</div>
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.description}>{description}</p>
    {action}
  </section>
);
