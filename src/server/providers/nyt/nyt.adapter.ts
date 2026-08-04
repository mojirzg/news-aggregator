import type { ArticleFilters } from '@contracts/index';
import type { NewsProvider } from '../news-provider';
import { ProviderError } from '../provider-errors';
import { fetchNyt } from './nyt.client';
import { mapNytResponse } from './nyt.mapper';
import { buildNytUrl } from './nyt-request.mapper';

export class NytProvider implements NewsProvider {
  public readonly id = 'nyt' as const;
  public readonly displayName = 'The New York Times';

  public constructor(private readonly apiKey: string) {}

  public async fetchArticles(filters: ArticleFilters, signal: AbortSignal) {
    try {
      return mapNytResponse(await fetchNyt(buildNytUrl(filters, this.apiKey), signal));
    } catch (error) {
      throw new ProviderError(this.id, 'The New York Times request failed.', { cause: error });
    }
  }
}
