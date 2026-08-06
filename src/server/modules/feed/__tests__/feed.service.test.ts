import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Article, ArticleFilters, ProviderId } from '@contracts/index';
import type { NewsProvider } from '@server/providers/news-provider';
import { FeedService } from '../feed.service';
import { ProviderError } from '@server/providers/provider-errors';
import { z } from 'zod';

vi.mock('@server/shared/logging/logger', () => ({
  logger: {
    warn: vi.fn(),
  },
}));

const defaultFilters: ArticleFilters = {
  query: '',
  sourceIds: [],
  categories: [],
  authors: [],
};

const createArticle = (
  id: string,
  providerId: ProviderId,
  publishedAt: string,
  author?: string,
): Article => ({
  id,
  url: `https://example.com/articles/${id}`,
  title: `Article ${id}`,
  publishedAt,
  categories: ['technology'],
  source: {
    id: providerId,
    name: providerId,
  },
  authors: author === undefined ? [] : [author],
});

const createProvider = (
  id: ProviderId,
  fetchArticles: NewsProvider['fetchArticles'],
): NewsProvider => ({
  id,
  displayName: id,
  fetchArticles,
});

const createResolvedFetch = (
  articles: Article[] = [],
): ReturnType<typeof vi.fn<NewsProvider['fetchArticles']>> =>
  vi.fn<NewsProvider['fetchArticles']>(() => Promise.resolve(articles));

