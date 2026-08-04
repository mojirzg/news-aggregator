import { describe, expect, it } from 'vitest';
import type { Article, ArticleFilters, ProviderId } from '@contracts/index';
import type { NewsProvider } from '@server/providers/news-provider';
import { FeedAggregator } from '../feed-aggregator';

const filters: ArticleFilters = { query: '', sourceIds: [], categories: [], authors: [] };
const makeArticle = (id: string, providerId: ProviderId, publishedAt: string, author?: string): Article => ({
  id,
  url: `https://example.com/${id}`,
  title: id,
  ...(author ? { author } : {}),
  publishedAt,
  categories: ['technology'],
  source: { id: providerId, name: providerId },
});

const provider = (id: ProviderId, behavior: () => Promise<Article[]>): NewsProvider => ({
  id,
  displayName: id,
  fetchArticles: behavior,
});

describe('FeedAggregator', () => {
  it('keeps successful articles when one provider fails', async () => {
    const registry = new Map<ProviderId, NewsProvider>([
      ['guardian', provider('guardian', async () => [makeArticle('g1', 'guardian', '2026-01-02T00:00:00.000Z')])],
      ['nyt', provider('nyt', async () => { throw new Error('outage'); })],
      ['newsapi', provider('newsapi', async () => [makeArticle('n1', 'newsapi', '2026-01-03T00:00:00.000Z')])],
    ]);

    const result = await new FeedAggregator(registry, 1000).aggregate(filters, new AbortController().signal);

    expect(result.articles.map((item) => item.id)).toEqual(['n1', 'g1']);
    expect(result.providers).toEqual([
      { providerId: 'guardian', status: 'success', articleCount: 1 },
      { providerId: 'nyt', status: 'error', articleCount: 0, errorMessage: 'This source is temporarily unavailable.' },
      { providerId: 'newsapi', status: 'success', articleCount: 1 },
    ]);
  });

  it('calls only selected providers', async () => {
    let guardianCalls = 0;
    let nytCalls = 0;
    const registry = new Map<ProviderId, NewsProvider>([
      ['guardian', provider('guardian', async () => { guardianCalls += 1; return []; })],
      ['nyt', provider('nyt', async () => { nytCalls += 1; return []; })],
    ]);

    await new FeedAggregator(registry, 1000).aggregate({ ...filters, sourceIds: ['guardian'] }, new AbortController().signal);

    expect(guardianCalls).toBe(1);
    expect(nytCalls).toBe(0);
  });


  it('turns a provider timeout into an isolated provider failure', async () => {
    const timeoutProvider: NewsProvider = {
      id: 'guardian',
      displayName: 'The Guardian',
      fetchArticles: (_filters, signal) => new Promise<Article[]>((_, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason), { once: true });
      }),
    };
    const registry = new Map<ProviderId, NewsProvider>([['guardian', timeoutProvider]]);

    const result = await new FeedAggregator(registry, 5).aggregate(filters, new AbortController().signal);

    expect(result.articles).toEqual([]);
    expect(result.providers[0]).toMatchObject({ providerId: 'guardian', status: 'error' });
  });

  it('applies author preferences after provider normalization', async () => {
    const registry = new Map<ProviderId, NewsProvider>([
      ['guardian', provider('guardian', async () => [
        makeArticle('keep', 'guardian', '2026-01-02T00:00:00.000Z', 'Maya Chen'),
        makeArticle('drop', 'guardian', '2026-01-03T00:00:00.000Z', 'Other Author'),
      ])],
    ]);

    const result = await new FeedAggregator(registry, 1000).aggregate(
      { ...filters, authors: ['maya'] },
      new AbortController().signal,
    );

    expect(result.articles.map((item) => item.id)).toEqual(['keep']);
  });
});
