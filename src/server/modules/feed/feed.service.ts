import type {
  Article,
  ArticleFilters,
  FeedResponse,
  ProviderId,
  ProviderResult,
} from '@contracts/index';
import type { NewsProvider } from '@server/providers/news-provider';
import { logger } from '@server/shared/logging/logger';
import { withTimeoutSignal } from '@server/shared/resilience/with-timeout';

type ProviderFetchResult = {
  articles: Article[];
  provider: ProviderResult;
};

const createProviderSuccess = (
  providerId: ProviderId,
  articleCount: number,
): ProviderResult => ({
  providerId,
  status: 'success',
  articleCount,
});

const createProviderFailure = (providerId: ProviderId): ProviderResult => ({
  providerId,
  status: 'error',
  articleCount: 0,
  errorMessage: 'This source is temporarily unavailable.',
});

const sortArticlesByPublishedAt = (articles: Article[]): Article[] =>
  [...articles].sort((left, right) => {
    const dateDifference =
      Date.parse(right.publishedAt) - Date.parse(left.publishedAt);

    return dateDifference || left.id.localeCompare(right.id);
  });

const filterArticlesByAuthor = (
  articles: Article[],
  authors: string[],
): Article[] => {
  if (authors.length === 0) {
    return articles;
  }

  const normalizedAuthors = authors.map((author) => author.toLowerCase());

  return articles.filter((article) => {
    const author = article.author?.toLowerCase();

    return (
      author !== undefined &&
      normalizedAuthors.some((expectedAuthor) =>
        author.includes(expectedAuthor),
      )
    );
  });
};

export class FeedService {
  public constructor(
    private readonly providers: ReadonlyMap<ProviderId, NewsProvider>,
    private readonly providerTimeoutMs: number,
  ) {}

  public async getFeed(
    filters: ArticleFilters,
    requestSignal: AbortSignal,
  ): Promise<FeedResponse> {
    const providers = this.selectProviders(filters.sourceIds);

    const results = await Promise.all(
      providers.map((provider) =>
        this.fetchFromProvider(provider, filters, requestSignal),
      ),
    );

    const articles = results.flatMap((result) => result.articles);

    return {
      articles: sortArticlesByPublishedAt(
        filterArticlesByAuthor(articles, filters.authors),
      ),
      providers: results.map((result) => result.provider),
      generatedAt: new Date().toISOString(),
    };
  }

  private selectProviders(sourceIds: ProviderId[]): NewsProvider[] {
    const selectedIds =
      sourceIds.length > 0 ? sourceIds : [...this.providers.keys()];

    return selectedIds.flatMap((providerId) => {
      const provider = this.providers.get(providerId);
      return provider ? [provider] : [];
    });
  }

  private async fetchFromProvider(
    provider: NewsProvider,
    filters: ArticleFilters,
    requestSignal: AbortSignal,
  ): Promise<ProviderFetchResult> {
    const timeout = withTimeoutSignal(requestSignal, this.providerTimeoutMs);

    try {
      const articles = await provider.fetchArticles(filters, timeout.signal);

      return {
        articles,
        provider: createProviderSuccess(provider.id, articles.length),
      };
    } catch (error) {
      logger.warn(
        {
          providerId: provider.id,
          errorName: error instanceof Error ? error.name : 'UnknownError',
          errorMessage:
            error instanceof Error ? error.message : 'Unknown provider failure',
        },
        'News provider failed',
      );

      return {
        articles: [],
        provider: createProviderFailure(provider.id),
      };
    } finally {
      timeout.dispose();
    }
  }
}