const createRejectedFetch = (
  error: Error,
): ReturnType<typeof vi.fn<NewsProvider['fetchArticles']>> =>
  vi.fn<NewsProvider['fetchArticles']>(() => Promise.reject(error));

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('FeedService', () => {
  it('keeps successful articles when one provider fails', async () => {
    const guardianFetch = createResolvedFetch([
      createArticle('guardian-1', 'guardian', '2026-01-02T00:00:00.000Z'),
    ]);

    const nytFetch = createRejectedFetch(new Error('NYT is unavailable'));

    const newsApiFetch = createResolvedFetch([
      createArticle('newsapi-1', 'newsapi', '2026-01-03T00:00:00.000Z'),
    ]);

    const providers = new Map<ProviderId, NewsProvider>([
      ['guardian', createProvider('guardian', guardianFetch)],
      ['nyt', createProvider('nyt', nytFetch)],
      ['newsapi', createProvider('newsapi', newsApiFetch)],
    ]);

    const service = new FeedService(providers, 1_000);

    const result = await service.getFeed(
      defaultFilters,
      new AbortController().signal,
    );

    expect(result.articles.map(({ id }) => id)).toEqual([
      'newsapi-1',
      'guardian-1',
    ]);

    expect(result.providers).toEqual([
      {
        providerId: 'guardian',
        status: 'success',
        articleCount: 1,
      },
      {
        providerId: 'nyt',
        status: 'error',
        articleCount: 0,
        errorCode: 'unknown',
        errorMessage: 'This source is temporarily unavailable.',
      },
      {
        providerId: 'newsapi',
        status: 'success',
        articleCount: 1,
      },
    ]);

    expect(guardianFetch).toHaveBeenCalledOnce();
    expect(nytFetch).toHaveBeenCalledOnce();
    expect(newsApiFetch).toHaveBeenCalledOnce();

    expect(Number.isNaN(Date.parse(result.generatedAt))).toBe(false);
  });

  it('classifies malformed provider payloads as invalid_response', async () => {
    const schemaError = z.string().datetime().safeParse('not-a-date');
    if (schemaError.success) throw new Error('Expected fixture to be invalid.');

    const providers = new Map<ProviderId, NewsProvider>([
      [
        'guardian',
        createProvider(
          'guardian',
          createRejectedFetch(
            new ProviderError('guardian', 'Invalid payload', {
              cause: schemaError.error,
            }),
          ),
        ),
      ],
    ]);

    const service = new FeedService(providers, 1_000);
    const result = await service.getFeed(
      defaultFilters,
      new AbortController().signal,
    );

    expect(result.providers[0]).toMatchObject({
      providerId: 'guardian',
      status: 'error',
      errorCode: 'invalid_response',
    });
  });

  it('calls only providers selected by the source filter', async () => {
    const guardianFetch = createResolvedFetch();
    const nytFetch = createResolvedFetch();
    const newsApiFetch = createResolvedFetch();

    const providers = new Map<ProviderId, NewsProvider>([
      ['guardian', createProvider('guardian', guardianFetch)],
      ['nyt', createProvider('nyt', nytFetch)],
      ['newsapi', createProvider('newsapi', newsApiFetch)],
    ]);

    const selectedFilters: ArticleFilters = {
      ...defaultFilters,
      query: 'renewable energy',
      sourceIds: ['guardian'],
    };

    const service = new FeedService(providers, 1_000);

    await service.getFeed(selectedFilters, new AbortController().signal);

    expect(guardianFetch).toHaveBeenCalledOnce();

    expect(guardianFetch).toHaveBeenCalledWith(
      selectedFilters,
      expect.any(AbortSignal),
    );

    expect(nytFetch).not.toHaveBeenCalled();
    expect(newsApiFetch).not.toHaveBeenCalled();
  });

  it('calls every registered provider when no source is selected', async () => {
    const guardianFetch = createResolvedFetch();
    const nytFetch = createResolvedFetch();
    const newsApiFetch = createResolvedFetch();

    const providers = new Map<ProviderId, NewsProvider>([
      ['guardian', createProvider('guardian', guardianFetch)],
      ['nyt', createProvider('nyt', nytFetch)],
      ['newsapi', createProvider('newsapi', newsApiFetch)],
    ]);

    const service = new FeedService(providers, 1_000);

    await service.getFeed(defaultFilters, new AbortController().signal);

    expect(guardianFetch).toHaveBeenCalledOnce();
    expect(nytFetch).toHaveBeenCalledOnce();
    expect(newsApiFetch).toHaveBeenCalledOnce();
  });

  it('isolates a provider timeout without removing successful results', async () => {
    vi.useFakeTimers();

    const hangingFetch = vi.fn<NewsProvider['fetchArticles']>(
      (_filters, signal) =>
        new Promise<Article[]>((_, reject) => {
          const rejectFromAbort = (): void => {
            reject(new Error(signal.reason));
          };

          if (signal.aborted) {
            rejectFromAbort();
            return;
          }

          signal.addEventListener('abort', rejectFromAbort, { once: true });
        }),
    );

    const nytFetch = createResolvedFetch([
      createArticle('nyt-success', 'nyt', '2026-01-04T00:00:00.000Z'),
    ]);

    const providers = new Map<ProviderId, NewsProvider>([
      ['guardian', createProvider('guardian', hangingFetch)],
      ['nyt', createProvider('nyt', nytFetch)],
    ]);

    const service = new FeedService(providers, 50);

    const resultPromise = service.getFeed(
      defaultFilters,
      new AbortController().signal,
    );

    await vi.advanceTimersByTimeAsync(51);

    const result = await resultPromise;

    expect(result.articles.map(({ id }) => id)).toEqual(['nyt-success']);

    expect(result.providers).toEqual([
      {
        providerId: 'guardian',
        status: 'error',
        articleCount: 0,
        errorCode: 'unknown',
        errorMessage: 'This source is temporarily unavailable.',
      },
      {
        providerId: 'nyt',
        status: 'success',
        articleCount: 1,
      },
    ]);

    expect(hangingFetch).toHaveBeenCalledOnce();
    expect(nytFetch).toHaveBeenCalledOnce();

    const providerSignal = hangingFetch.mock.calls[0]?.[1];

    expect(providerSignal).toBeDefined();
    expect(providerSignal?.aborted).toBe(true);
    expect(providerSignal?.reason).toBeInstanceOf(DOMException);
    expect(providerSignal?.reason).toMatchObject({
      name: 'TimeoutError',
    });
  });

  it('filters articles by author case-insensitively', async () => {
    const guardianFetch = createResolvedFetch([
      createArticle(
        'maya',
        'guardian',
        '2026-01-02T00:00:00.000Z',
        'Maya Chen',
      ),
      createArticle(
        'alex',
        'guardian',
        '2026-01-04T00:00:00.000Z',
        'Dr. Alex Morgan',
      ),
      createArticle(
        'other',
        'guardian',
        '2026-01-05T00:00:00.000Z',
        'Other Author',
      ),
      createArticle('anonymous', 'guardian', '2026-01-06T00:00:00.000Z'),
    ]);

    const providers = new Map<ProviderId, NewsProvider>([
      ['guardian', createProvider('guardian', guardianFetch)],
    ]);

    const filters: ArticleFilters = {
      ...defaultFilters,
      authors: ['Maya Chen', 'DR. ALEX MORGAN'],
    };

    const service = new FeedService(providers, 1_000);

    const result = await service.getFeed(filters, new AbortController().signal);

    expect(result.articles.map(({ id }) => id)).toEqual(['alex', 'maya']);

    /*
     * Provider articleCount represents the number returned by
     * the provider before feed-level author filtering.
     */
    expect(result.providers).toEqual([
      {
        providerId: 'guardian',
        status: 'success',
        articleCount: 4,
      },
    ]);
  });

  it('sorts articles newest first with a deterministic id tie-breaker', async () => {
    const providerArticles: Article[] = [
      createArticle('b', 'guardian', '2026-01-01T12:00:00.000Z'),
      createArticle('c', 'guardian', '2026-01-02T12:00:00.000Z'),
      createArticle('a', 'guardian', '2026-01-01T12:00:00.000Z'),
    ];

    const guardianFetch = createResolvedFetch(providerArticles);

    const providers = new Map<ProviderId, NewsProvider>([
      ['guardian', createProvider('guardian', guardianFetch)],
    ]);

    const service = new FeedService(providers, 1_000);

    const result = await service.getFeed(
      defaultFilters,
      new AbortController().signal,
    );

    expect(result.articles.map(({ id }) => id)).toEqual(['c', 'a', 'b']);
  });

  it('does not mutate arrays returned by providers', async () => {
    const providerArticles: Article[] = [
      createArticle('old', 'guardian', '2026-01-01T00:00:00.000Z'),
      createArticle('new', 'guardian', '2026-01-02T00:00:00.000Z'),
    ];

    const originalOrder = providerArticles.map(({ id }) => id);

    const guardianFetch = createResolvedFetch(providerArticles);

    const providers = new Map<ProviderId, NewsProvider>([
      ['guardian', createProvider('guardian', guardianFetch)],
    ]);

    const service = new FeedService(providers, 1_000);

    const result = await service.getFeed(
      defaultFilters,
      new AbortController().signal,
    );

    expect(result.articles.map(({ id }) => id)).toEqual(['new', 'old']);

    expect(providerArticles.map(({ id }) => id)).toEqual(originalOrder);
  });

  it('rethrows request cancellation instead of reporting a provider outage', async () => {
    const controller = new AbortController();
    const abortedFetch = vi.fn<NewsProvider['fetchArticles']>(
      (_filters, signal) =>
        new Promise<Article[]>((_, reject) => {
          signal.addEventListener(
            'abort',
            () => reject(new DOMException('Request cancelled', 'AbortError')),
            {
              once: true,
            },
          );
        }),
    );

    const providers = new Map<ProviderId, NewsProvider>([
      ['guardian', createProvider('guardian', abortedFetch)],
    ]);
    const service = new FeedService(providers, 1_000);
    const result = service.getFeed(defaultFilters, controller.signal);

    controller.abort(new DOMException('Request cancelled', 'AbortError'));

    await expect(result).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('returns an empty valid feed when no providers are registered', async () => {
    const providers = new Map<ProviderId, NewsProvider>();

    const service = new FeedService(providers, 1_000);

    const result = await service.getFeed(
      defaultFilters,
      new AbortController().signal,
    );

    expect(result.articles).toEqual([]);
    expect(result.providers).toEqual([]);

    expect(Number.isNaN(Date.parse(result.generatedAt))).toBe(false);
  });
});
