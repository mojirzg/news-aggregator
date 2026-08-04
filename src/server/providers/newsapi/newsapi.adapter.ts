import type { ArticleFilters } from '@contracts/index';
import type { NewsProvider } from '../news-provider';
import { ProviderError } from '../provider-errors';
import { fetchNewsApi } from './newsapi.client';
import { mapNewsApiResponse } from './newsapi.mapper';
import { buildNewsApiUrl } from './newsapi-request.mapper';

export class NewsApiProvider implements NewsProvider {
  public readonly id = 'newsapi' as const;
  public readonly displayName = 'NewsAPI';

  public constructor(private readonly apiKey: string) {}

  public async fetchArticles(filters: ArticleFilters, signal: AbortSignal) {
    try {
      return mapNewsApiResponse(await fetchNewsApi(buildNewsApiUrl(filters, this.apiKey), signal));
    } catch (error) {
      throw new ProviderError(this.id, 'NewsAPI request failed.', { cause: error });
    }
  }
}
