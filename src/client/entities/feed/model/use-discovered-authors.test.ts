import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import type {
  ArticleFilters,
  FeedResponse,
  ProviderId,
} from '@contracts/index';
import { collectDiscoveredAuthors } from './use-discovered-authors';
import { feedQueryKeys } from './use-feed-query';

const filters: ArticleFilters = {
  query: '',
  sourceIds: [],
  categories: [],
  authors: [],
};

const createFeed = (
  providerId: ProviderId,
  authors: string[],
): FeedResponse => ({
  articles: [
    {
      id: `${providerId}:article`,
      url: `https://example.com/${providerId}`,
      title: `${providerId} article`,
      authors,
      publishedAt: '2026-08-04T12:00:00.000Z',
      categories: ['technology'],
      source: { id: providerId, name: providerId },
    },
  ],
  providers: [
    {
      providerId,
      status: 'success',
      articleCount: 1,
    },
  ],
  generatedAt: '2026-08-04T12:00:01.000Z',
});

describe('collectDiscoveredAuthors', () => {
  it('deduplicates canonical names and records every provider where they occur', () => {
    const queryClient = new QueryClient();

    queryClient.setQueryData(
      feedQueryKeys.list(filters),
      createFeed('guardian', ['Maya Chen', 'Jordan Lee']),
    );
    queryClient.setQueryData(
      feedQueryKeys.list({ ...filters, categories: ['science'] }),
      createFeed('nyt', ['maya chen', 'Priya Raman']),
    );

    expect(collectDiscoveredAuthors(queryClient)).toEqual([
      { name: 'Jordan Lee', sourceIds: ['guardian'] },
      { name: 'Maya Chen', sourceIds: ['guardian', 'nyt'] },
      { name: 'Priya Raman', sourceIds: ['nyt'] },
    ]);
  });
});
