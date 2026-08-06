import type { ArticleFilters } from '@contracts/index';
import type { AppOutletContext } from '@client/shared/lib/router/app-outlet-context';
import { useArticleFilters } from '@client/features/filter-articles';
import { normalizeSearchQuery } from '@client/features/search-articles';
import {
  DesktopFilters,
  MobileFilterDrawer,
} from '@client/widgets/filters-panel';
import { NewsFeedContainer } from '@client/widgets/news-feed';
import { useOutletContext } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const {
    filters,
    setFilters,
    patchFiltersDebounced,
    cancelPendingFilterPatch,
  } = useArticleFilters();
  const [desktopFilters, setDesktopFilters] = useState<ArticleFilters>(filters);
  const [filterDraft, setFilterDraft] = useState<ArticleFilters>(filters);
  const wasFilterDrawerOpenRef = useRef(false);

  useEffect(() => {
    setDesktopFilters(filters);
  }, [filters]);

  /*
   * Start each mobile editing session from committed URL state. The guard
   * prevents URL changes from replacing an in-progress mobile draft.
   */
  useEffect(() => {
    if (isFilterDrawerOpen && !wasFilterDrawerOpenRef.current) {
      cancelPendingFilterPatch();
      setFilterDraft(filters);
    }

    wasFilterDrawerOpenRef.current = isFilterDrawerOpen;
  }, [cancelPendingFilterPatch, filters, isFilterDrawerOpen]);

  const clearFilters = useCallback((): void => {
    cancelPendingFilterPatch();
    setDesktopFilters(emptyFilters);
    setFilters(emptyFilters);
  }, [cancelPendingFilterPatch, setFilters]);

  const resetDesktopFilters = useCallback((): void => {
    cancelPendingFilterPatch();
    setDesktopFilters(emptyFilters);
    setFilters(emptyFilters);
  }, [cancelPendingFilterPatch, setFilters]);

  const changeDesktopFilters = useCallback(
    (nextFilters: ArticleFilters): void => {
      const queryChanged = nextFilters.query !== desktopFilters.query;

      setDesktopFilters(nextFilters);

      if (queryChanged) {
        patchFiltersDebounced(
          {
            query: normalizeSearchQuery(nextFilters.query),
          },
          { replace: true },
        );
        return;
      }

      setFilters({
        ...nextFilters,
        query: normalizeSearchQuery(nextFilters.query),
      });
    },
    [desktopFilters.query, patchFiltersDebounced, setFilters],
  );

  const applyFilters = useCallback(() => {
    const nextFilters = {
      ...filterDraft,
      query: normalizeSearchQuery(filterDraft.query),
    };

    cancelPendingFilterPatch();
    setDesktopFilters(nextFilters);
    setFilterDraft(nextFilters);
    setFilters(nextFilters);
    closeFilterDrawer();
  }, [cancelPendingFilterPatch, closeFilterDrawer, filterDraft, setFilters]);

  const resetFilterDraft = useCallback(() => {
    cancelPendingFilterPatch();
    setFilterDraft(emptyFilters);
  }, [cancelPendingFilterPatch]);

  const closeMobileFilters = useCallback(() => {
    cancelPendingFilterPatch();
    setFilterDraft(filters);
    closeFilterDrawer();
  }, [cancelPendingFilterPatch, closeFilterDrawer, filters]);

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
            onClose={closeMobileFilters}
          />
        </div>

        <div className={styles.layout}>
          <DesktopFilters
            filters={desktopFilters}
            onChange={changeDesktopFilters}
            onReset={resetDesktopFilters}
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
