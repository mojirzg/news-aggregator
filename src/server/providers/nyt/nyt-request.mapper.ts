import type { ArticleFilters, Category } from '@contracts/index';
import { nytConfig } from './nyt.config';

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
  const url = new URL(nytConfig.endpoint);
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('sort', 'newest');
  if (filters.query) url.searchParams.set('q', filters.query);
  if (filters.dateFrom) url.searchParams.set('begin_date', compactDate(filters.dateFrom));
  if (filters.dateTo) url.searchParams.set('end_date', compactDate(filters.dateTo));
  if (filters.categories.length > 0) {
    const values = filters.categories.map((category) => sectionMap[category]).filter(Boolean);
    if (values.length > 0) {
      url.searchParams.set('fq', `section_name:(${values.map((value) => `"${value}"`).join(' OR ')})`);
    }
  }
  return url;
};
