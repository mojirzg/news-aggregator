import { useQuery } from '@tanstack/react-query';
import type { ArticleFilters } from '@contracts/index';
import { queryOptions } from '@tanstack/react-query';
import { getFeed } from '../api/get-feed';

export const feedQueryKeys = {
  all: ['feed'] as const,
  list: (filters: ArticleFilters) => [...feedQueryKeys.all, filters] as const,
};

export const feedQueryOptions = (filters: ArticleFilters) =>
  queryOptions({
    queryKey: feedQueryKeys.list(filters),
    queryFn: ({ signal }) => getFeed(filters, signal),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useFeedQuery = (filters: ArticleFilters, enabled = true) =>
  useQuery({ ...feedQueryOptions(filters), enabled });
