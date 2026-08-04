import type { ProviderId } from '@contracts/index';

export class ProviderError extends Error {
  public constructor(
    public readonly providerId: ProviderId,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'ProviderError';
  }
}
