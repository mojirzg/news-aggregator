import type { ArticleFilters } from '@contracts/index';
import type { AppOutletContext } from '@client/shared/lib/router/app-outlet-context';
import { useArticleFilters } from '@client/features/filter-articles';
import {
  DesktopFilters,
  MobileFilterDrawer,
} from '@client/widgets/filters-panel';
import { NewsFeedContainer } from '@client/widgets/news-feed';
import { useOutletContext } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import styles from './NewsPage.module.css';

const emptyFilters: ArticleFilters = {
  query: '',
  sourceIds: [],
  categories: [],
  authors: [],
};

export const NewsPage = () => {
  const { isFilterDrawerOpen, closeFilterDrawer } =
    useOutletContext<AppOutletContext>();
  const { filters, setFilters } = useArticleFilters();
  const [filterDraft, setFilterDraft] = useState<ArticleFilters>(filters);

  /*
   * Every time the drawer opens, start from the current committed
   * URL filters. Cancelled edits therefore do not survive.
   */
  useEffect(() => {
    if (isFilterDrawerOpen) {
      setFilterDraft(filters);
    }
  }, [filters, isFilterDrawerOpen]);

  const clearFilters = (): void => {
    setFilters(emptyFilters);
  };

  const resetSidebarFilters = (): void => {
    setFilters({
      ...emptyFilters,
      query: filters.query,
    });
  };

  const applyFilters = useCallback(() => {
    setFilters(filterDraft);
    closeFilterDrawer();
  }, [closeFilterDrawer, filterDraft, setFilters]);

  const resetFilterDraft = useCallback(() => {
    setFilterDraft((current) => ({
      query: current.query,
      sourceIds: [],
      categories: [],
      authors: [],
    }));
  }, []);

  return (
    <main id="main-content" className={styles.page}>
      <div className="container">
        <div className={styles.searchRow}>
          <MobileFilterDrawer
            open={isFilterDrawerOpen}
            filters={filterDraft}
            onChange={setFilterDraft}
            onApply={applyFilters}
            onReset={resetFilterDraft}
            onClose={closeFilterDrawer}
          />
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
