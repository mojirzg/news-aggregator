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
  const query = filtersToSearchParams(filters).toString();
  return getJson(
    `/api/feed${query ? `?${query}` : ''}`,
    feedResponseSchema,
    signal,
  );
};
