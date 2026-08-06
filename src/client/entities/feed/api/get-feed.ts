import * as Sentry from '@sentry/react';
import {
  feedResponseSchema,
  type ArticleFilters,
  type FeedResponse,
} from '@contracts/index';
import { filtersToSearchParams } from '@client/shared/lib/search-params/search-params';
import { getJson } from '@client/shared/api';
import { reportProviderFailures } from '@client/shared/monitoring/report-provider-failures';

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
    async () => {
      const query = filtersToSearchParams(filters).toString();
      const response = await getJson(
        `/api/feed${query ? `?${query}` : ''}`,
        feedResponseSchema,
        signal,
      );
      reportProviderFailures(response);
      return response;
    },
  );
};
