import type { Article } from '@contracts/index';
import { z } from 'zod';
import { inferCategory } from './newsapi.provider';
import { normalizeProviderAuthors } from '../normalize-provider-authors';

export type NewsApiResponse = z.infer<typeof newsApiResponseSchema>;
type NewsApiItem = NewsApiResponse['articles'][number];

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
      publishedAt: z.string().datetime({ offset: true }),
      content: z.string().nullable().optional(),
    }),
  ),
});

export const mapNewsApiResponse = (payload: NewsApiResponse): Article[] =>
  payload.articles
    .filter((item: NewsApiItem) => item.title !== '[Removed]')
    .map((item: NewsApiItem) => ({
      id: `newsapi:${item.url}`,
      url: item.url,
      title: item.title,
      ...(item.description ? { description: item.description } : {}),
      ...(item.urlToImage ? { imageUrl: item.urlToImage } : {}),
      authors: normalizeProviderAuthors(item.author),
      publishedAt: new Date(item.publishedAt).toISOString(),
      categories: [inferCategory(item.title, item.description)],
      source: { id: 'newsapi', name: item.source.name || 'NewsAPI' },
    }));
