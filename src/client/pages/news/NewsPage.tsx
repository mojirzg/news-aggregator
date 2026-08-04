import { useCallback } from 'react';
import type { ArticleFilters } from '@contracts/index';
import { useFeedQuery } from '@client/entities/feed';
import { useArticleFilters } from '@client/features/filter-articles';
import { ArticleSearchInput } from '@client/features/search-articles';
import { ArticleFeed, ArticleFeedEmpty, ArticleFeedError, ArticleFeedSkeleton } from '@client/widgets/article-feed';
import { ArticleToolbar } from '@client/widgets/article-toolbar';
import { DesktopFilters, MobileFilterDrawer } from '@client/widgets/filters-panel';
import { ProviderStatusBanner } from '@client/widgets/provider-status-banner';
import { Button } from '@client/shared/ui/Button';
import styles from './NewsPage.module.css';

const emptyFilters: ArticleFilters = { query: '', sourceIds: [], categories: [], authors: [] };

export const NewsPage = () => {
  const { filters, setFilters, patchFilters } = useArticleFilters();
  const feed = useFeedQuery(filters);
  const onSearchChange = useCallback((query: string) => patchFilters({ query }, { replace: true }), [patchFilters]);
  const allProvidersFailed = Boolean(feed.data?.providers.length && feed.data.providers.every((provider) => provider.status === 'error'));

  return (
    <main id="main-content" className={styles.page}>
      <div className="container">
        <header className={styles.hero}>
          <span className={styles.eyebrow}>Multi-source intelligence</span>
          <h1 className={styles.title}>The stories that matter, without the noise.</h1>
          <p className={styles.subtitle}>Search and filter a normalized feed from The Guardian, The New York Times, and NewsAPI.</p>
        </header>

        <div className={styles.searchRow}>
          <ArticleSearchInput query={filters.query} onChange={onSearchChange} />
          <MobileFilterDrawer filters={filters} onApply={setFilters} />
        </div>

        <div className={styles.layout}>
          <DesktopFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({ ...emptyFilters, query: filters.query })}
          />
          <div className={styles.content}>
            {feed.data ? (
              <ArticleToolbar
                filters={filters}
                count={feed.data.articles.length}
                fetching={feed.isFetching}
                onChange={setFilters}
                onClear={() => setFilters(emptyFilters)}
              />
            ) : null}
            {feed.data ? <ProviderStatusBanner providers={feed.data.providers} onRetry={() => void feed.refetch()} /> : null}
            {feed.isPending ? <ArticleFeedSkeleton /> : null}
            {feed.isError || allProvidersFailed ? <ArticleFeedError onRetry={() => void feed.refetch()} /> : null}
            {feed.data && !allProvidersFailed && feed.data.articles.length === 0 ? (
              <ArticleFeedEmpty action={<Button type="button" onClick={() => setFilters(emptyFilters)}>Clear filters</Button>} />
            ) : null}
            {feed.data && !allProvidersFailed && feed.data.articles.length > 0 ? <ArticleFeed articles={feed.data.articles} /> : null}
          </div>
        </div>
      </div>
    </main>
  );
};
