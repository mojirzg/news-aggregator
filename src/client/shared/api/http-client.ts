import type { z } from 'zod';
import { parseApiResponse } from './parse-api-response';

export const getJson = async <T>(
  url: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> => {
  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
  });
  return parseApiResponse(response, schema);
};
