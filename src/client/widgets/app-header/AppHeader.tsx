import { Link } from 'react-router-dom';
import { routes } from '@client/shared/config/routes';
import { AppNavigation } from './AppNavigation';
import styles from './AppHeader.module.css';
import { Button } from '@client/shared/ui/Button';
import { SlidersHorizontal } from 'lucide-react';
interface AppHeaderProps {
  showFilterButton?: boolean;
  filtersOpen?: boolean;
  onOpenFilters?: () => void;
}
export const AppHeader = ({
  showFilterButton = false,
  filtersOpen = false,
  onOpenFilters,
}: AppHeaderProps) => (
  <header className={styles.header}>
    <div className={`container ${styles.inner}`}>
      <Link
        className={styles.brand}
        to={routes.news}
        aria-label="Signal News home"
      >
        <span className={styles.brandText}>Signal News</span>
      </Link>
      <AppNavigation />
      {showFilterButton && onOpenFilters ? (
        <Button
          type="button"
          variant="ghost"
          aria-haspopup="dialog"
          aria-expanded={filtersOpen}
          aria-controls="mobile-filter-drawer"
          className={styles.filterButton}
          onClick={onOpenFilters}
        >
          <SlidersHorizontal />
        </Button>
      ) : null}
    </div>
  </header>
);
