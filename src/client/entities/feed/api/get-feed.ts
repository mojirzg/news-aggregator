import * as Sentry from '@sentry/react';
import {
  feedResponseSchema,
  type ArticleFilters,
  type FeedResponse,
} from '@contracts/index';
import { filtersToSearchParams } from '@client/shared/lib/search-params/search-params';
import { getJson } from '@client/shared/api';

export const getFeed = (
  filters: ArticleFilters,
  signal?: AbortSignal,
): Promise<FeedResponse> => {
  return Sentry.startSpan(
    {
      name: 'Load aggregated news feed',
      op: 'feed.load',
      attributes: {
        'feed.source_count': filters.sourceIds?.length ?? 0,
        'feed.category_count': filters.categories?.length ?? 0,
        'feed.has_query': Boolean(filters.query?.trim()),
      },
    },
    () => {
      const query = filtersToSearchParams(filters).toString();
      return getJson(
        `/api/feed${query ? `?${query}` : ''}`,
        feedResponseSchema,
        signal,
      );
    },
  );
};
