import type { ArticleFilters } from '@contracts/index';
import type { NewsProvider } from '../news-provider';
import { ProviderError } from '../provider-errors';
import { fetchGuardian } from './guardian.client';
import { mapGuardianResponse } from './guardian.mapper';
import { buildGuardianUrl } from './guardian-request.mapper';

export class GuardianProvider implements NewsProvider {
  public readonly id = 'guardian' as const;
  public readonly displayName = 'The Guardian';

  public constructor(private readonly apiKey: string) {}

  public async fetchArticles(filters: ArticleFilters, signal: AbortSignal) {
    try {
      const response = await fetchGuardian(buildGuardianUrl(filters, this.apiKey), signal);
      return mapGuardianResponse(response);
    } catch (error) {
      throw new ProviderError(this.id, 'The Guardian request failed.', { cause: error });
    }
  }
}
