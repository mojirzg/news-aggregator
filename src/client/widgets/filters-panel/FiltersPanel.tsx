import { useId } from 'react';
import type { ArticleFilters } from '@contracts/index';
import { Button } from '@client/shared/ui/Button';
import {
  CategoryFilter,
  DateFilter,
  SourceFilter,
  getDateRangeError,
} from '@client/features/filter-articles';
import { ArticleSearchInput } from '@client/features/search-articles';
import styles from './FiltersPanel.module.css';

export interface FiltersPanelProps {
  filters: ArticleFilters;
  onChange: (next: ArticleFilters) => void;
  onReset: () => void;
  onApply?: () => void;
}

export const FiltersPanel = ({
  filters,
  onChange,
  onReset,
  onApply,
}: FiltersPanelProps) => {
  const reactId = useId().replaceAll(':', '');
  const applyHelpId = `date-range-apply-help-${reactId}`;
  const dateRangeError = getDateRangeError(filters);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
        <Button type="button" variant="ghost" size="small" onClick={onReset}>
          Reset
        </Button>
      </div>

      <ArticleSearchInput
        query={filters.query}
        onChange={(query) => {
          onChange({
            ...filters,
            query,
          });
        }}
      />

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Date range</h3>
        <DateFilter filters={filters} onChange={onChange} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Sources</h3>
        <SourceFilter filters={filters} onChange={onChange} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Categories</h3>
        <CategoryFilter filters={filters} onChange={onChange} />
      </section>

      {onApply ? (
        <div className={styles.actions}>
          <Button
            type="button"
            fullWidth
            disabled={Boolean(dateRangeError)}
            aria-describedby={dateRangeError ? applyHelpId : undefined}
            onClick={onApply}
          >
            Apply filters
          </Button>
          {dateRangeError ? (
            <span className={styles.applyHelp} id={applyHelpId}>
              Correct the date range before applying filters.
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
