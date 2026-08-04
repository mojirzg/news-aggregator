import type { ArticleFilters } from '@contracts/index';
import { newsApiConfig } from './newsapi.config';

export const buildNewsApiUrl = (filters: ArticleFilters, apiKey: string): URL => {
  const url = new URL(newsApiConfig.endpoint);
  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('language', 'en');
  url.searchParams.set('sortBy', 'publishedAt');
  url.searchParams.set('pageSize', String(newsApiConfig.pageSize));

  const categoryTerms = filters.categories.filter((category) => category !== 'general');
  const queryParts = [filters.query, ...categoryTerms].filter(Boolean);
  url.searchParams.set('q', queryParts.length > 0 ? queryParts.join(' OR ') : 'news');
  if (filters.dateFrom) url.searchParams.set('from', filters.dateFrom);
  if (filters.dateTo) url.searchParams.set('to', filters.dateTo);
  return url;
};
