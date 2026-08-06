import { useId } from 'react';
import type { ArticleFilters } from '@contracts/index';
import { Input } from '@client/shared/ui/Input';
import { getDateRangeError } from '../lib/get-date-range-error';
import styles from './DateFilter.module.css';

export const DateFilter = ({
  filters,
  onChange,
}: {
  filters: ArticleFilters;
  onChange: (next: ArticleFilters) => void;
}) => {
  const reactId = useId().replaceAll(':', '');
  const errorId = `date-range-${reactId}-error`;
  const error = getDateRangeError(filters);

  return (
    <div
      className={styles.fields}
      role="group"
      aria-label="Publication date range"
    >
      <Input
        id={`date-from-${reactId}`}
        label="From"
        type="date"
        value={filters.dateFrom ?? ''}
        max={filters.dateTo}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) =>
          onChange({ ...filters, dateFrom: event.target.value || undefined })
        }
      />
      <Input
        id={`date-to-${reactId}`}
        label="To"
        type="date"
        value={filters.dateTo ?? ''}
        min={filters.dateFrom}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) =>
          onChange({ ...filters, dateTo: event.target.value || undefined })
        }
      />
      {error ? (
        <p className={styles.error} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
