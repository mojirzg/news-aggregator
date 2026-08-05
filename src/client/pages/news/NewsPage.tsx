import type { ArticleFilters } from '@contracts/index';
import { useArticleFilters } from '@client/features/filter-articles';
import { ArticleSearchInput } from '@client/features/search-articles';
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
  const { filters, setFilters, patchFilters } = useArticleFilters();

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
        {/* <header className={styles.hero}>
          <span className={styles.eyebrow}>Multi-source intelligence</span>

          <h1 className={styles.title}>
            The stories that matter, without the noise.
          </h1>

          <p className={styles.subtitle}>
            Search and filter a normalized feed from The Guardian, The New York
            Times, and NewsAPI.
          </p>
        </header> */}

        <div className={styles.searchRow}>
          <ArticleSearchInput
            query={filters.query}
            onChange={(query) => {
              patchFilters({ query }, { replace: true });
            }}
          />

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
