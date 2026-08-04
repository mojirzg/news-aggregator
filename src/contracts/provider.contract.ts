import { z } from 'zod';

export const providerIdSchema = z.enum(['guardian', 'nyt', 'newsapi']);
export type ProviderId = z.infer<typeof providerIdSchema>;

export const providerResultSchema = z.object({
  providerId: providerIdSchema,
  status: z.enum(['success', 'error']),
  articleCount: z.number().int().nonnegative(),
  errorMessage: z.string().optional(),
});

export type ProviderResult = z.infer<typeof providerResultSchema>;
