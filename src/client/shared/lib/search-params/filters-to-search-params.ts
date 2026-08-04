import type { ArticleFilters } from '@contracts/index';

export const filtersToSearchParams = (
  filters: ArticleFilters,
): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.query) params.set('query', filters.query);
  if (filters.sourceIds.length > 0)
    params.set('sourceIds', filters.sourceIds.join(','));
  if (filters.categories.length > 0)
    params.set('categories', filters.categories.join(','));
  if (filters.authors.length > 0)
    params.set('authors', filters.authors.join(','));
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);
  return params;
};
