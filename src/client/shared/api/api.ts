import type { z } from 'zod';

export const parseApiResponse = async <T>(
  response: Response,
  schema: z.ZodType<T>,
): Promise<T> => {
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error =
      payload && typeof payload === 'object' && 'error' in payload
        ? (
            payload as {
              error?: { message?: string; code?: string; requestId?: string };
            }
          ).error
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

export class ApiError extends Error {
  public constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

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
