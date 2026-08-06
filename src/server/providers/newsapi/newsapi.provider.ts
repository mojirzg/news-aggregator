import type { Category } from '@contracts/article.contract';
import { fetchJson } from '@server/shared/http/provider-http-client';
import { mapNewsApiResponse, newsApiResponseSchema } from './newsapi.response';
import type { NewsProvider } from '../news-provider';
import type { ArticleFilters } from '@contracts/filters.contract';
import { ProviderError } from '../provider-errors';

export const newsApiConfig = {
  endpoint: 'https://newsapi.org/v2/everything',
  pageSize: 30,
} as const;

export const buildNewsApiUrl = (
  filters: ArticleFilters,
  apiKey: string,
): URL => {
  const url = new URL(newsApiConfig.endpoint);
  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('language', 'en');
  url.searchParams.set('sortBy', 'publishedAt');
  url.searchParams.set('pageSize', String(newsApiConfig.pageSize));

  const categoryTerms = filters.categories.filter(
    (category) => category !== 'general',
  );
  const queryParts = [filters.query, ...categoryTerms].filter(Boolean);
  url.searchParams.set(
    'q',
    queryParts.length > 0 ? queryParts.join(' OR ') : 'news',
  );
  if (filters.dateFrom) url.searchParams.set('from', filters.dateFrom);
  if (filters.dateTo) url.searchParams.set('to', filters.dateTo);
  return url;
};

export const inferCategory = (
  title: string,
  description?: string | null,
): Category => {
  const text = `${title} ${description ?? ''}`.toLowerCase();
  const terms: Array<[Category, string[]]> = [
    ['technology', ['technology', 'software', 'ai', 'computer', 'cyber']],
    ['business', ['business', 'market', 'economy', 'company', 'finance']],
    ['science', ['science', 'research', 'space', 'climate']],
    ['sports', ['sport', 'football', 'soccer', 'tennis', 'basketball']],
    ['health', ['health', 'medical', 'medicine', 'hospital']],
    ['entertainment', ['film', 'movie', 'music', 'television', 'celebrity']],
  ];
  return (
    terms.find(([, keywords]) =>
      keywords.some((keyword) => text.includes(keyword)),
    )?.[0] ?? 'general'
  );
};

export const fetchNewsApi = (url: URL, signal: AbortSignal) =>
  fetchJson(url, newsApiResponseSchema, signal);

export class NewsApiProvider implements NewsProvider {
  public readonly id = 'newsapi' as const;
  public readonly displayName = 'NewsAPI';

  public constructor(private readonly apiKey: string) {}

  public async fetchArticles(filters: ArticleFilters, signal: AbortSignal) {
    try {
      return mapNewsApiResponse(
        await fetchNewsApi(buildNewsApiUrl(filters, this.apiKey), signal),
      );
    } catch (error) {
      throw new ProviderError(this.id, 'NewsAPI request failed.', {
        cause: error,
      });
    }
  }
}
