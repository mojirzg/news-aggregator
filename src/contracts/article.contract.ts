import { z } from 'zod';
import { isoDateTimeSchema } from './common.contract';
import { providerIdSchema } from './provider.contract';

export const categorySchema = z.enum([
  'business',
  'technology',
  'science',
  'sports',
  'health',
  'entertainment',
  'general',
]);

export type Category = z.infer<typeof categorySchema>;

export const articleSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  imageUrl: z.string().url().optional(),
  authors: z.array(z.string().trim().min(1).max(100)),
  publishedAt: isoDateTimeSchema,
  keywords: z.array(z.string()).optional(),
  categories: z.array(categorySchema),
  source: z.object({
    id: providerIdSchema,
    name: z.string().min(1),
  }),
});

export type Article = z.infer<typeof articleSchema>;
