import type { Article, Category } from '@contracts/index';
import { z } from 'zod';
import type { ArticleFilters } from '@contracts/index';
import type { NewsProvider } from '../news-provider';
import { ProviderError } from '../provider-errors';
import { fetchJson } from '@server/shared/http/provider-http-client';

export type NewsApiResponse = z.infer<typeof newsApiResponseSchema>;
type NewsApiItem = NewsApiResponse['articles'][number];

export const newsApiConfig = {
  endpoint: 'https://newsapi.org/v2/everything',
  pageSize: 30,
} as const;

export const newsApiResponseSchema = z.object({
  status: z.literal('ok'),
  totalResults: z.number(),
  articles: z.array(
    z.object({
      source: z.object({ id: z.string().nullable(), name: z.string() }),
      author: z.string().nullable(),
      title: z.string(),
      description: z.string().nullable(),
      url: z.string().url(),
      urlToImage: z.string().url().nullable(),
      publishedAt: z.string(),
      content: z.string().nullable().optional(),
    }),
  ),
});

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

const inferCategory = (
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

export const mapNewsApiResponse = (payload: NewsApiResponse): Article[] =>
  payload.articles
    .filter((item: NewsApiItem) => item.title !== '[Removed]')
    .map((item: NewsApiItem) => ({
      id: `newsapi:${item.url}`,
      url: item.url,
      title: item.title,
      ...(item.description ? { description: item.description } : {}),
      ...(item.urlToImage ? { imageUrl: item.urlToImage } : {}),
      ...(item.author ? { author: item.author } : {}),
      publishedAt: new Date(item.publishedAt).toISOString(),
      categories: [inferCategory(item.title, item.description)],
      source: { id: 'newsapi', name: item.source.name || 'NewsAPI' },
    }));

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
