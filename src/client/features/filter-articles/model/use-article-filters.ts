import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ArticleFilters } from '@contracts/index';
import { filtersToSearchParams } from '@client/shared/lib/search-params/filters-to-search-params';
import { searchParamsToFilters } from '@client/shared/lib/search-params/search-params-to-filters';

export const useArticleFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(
    () => searchParamsToFilters(searchParams),
    [searchParams],
  );

  const setFilters = useCallback(
    (next: ArticleFilters, options?: { replace?: boolean }) => {
      setSearchParams(filtersToSearchParams(next), {
        replace: options?.replace ?? false,
      });
    },
    [setSearchParams],
  );

  const patchFilters = useCallback(
    (patch: Partial<ArticleFilters>, options?: { replace?: boolean }) => {
      setFilters({ ...filters, ...patch }, options);
    },
    [filters, setFilters],
  );

  return { filters, setFilters, patchFilters };
};
