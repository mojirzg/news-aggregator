export const errorCodes = {
  validation: 'VALIDATION_ERROR',
  provider: 'PROVIDER_ERROR',
  internal: 'INTERNAL_ERROR',
  notFound: 'NOT_FOUND',
} as const;

export type ErrorCode = (typeof errorCodes)[keyof typeof errorCodes];
