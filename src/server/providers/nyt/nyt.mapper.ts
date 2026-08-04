import type { Article, Category } from '@contracts/index';
import type { NytResponse } from './nyt-response.schema';

type NytDocument = NytResponse['response']['docs'][number];
type NytMultimedia = NonNullable<NytDocument['multimedia']>;
type NytKeyword = NonNullable<NytDocument['keywords']>[number];

const categoryBySection: Record<string, Category> = {
  Business: 'business',
  Technology: 'technology',
  Science: 'science',
  Sports: 'sports',
  Health: 'health',
  Arts: 'entertainment',
};

const imageUrl = (items: NytMultimedia) => {
  const item = items.find((entry: NytMultimedia[number]) => entry.subtype === 'xlarge') ?? items[0];
  if (!item) return undefined;
  return item.url.startsWith('http') ? item.url : `https://www.nytimes.com/${item.url}`;
};

export const mapNytResponse = (payload: NytResponse): Article[] =>
  payload.response.docs.map((item: NytDocument) => {
    const image = imageUrl(item.multimedia ?? []);
    const description = item.abstract ?? item.lead_paragraph ?? undefined;
    const author = item.byline?.original?.replace(/^By\s+/i, '') || undefined;
    return {
      id: `nyt:${item._id}`,
      url: item.web_url,
      title: item.headline.main,
      ...(description ? { description } : {}),
      ...(image ? { imageUrl: image } : {}),
      ...(author ? { author } : {}),
      publishedAt: new Date(item.pub_date).toISOString(),
      keywords: item.keywords?.map((keyword: NytKeyword) => keyword.value) ?? [],
      categories: [categoryBySection[item.section_name ?? ''] ?? 'general'],
      source: { id: 'nyt', name: 'The New York Times' },
    };
  });
