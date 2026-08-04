import type { ArticleFilters } from '@contracts/index';

export const feedQueryKeys = {
  all: ['feed'] as const,
  list: (filters: ArticleFilters) => [...feedQueryKeys.all, filters] as const,
};
