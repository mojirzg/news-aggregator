import { rateLimit } from 'express-rate-limit';
import { serverEnv } from '@server/shared/config/server-env';

export const apiRateLimit = rateLimit({
  windowMs: 60_000,
  limit: serverEnv.REQUEST_LIMIT_PER_MINUTE,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests. Try again shortly.' } },
});
