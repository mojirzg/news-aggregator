import type { ProviderId } from '@contracts/index';
import { serverEnv } from '@server/shared/config/server-env';
import { GuardianProvider } from '@server/providers/guardian/guardian.provider';
import { MockProvider } from '@server/providers/mock/mock-provider';
import type { NewsProvider } from '@server/providers/news-provider';
import { NewsApiProvider } from '@server/providers/newsapi/newsapi.provider';
import { NytProvider } from '@server/providers/nyt/nyt.provider';

interface ProviderDefinition {
  getApiKey: () => string | undefined;
  create: (apiKey: string) => NewsProvider;
}

const providerDefinitions = {
  guardian: {
    getApiKey: () => serverEnv.GUARDIAN_API_KEY,
    create: (apiKey: string) => new GuardianProvider(apiKey),
  },
  nyt: {
    getApiKey: () => serverEnv.NYT_API_KEY,
    create: (apiKey: string) => new NytProvider(apiKey),
  },
  newsapi: {
    getApiKey: () => serverEnv.NEWS_API_KEY,
    create: (apiKey: string) => new NewsApiProvider(apiKey),
  },
} satisfies Record<ProviderId, ProviderDefinition>;

export const createProviderRegistry = (): ReadonlyMap<ProviderId, NewsProvider> => {
  const entries = Object.entries(providerDefinitions).map(
    ([providerId, definition]): [ProviderId, NewsProvider] => {
      const id = providerId as ProviderId;

      if (serverEnv.NEWS_PROVIDER_MODE === 'mock') {
        return [id, new MockProvider(id)];
      }

      const apiKey = definition.getApiKey();
      if (apiKey) {
        return [id, definition.create(apiKey)];
      }

      if (serverEnv.NEWS_PROVIDER_MODE === 'auto') {
        return [id, new MockProvider(id)];
      }

      throw new Error(`Missing API key for ${id} while NEWS_PROVIDER_MODE=live`);
    },
  );

  return new Map(entries);
};
