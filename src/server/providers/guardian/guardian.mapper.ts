import type { Article, Category } from '@contracts/index';
import type { GuardianResponse } from './guardian-response.schema';

const categoryBySection: Record<string, Category> = {
  business: 'business',
  technology: 'technology',
  science: 'science',
  sport: 'sports',
  society: 'health',
  culture: 'entertainment',
};

type GuardianItem = GuardianResponse['response']['results'][number];

const stripHtml = (value?: string): string | undefined =>
  value?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() || undefined;

export const mapGuardianResponse = (payload: GuardianResponse): Article[] =>
  payload.response.results.map((item: GuardianItem) => ({
    id: `guardian:${item.id}`,
    url: item.webUrl,
    title: item.webTitle,
    ...(stripHtml(item.fields?.trailText) ? { description: stripHtml(item.fields?.trailText) } : {}),
    ...(item.fields?.thumbnail ? { imageUrl: item.fields.thumbnail } : {}),
    ...(item.fields?.byline ? { author: item.fields.byline } : {}),
    publishedAt: new Date(item.webPublicationDate).toISOString(),
    categories: [categoryBySection[item.sectionId ?? ''] ?? 'general'],
    source: { id: 'guardian', name: 'The Guardian' },
  }));
