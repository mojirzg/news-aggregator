import type { Article, Category } from '@contracts/index';
import { z } from 'zod';
import { normalizeProviderAuthors } from '../normalize-provider-authors';

export type GuardianResponse = z.infer<typeof guardianResponseSchema>;
type GuardianItem = GuardianResponse['response']['results'][number];

const categoryBySection: Record<string, Category> = {
  business: 'business',
  technology: 'technology',
  science: 'science',
  sport: 'sports',
  society: 'health',
  culture: 'entertainment',
};

export const guardianResponseSchema = z.object({
  response: z.object({
    status: z.string(),
    results: z.array(
      z.object({
        id: z.string(),
        type: z.string(),
        sectionId: z.string().optional(),
        sectionName: z.string().optional(),
        webPublicationDate: z.string().datetime({ offset: true }),
        webTitle: z.string(),
        webUrl: z.string().url(),
        fields: z
          .object({
            trailText: z.string().optional(),
            thumbnail: z.string().url().optional(),
            byline: z.string().optional(),
          })
          .optional(),
      }),
    ),
  }),
});

const stripHtml = (value?: string): string | undefined =>
  value
    ?.replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim() || undefined;

export const mapGuardianResponse = (payload: GuardianResponse): Article[] =>
  payload.response.results.map((item: GuardianItem) => ({
    id: `guardian:${item.id}`,
    url: item.webUrl,
    title: item.webTitle,
    ...(stripHtml(item.fields?.trailText)
      ? { description: stripHtml(item.fields?.trailText) }
      : {}),
    ...(item.fields?.thumbnail ? { imageUrl: item.fields.thumbnail } : {}),
    authors: normalizeProviderAuthors(item.fields?.byline),
    publishedAt: new Date(item.webPublicationDate).toISOString(),
    categories: [categoryBySection[item.sectionId ?? ''] ?? 'general'],
    source: { id: 'guardian', name: 'The Guardian' },
  }));
