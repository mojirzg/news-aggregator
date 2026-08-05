import type { ArticleFilters } from '@contracts/index';
import { useArticleFilters } from '@client/features/filter-articles';
import {
  DesktopFilters,
  MobileFilterDrawer,
} from '@client/widgets/filters-panel';
import { NewsFeedContainer } from './NewsFeedContainer';
import styles from './NewsPage.module.css';

const emptyFilters: ArticleFilters = {
  query: '',
  sourceIds: [],
  categories: [],
  authors: [],
};

export const NewsPage = () => {
  const { filters, setFilters } = useArticleFilters();

  const clearFilters = (): void => {
    setFilters(emptyFilters);
  };

  const resetSidebarFilters = (): void => {
    setFilters({
      ...emptyFilters,
      query: filters.query,
    });
  };

  return (
    <main id="main-content" className={styles.page}>
      <div className="container">
        <div className={styles.searchRow}>
          <MobileFilterDrawer filters={filters} onApply={setFilters} />
        </div>

        <div className={styles.layout}>
          <DesktopFilters
            filters={filters}
            onChange={setFilters}
            onReset={resetSidebarFilters}
          />
          <div className={styles.content}>
            <NewsFeedContainer
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
