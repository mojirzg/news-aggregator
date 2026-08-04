import type { Article, ArticleFilters, FeedResponse, ProviderId } from '@contracts/index';
import type { NewsProvider } from '@server/providers/news-provider';
import { logger } from '@server/shared/logging/logger';
import { withTimeoutSignal } from '@server/shared/resilience/with-timeout';
import { createProviderFailure, createProviderSuccess } from './create-provider-result';
import { sortArticlesByPublishedAt } from './sort-articles';

export class FeedAggregator {
  public constructor(
    private readonly providers: ReadonlyMap<ProviderId, NewsProvider>,
    private readonly providerTimeoutMs: number,
  ) {}

  public async aggregate(filters: ArticleFilters, signal: AbortSignal): Promise<FeedResponse> {
    const activeIds = filters.sourceIds.length > 0 ? filters.sourceIds : [...this.providers.keys()];
    const activeProviders = activeIds.flatMap((id) => {
      const provider = this.providers.get(id);
      return provider ? [provider] : [];
    });

    const results = await Promise.all(
      activeProviders.map(async (provider) => {
        const timeout = withTimeoutSignal(signal, this.providerTimeoutMs);
        try {
          const articles = await provider.fetchArticles(filters, timeout.signal);
          return { articles, provider: createProviderSuccess(provider.id, articles.length) };
        } catch (error) {
          logger.warn({
            providerId: provider.id,
            errorName: error instanceof Error ? error.name : 'UnknownError',
            errorMessage: error instanceof Error ? error.message : 'Unknown provider failure',
          }, 'News provider failed');
          return { articles: [] as Article[], provider: createProviderFailure(provider.id) };
        } finally {
          timeout.dispose();
        }
      }),
    );

    const articles = results.flatMap((result) => result.articles);
    const authorFiltered = filters.authors.length === 0
      ? articles
      : articles.filter((article) =>
          filters.authors.some((author) => article.author?.toLowerCase().includes(author.toLowerCase()) ?? false),
        );

    return {
      articles: sortArticlesByPublishedAt(authorFiltered),
      providers: results.map((result) => result.provider),
      generatedAt: new Date().toISOString(),
    };
  }
}
