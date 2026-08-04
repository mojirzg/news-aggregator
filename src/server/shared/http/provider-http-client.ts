import type { z } from 'zod';
import { redactSensitiveUrl } from '@server/shared/security/redact-sensitive-data';
import { HttpError } from './http-error';

export const fetchJson = async <T>(
  url: URL,
  schema: z.ZodType<T>,
  signal: AbortSignal,
): Promise<T> => {
  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json', 'User-Agent': 'signal-news-aggregator/1.0' },
  });

  if (!response.ok) {
    const bodyPreview = (await response.text()).slice(0, 300);
    throw new HttpError(
      response.status,
      `Provider responded with HTTP ${response.status} at ${redactSensitiveUrl(url.toString())}`,
      bodyPreview,
    );
  }

  const payload: unknown = await response.json();
  return schema.parse(payload);
};
