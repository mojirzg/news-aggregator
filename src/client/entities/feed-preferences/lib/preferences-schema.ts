import { z } from 'zod';
import { categorySchema, providerIdSchema } from '@contracts/index';

const unique = <T>(values: T[]): T[] => [...new Set(values)];

export const feedPreferencesSchema = z
  .object({
    schemaVersion: z.literal(1),
    sourceIds: z.array(providerIdSchema),
    categories: z.array(categorySchema),
    authors: z.array(z.string().trim().min(1).max(100)),
  })
  .transform((preferences) => ({
    ...preferences,
    sourceIds: unique(preferences.sourceIds),
    categories: unique(preferences.categories),
    authors: unique(preferences.authors),
  }));

export type FeedPreferences = z.infer<typeof feedPreferencesSchema>;
