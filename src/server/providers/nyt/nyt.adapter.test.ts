import { describe, expect, it } from 'vitest';
import { mapNytResponse } from './nyt.response';
import { buildNytUrl } from './nyt.provider';

describe('New York Times adapter mapping', () => {
  it('translates dates and categories into Article Search parameters', () => {
    const url = buildNytUrl({
      query: 'space research',
      sourceIds: ['nyt'],
      categories: ['science'],
      authors: [],
      dateFrom: '2026-01-02',
      dateTo: '2026-02-03',
    }, 'secret');

    expect(url.searchParams.get('q')).toBe('space research');
    expect(url.searchParams.get('begin_date')).toBe('20260102');
    expect(url.searchParams.get('end_date')).toBe('20260203');
    expect(url.searchParams.get('fq')).toContain('Science');
  });

  it('normalizes a document into the shared article contract', () => {
    const articles = mapNytResponse({
      status: 'OK',
      response: {
        docs: [{
          _id: 'nyt://article/example',
          web_url: 'https://www.nytimes.com/example',
          pub_date: '2026-01-01T12:00:00Z',
          section_name: 'Science',
          subsection_name: null,
          headline: { main: 'Example NYT title' },
          abstract: 'Example NYT summary',
          lead_paragraph: null,
          byline: { original: 'By Example Author' },
          multimedia: [{ url: 'images/example.jpg', subtype: 'xlarge', type: 'image' }],
          keywords: [{ value: 'Space' }],
        }],
      },
    });

    expect(articles[0]).toMatchObject({
      id: 'nyt:nyt://article/example',
      title: 'Example NYT title',
      author: 'Example Author',
      imageUrl: 'https://www.nytimes.com/images/example.jpg',
      categories: ['science'],
      source: { id: 'nyt', name: 'The New York Times' },
    });
  });
});
