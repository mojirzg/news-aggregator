import { describe, expect, it } from 'vitest';
import { buildNewsApiUrl } from './newsapi.provider';
import { mapNewsApiResponse, newsApiResponseSchema } from './newsapi.response';
import malformedTimestamp from './fixtures/malformed-timestamp.json';

describe('NewsAPI adapter mapping', () => {
  it('rejects malformed provider timestamps', () => {
    expect(newsApiResponseSchema.safeParse(malformedTimestamp).success).toBe(
      false,
    );
  });

  it('uses normalized filters in the Everything endpoint', () => {
    const url = buildNewsApiUrl(
      {
        query: 'frontend',
        sourceIds: ['newsapi'],
        categories: ['technology'],
        authors: [],
        dateFrom: '2026-03-01',
        dateTo: '2026-03-10',
      },
      'secret',
    );

    expect(url.searchParams.get('q')).toBe('frontend OR technology');
    expect(url.searchParams.get('from')).toBe('2026-03-01');
    expect(url.searchParams.get('to')).toBe('2026-03-10');
    expect(url.searchParams.get('sortBy')).toBe('publishedAt');
  });

  it('drops removed records and infers a normalized category', () => {
    const articles = mapNewsApiResponse({
      status: 'ok',
      totalResults: 2,
      articles: [
        {
          source: { id: null, name: 'Engineering Daily' },
          author: 'Example Author',
          title: 'Software teams improve frontend performance',
          description: 'A technology report.',
          url: 'https://example.com/frontend',
          urlToImage: null,
          publishedAt: '2026-01-01T12:00:00Z',
          content: null,
        },
        {
          source: { id: null, name: 'Removed' },
          author: null,
          title: '[Removed]',
          description: null,
          url: 'https://example.com/removed',
          urlToImage: null,
          publishedAt: '2026-01-01T12:00:00Z',
          content: null,
        },
      ],
    });

    expect(articles).toHaveLength(1);
    expect(articles[0]).toMatchObject({
      title: 'Software teams improve frontend performance',
      authors: ['Example Author'],
      categories: ['technology'],
      source: { id: 'newsapi', name: 'Engineering Daily' },
    });
  });
});
