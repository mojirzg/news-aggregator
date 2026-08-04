import type { ProviderId } from '@contracts/index';
import styles from './ProviderBadge.module.css';

const initials: Record<ProviderId, string> = { guardian: 'G', nyt: 'NYT', newsapi: 'N' };

export const ProviderBadge = ({ id, name }: { id: ProviderId; name: string }) => (
  <span className={styles.badge}>
    <span className={styles.mark} aria-hidden="true">{initials[id]}</span>
    {name}
  </span>
);
