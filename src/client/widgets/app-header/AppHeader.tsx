import { Link } from 'react-router-dom';
import { routes } from '@client/shared/config/routes';
import { AppNavigation } from './AppNavigation';
import styles from './AppHeader.module.css';

export const AppHeader = () => (
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
    </div>
  </header>
);
