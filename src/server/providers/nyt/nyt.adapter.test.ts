import { describe, expect, it } from 'vitest';
import { mapNytResponse, nytResponseSchema } from './nyt.response';
import malformedTimestamp from './fixtures/malformed-timestamp.json';
import { buildNytUrl } from './nyt.provider';

describe('New York Times adapter mapping', () => {
  it('rejects malformed provider timestamps', () => {
    expect(nytResponseSchema.safeParse(malformedTimestamp).success).toBe(false);
  });

  it('translates dates and categories into Article Search parameters', () => {
    const url = buildNytUrl(
      {
        query: 'space research',
        sourceIds: ['nyt'],
        categories: ['science'],
        authors: [],
        dateFrom: '2026-01-02',
        dateTo: '2026-02-03',
      },
      'secret',
    );

    expect(url.searchParams.get('q')).toBe('space research');
    expect(url.searchParams.get('begin_date')).toBe('20260102');
    expect(url.searchParams.get('end_date')).toBe('20260203');
    expect(url.searchParams.get('fq')).toContain('Science');
  });

  it('normalizes a document into the shared article contract', () => {
    const articles = mapNytResponse({
      status: 'OK',
      copyright:
        'Copyright (c) 2026 The New York Times Company. All Rights Reserved.',
      response: {
        docs: [
          {
            abstract:
              'The pilot, identified only by his initials, also tested positive for ecstasy and cocaine when he was arrested last week at the Jakarta airport, the Indonesian police said.',
            byline: {
              original: 'By Johnny Diaz',
            },
            document_type: 'article',
            headline: {
              main: 'Malaysian Pilot Smuggled 55 Pounds of Ecstasy Into Indonesia, Officials Say',
              kicker: '',
              print_headline: '',
            },
            _id: 'nyt://article/a7b1db10-d6d7-5afe-aa1b-d8d3856b040a',
            keywords: [
              {
                name: 'Subject',
                value: 'Drug Abuse and Traffic',
                rank: 1,
              },
              {
                name: 'Subject',
                value: 'Smuggling',
                rank: 2,
              },
              {
                name: 'Subject',
                value: 'Methamphetamines',
                rank: 3,
              },
              {
                name: 'Subject',
                value: 'Pilots',
                rank: 4,
              },
              {
                name: 'Subject',
                value: 'Airport Security',
                rank: 5,
              },
              {
                name: 'Subject',
                value: 'Airlines and Airplanes',
                rank: 6,
              },
              {
                name: 'Subject',
                value: 'Luggage and Packing',
                rank: 7,
              },
              {
                name: 'Organization',
                value: 'Malaysia Airlines',
                rank: 8,
              },
              {
                name: 'Location',
                value: 'Soekarno-Hatta International Airport',
                rank: 9,
              },
              {
                name: 'Location',
                value: 'Jakarta (Indonesia)',
                rank: 10,
              },
              {
                name: 'Location',
                value: 'Indonesia',
                rank: 11,
              },
              {
                name: 'Location',
                value: 'Malaysia',
                rank: 12,
              },
            ],
            multimedia: {
              caption:
                'Malaysia Airlines said in a statement that it was cooperating with the investigation of a pilot who was arrested at the main airport serving Indonesia’s capital, Jakarta, last week.',
              credit: 'Rahman Roslan/Getty Images',
              default: {
                url: 'https://static01.nyt.com/images/2026/08/05/multimedia/05xp-pilot/05xp-pilot-articleLarge.jpg',
                height: 400,
                width: 600,
              },
              thumbnail: {
                url: 'https://static01.nyt.com/images/2026/08/05/multimedia/05xp-pilot/05xp-pilot-thumbStandard.jpg',
                height: 75,
                width: 75,
              },
            },
            news_desk: 'Express',
            pub_date: '2026-08-05T20:25:44Z',
            section_name: 'World',
            snippet:
              'The pilot, identified only by his initials, also tested positive for ecstasy and cocaine when he was arrested last week at the Jakarta airport, the Indonesian police said.',
            source: 'The New York Times',
            subsection_name: 'Asia Pacific',
            type_of_material: 'News',
            uri: 'nyt://article/a7b1db10-d6d7-5afe-aa1b-d8d3856b040a',
            web_url:
              'https://www.nytimes.com/2026/08/05/world/asia/malaysian-airlines-pilot-drugs-arrest.html',
            word_count: 482,
          },
        ],
        metadata: {
          hits: 10000,
          offset: 0,
          time: 286,
        },
      },
    });

    expect(articles[0]).toMatchObject({
      id: 'nyt:nyt://article/a7b1db10-d6d7-5afe-aa1b-d8d3856b040a',
      title:
        'Malaysian Pilot Smuggled 55 Pounds of Ecstasy Into Indonesia, Officials Say',
      authors: ['Johnny Diaz'],
      imageUrl:
        'https://static01.nyt.com/images/2026/08/05/multimedia/05xp-pilot/05xp-pilot-thumbStandard.jpg',
      categories: ['general'],
      source: { id: 'nyt', name: 'The New York Times' },
    });
  });
});
