import type { ProviderId, ProviderResult } from '@contracts/index';

export const createProviderSuccess = (providerId: ProviderId, articleCount: number): ProviderResult => ({
  providerId,
  status: 'success',
  articleCount,
});

export const createProviderFailure = (providerId: ProviderId): ProviderResult => ({
  providerId,
  status: 'error',
  articleCount: 0,
  errorMessage: 'This source is temporarily unavailable.',
});
