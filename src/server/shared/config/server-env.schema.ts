import { z } from 'zod';

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  NEWS_PROVIDER_MODE: z.enum(['mock', 'live', 'auto']).default('mock'),
  PROVIDER_TIMEOUT_MS: z.coerce.number().int().positive().max(30_000).default(5_000),
  REQUEST_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(120),
  GUARDIAN_API_KEY: z.string().optional(),
  NYT_API_KEY: z.string().optional(),
  NEWS_API_KEY: z.string().optional(),
});
