import { describe, expect, it } from 'vitest';
import { buildGuardianUrl } from './guardian.provider';
import { mapGuardianResponse } from './guardian.response';

describe('Guardian adapter mapping', () => {
  it('translates normalized filters into Guardian query parameters', () => {
    const url = buildGuardianUrl(
      {
        query: 'clean energy',
        sourceIds: ['guardian'],
        categories: ['science', 'technology'],
        authors: [],
        dateFrom: '2026-01-01',
        dateTo: '2026-01-31',
      },
      'secret',
    );

    expect(url.searchParams.get('q')).toBe('clean energy');
    expect(url.searchParams.get('section')).toBe('science|technology');
    expect(url.searchParams.get('from-date')).toBe('2026-01-01');
    expect(url.searchParams.get('api-key')).toBe('secret');
  });

  it('normalizes a Guardian result into the shared Article contract', () => {
    const articles = mapGuardianResponse({
      response: {
        status: 'ok',
        results: [
          {
            id: 'technology/example',
            type: 'article',
            sectionId: 'technology',
            sectionName: 'Technology',
            webPublicationDate: '2026-01-01T12:00:00Z',
            webTitle: 'Example title',
            webUrl: 'https://www.theguardian.com/technology/example',
            fields: {
              trailText: '<p>Example description</p>',
              byline: 'Example Author',
            },
          },
        ],
      },
    });

    expect(articles[0]).toMatchObject({
      id: 'guardian:technology/example',
      title: 'Example title',
      description: 'Example description',
      author: 'Example Author',
      categories: ['technology'],
      source: { id: 'guardian', name: 'The Guardian' },
    });
  });
});
