import type { Article, Category } from '@contracts/article.contract';
import type { ArticleFilters } from '@contracts/filters.contract';
import type { NewsProvider } from '../news-provider';
import { fetchJson } from '@server/shared/http/provider-http-client';
import { mapNytResponse, nytResponseSchema } from './nyt.response';
import { ProviderError } from '../provider-errors';

const NYT_ENDPOINT = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

const sectionMap: Record<Category, string> = {
  business: 'Business',
  technology: 'Technology',
  science: 'Science',
  sports: 'Sports',
  health: 'Health',
  entertainment: 'Arts',
  general: 'World',
};

const compactDate = (value: string) => value.replaceAll('-', '');

export const buildNytUrl = (filters: ArticleFilters, apiKey: string): URL => {
  const url = new URL(NYT_ENDPOINT);
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('sort', 'newest');
  if (filters.query) url.searchParams.set('q', filters.query);
  if (filters.dateFrom)
    url.searchParams.set('begin_date', compactDate(filters.dateFrom));
  if (filters.dateTo)
    url.searchParams.set('end_date', compactDate(filters.dateTo));
  if (filters.categories.length > 0) {
    const values = filters.categories
      .map((category) => sectionMap[category])
      .filter(Boolean);
    if (values.length > 0) {
      url.searchParams.set(
        'fq',
        `section_name:(${values.map((value) => `"${value}"`).join(' OR ')})`,
      );
    }
  }
  return url;
};

export class NytProvider implements NewsProvider {
  public readonly id = 'nyt' as const;
  public readonly displayName = 'The New York Times';

  public constructor(private readonly apiKey: string) {}

  public async fetchArticles(
    filters: ArticleFilters,
    signal: AbortSignal,
  ): Promise<Article[]> {
    try {
      const url = buildNytUrl(filters, this.apiKey);

      const payload = await fetchJson(url, nytResponseSchema, signal);

      return mapNytResponse(payload);
    } catch (error) {
      console.log('NytProvider.fetchArticles error:', error);
      throw new ProviderError(this.id, 'The New York Times request failed.', {
        cause: error,
      });
    }
  }
}
