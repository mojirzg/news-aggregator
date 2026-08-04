import type { ArticleFilters } from '@contracts/index';
import { ClearFiltersButton } from '@client/features/clear-article-filters';
import { ActiveFilterChips } from './ActiveFilterChips';
import { ResultsCount } from './ResultsCount';
import styles from './ArticleToolbar.module.css';

const hasFilters = (filters: ArticleFilters) =>
  Boolean(
    filters.query ||
    filters.sourceIds.length ||
    filters.categories.length ||
    filters.authors.length ||
    filters.dateFrom ||
    filters.dateTo,
  );

export const ArticleToolbar = ({
  filters,
  count,
  fetching,
  onChange,
  onClear,
}: {
  filters: ArticleFilters;
  count: number;
  fetching: boolean;
  onChange: (next: ArticleFilters) => void;
  onClear: () => void;
}) => (
  <div className={styles.toolbar}>
    <div className={styles.filters}>
      <ActiveFilterChips filters={filters} onChange={onChange} />
      {hasFilters(filters) ? <ClearFiltersButton onClick={onClear} /> : null}
    </div>
    <ResultsCount count={count} fetching={fetching} />
  </div>
);
