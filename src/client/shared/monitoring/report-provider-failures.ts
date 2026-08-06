import * as Sentry from '@sentry/react';
import type { FeedResponse } from '@contracts/index';

export const reportProviderFailures = (response: FeedResponse): void => {
  for (const provider of response.providers) {
    if (provider.status !== 'error') {
      continue;
    }

    Sentry.captureMessage('News provider failed', {
      level: 'warning',
      tags: {
        provider: provider.providerId,
        operation: 'feed-aggregation',
      },
      contexts: {
        providerFailure: {
          code: provider.errorCode,
        },
      },
    });
  }
};
