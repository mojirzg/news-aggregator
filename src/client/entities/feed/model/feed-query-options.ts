import { queryOptions } from '@tanstack/react-query';
import type { ArticleFilters } from '@contracts/index';
import { getFeed } from '../api/get-feed';
import { feedQueryKeys } from './feed-query-keys';

export const feedQueryOptions = (filters: ArticleFilters) =>
  queryOptions({
    queryKey: feedQueryKeys.list(filters),
    queryFn: ({ signal }) => getFeed(filters, signal),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
