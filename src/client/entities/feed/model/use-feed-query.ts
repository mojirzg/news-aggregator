import { useQuery } from '@tanstack/react-query';
import type { ArticleFilters } from '@contracts/index';
import { feedQueryOptions } from './feed-query-options';

export const useFeedQuery = (filters: ArticleFilters, enabled = true) =>
  useQuery({ ...feedQueryOptions(filters), enabled });
