import { z } from 'zod';

export const providerIdSchema = z.enum(['guardian', 'nyt', 'newsapi']);
export type ProviderId = z.infer<typeof providerIdSchema>;

export const providerFailureCodeSchema = z.enum([
  'timeout',
  'rate_limited',
  'unauthorized',
  'invalid_response',
  'network_error',
  'aborted',
  'unknown',
]);
export type ProviderFailureCode = z.infer<typeof providerFailureCodeSchema>;

export const providerResultSchema = z.object({
  providerId: providerIdSchema,
  status: z.enum(['success', 'error']),
  articleCount: z.number().int().nonnegative(),
  errorCode: providerFailureCodeSchema.optional(),
  errorMessage: z.string().optional(),
});

export type ProviderResult = z.infer<typeof providerResultSchema>;
