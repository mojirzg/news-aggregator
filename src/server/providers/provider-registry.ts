import type { ProviderId } from '@contracts/index';
import { serverEnv } from '@server/shared/config/server-env';
import { GuardianProvider } from '@server/providers/guardian/guardian.provider';
import { MockProvider } from '@server/providers/mock/mock-provider';
import type { NewsProvider } from '@server/providers/news-provider';
import { NewsApiProvider } from '@server/providers/newsapi/newsapi.provider';
import { NytProvider } from '@server/providers/nyt/nyt.provider';

const createLiveProvider = (id: ProviderId): NewsProvider | null => {
  if (id === 'guardian' && serverEnv.GUARDIAN_API_KEY) return new GuardianProvider(serverEnv.GUARDIAN_API_KEY);
  if (id === 'nyt' && serverEnv.NYT_API_KEY) return new NytProvider(serverEnv.NYT_API_KEY);
  if (id === 'newsapi' && serverEnv.NEWS_API_KEY) return new NewsApiProvider(serverEnv.NEWS_API_KEY);
  return null;
};

export const createProviderRegistry = (): ReadonlyMap<ProviderId, NewsProvider> => {
  const ids: ProviderId[] = ['guardian', 'nyt', 'newsapi'];
  const entries = ids.map((id): [ProviderId, NewsProvider] => {
    console.log(`Creating provider for ${id} with NEWS_PROVIDER_MODE=${serverEnv.NEWS_PROVIDER_MODE}`);
    if (serverEnv.NEWS_PROVIDER_MODE === 'mock') return [id, new MockProvider(id)];
    const live = createLiveProvider(id);
    if (live) return [id, live];
    if (serverEnv.NEWS_PROVIDER_MODE === 'auto') return [id, new MockProvider(id)];
    throw new Error(`Missing API key for ${id} while NEWS_PROVIDER_MODE=live`);
  });
  return new Map(entries);
};
