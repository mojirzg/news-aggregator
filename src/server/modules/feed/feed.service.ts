import { z } from 'zod';
import type {
  Article,
  ArticleFilters,
  FeedResponse,
  ProviderFailureCode,
  ProviderId,
  ProviderResult,
} from '@contracts/index';
import type { NewsProvider } from '@server/providers/news-provider';
import { ProviderError } from '@server/providers/provider-errors';
import { HttpError } from '@server/shared/http/http-error';
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

const createProviderFailure = (
  providerId: ProviderId,
  errorCode: ProviderFailureCode,
): ProviderResult => ({
  providerId,
  status: 'error',
  articleCount: 0,
  errorCode,
  errorMessage: 'This source is temporarily unavailable.',
});

const sortArticlesByPublishedAt = (articles: Article[]): Article[] =>
  [...articles].sort((left, right) => {
    const dateDifference =
      Date.parse(right.publishedAt) - Date.parse(left.publishedAt);

    return dateDifference || left.id.localeCompare(right.id);
  });

const normalizeAuthor = (value: string): string =>
  value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');

const filterArticlesByAuthor = (
  articles: Article[],
  authors: string[],
): Article[] => {
  if (authors.length === 0) {
    return articles;
  }

  const normalizedAuthors = new Set(authors.map(normalizeAuthor));

  return articles.filter(
    (article) =>
      article.author !== undefined &&
      normalizedAuthors.has(normalizeAuthor(article.author)),
  );
};

const unwrapCause = (error: unknown): unknown =>
  error instanceof ProviderError && error.cause !== undefined
    ? error.cause
    : error;

const classifyProviderFailure = (error: unknown): ProviderFailureCode => {
  const cause = unwrapCause(error);

  if (cause instanceof DOMException && cause.name === 'TimeoutError') {
    return 'timeout';
  }

  if (cause instanceof DOMException && cause.name === 'AbortError') {
    return 'aborted';
  }

  if (cause instanceof HttpError) {
    if (cause.status === 401 || cause.status === 403) return 'unauthorized';
    if (cause.status === 429) return 'rate_limited';
    return 'network_error';
  }

  if (cause instanceof z.ZodError) {
    return 'invalid_response';
  }

  if (cause instanceof TypeError) {
    return 'network_error';
  }

  return 'unknown';
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
      if (requestSignal.aborted) {
        throw error;
      }

      const errorCode = classifyProviderFailure(error);

      logger.warn(
        {
          providerId: provider.id,
          errorCode,
          errorName: error instanceof Error ? error.name : 'UnknownError',
          errorMessage:
            error instanceof Error ? error.message : 'Unknown provider failure',
        },
        'News provider failed',
      );

      return {
        articles: [],
        provider: createProviderFailure(provider.id, errorCode),
      };
    } finally {
      timeout.dispose();
    }
  }
}
