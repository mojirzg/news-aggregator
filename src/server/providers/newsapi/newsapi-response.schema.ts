import { z } from 'zod';

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

export type NewsApiResponse = z.infer<typeof newsApiResponseSchema>;
