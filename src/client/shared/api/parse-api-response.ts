import type { z } from 'zod';
import { ApiError } from './api-error';

export const parseApiResponse = async <T>(response: Response, schema: z.ZodType<T>): Promise<T> => {
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = payload && typeof payload === 'object' && 'error' in payload
      ? (payload as { error?: { message?: string; code?: string; requestId?: string } }).error
      : undefined;
    throw new ApiError(
      error?.message ?? `Request failed with HTTP ${response.status}`,
      response.status,
      error?.code,
      error?.requestId,
    );
  }
  return schema.parse(payload);
};
