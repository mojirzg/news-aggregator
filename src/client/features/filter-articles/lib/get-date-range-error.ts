import type { ArticleFilters } from '@contracts/index';

export const getDateRangeError = (
  filters: Pick<ArticleFilters, 'dateFrom' | 'dateTo'>,
): string | null => {
  if (!filters.dateFrom || !filters.dateTo) {
    return null;
  }

  return filters.dateFrom <= filters.dateTo
    ? null
    : 'The start date must be on or before the end date.';
};
