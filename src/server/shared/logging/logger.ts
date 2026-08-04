import pino from 'pino';
import { serverEnv } from '../config/server-env';

export const logger = pino({
  level: serverEnv.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.apiKey',
      '*.api-key',
      '*.GUARDIAN_API_KEY',
      '*.NYT_API_KEY',
      '*.NEWS_API_KEY',
    ],
    censor: '[REDACTED]',
  },
});
