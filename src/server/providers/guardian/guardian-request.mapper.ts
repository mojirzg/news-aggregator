import type { ArticleFilters, Category } from '@contracts/index';
import { guardianConfig } from './guardian.config';

const sectionMap: Record<Category, string> = {
  business: 'business',
  technology: 'technology',
  science: 'science',
  sports: 'sport',
  health: 'society',
  entertainment: 'culture',
  general: 'world',
};

export const buildGuardianUrl = (filters: ArticleFilters, apiKey: string): URL => {
  const url = new URL(guardianConfig.endpoint);
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('page-size', String(guardianConfig.pageSize));
  url.searchParams.set('order-by', 'newest');
  url.searchParams.set('show-fields', 'trailText,thumbnail,byline');

  if (filters.query) url.searchParams.set('q', filters.query);
  if (filters.dateFrom) url.searchParams.set('from-date', filters.dateFrom);
  if (filters.dateTo) url.searchParams.set('to-date', filters.dateTo);
  if (filters.categories.length > 0) {
    const sections = filters.categories.map((category) => sectionMap[category]).filter(Boolean);
    if (sections.length > 0) url.searchParams.set('section', sections.join('|'));
  }

  return url;
};
