import { z } from 'zod';
import { articleSchema } from './article.contract';
import { providerResultSchema } from './provider.contract';

export const feedResponseSchema = z.object({
  articles: z.array(articleSchema),
  providers: z.array(providerResultSchema),
  generatedAt: z.string().datetime({ offset: true }),
});

export type FeedResponse = z.infer<typeof feedResponseSchema>;
