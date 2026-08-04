import type { ProviderResult } from '@contracts/index';
import { Button } from '@client/shared/ui/Button';
import { ProviderFailureDetails } from './ProviderFailureDetails';
import styles from './ProviderStatusBanner.module.css';

export const ProviderStatusBanner = ({
  providers,
  onRetry,
}: {
  providers: ProviderResult[];
  onRetry: () => void;
}) => {
  const failed = providers.filter((provider) => provider.status === 'error');
  if (failed.length === 0 || failed.length === providers.length) return null;
  const succeeded = providers.length - failed.length;
  return (
    <aside className={styles.banner} role="status">
      <div>
        <div className={styles.title}>
          Showing results from {succeeded} of {providers.length} sources
        </div>
        <div className={styles.text}>
          <ProviderFailureDetails providers={providers} /> Successful articles
          remain visible.
        </div>
      </div>
      <Button type="button" size="small" variant="secondary" onClick={onRetry}>
        Retry
      </Button>
    </aside>
  );
};
