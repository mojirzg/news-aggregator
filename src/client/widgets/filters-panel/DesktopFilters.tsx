import type { ComponentProps } from 'react';
import { FiltersPanel } from './FiltersPanel';
import styles from './FiltersPanel.module.css';

export const DesktopFilters = (props: ComponentProps<typeof FiltersPanel>) => (
  <aside className={styles.desktop} aria-label="Article filters"><FiltersPanel {...props} /></aside>
);
