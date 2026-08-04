import { z } from 'zod';
import type { Article, Category } from '@contracts/index';

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

export const nytResponseSchema = z.object({
  status: z.string(),
  response: z.object({
    docs: z.array(
      z.object({
        _id: z.string(),
        web_url: z.string().url(),
        pub_date: z.string(),
        section_name: z.string().nullable().optional(),
        subsection_name: z.string().nullable().optional(),
        headline: z.object({ main: z.string() }),
        abstract: z.string().nullable().optional(),
        lead_paragraph: z.string().nullable().optional(),
        byline: z
          .object({ original: z.string().nullable().optional() })
          .optional(),
        multimedia: z
          .array(
            z.object({
              url: z.string(),
              type: z.string().optional(),
              subtype: z.string().optional(),
            }),
          )
          .optional(),
        keywords: z.array(z.object({ value: z.string() })).optional(),
      }),
    ),
  }),
});

export type NytResponse = z.infer<typeof nytResponseSchema>;

const imageUrl = (items: NytMultimedia) => {
  const item =
    items.find((entry: NytMultimedia[number]) => entry.subtype === 'xlarge') ??
    items[0];
  if (!item) return undefined;
  return item.url.startsWith('http')
    ? item.url
    : `https://www.nytimes.com/${item.url}`;
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
      keywords:
        item.keywords?.map((keyword: NytKeyword) => keyword.value) ?? [],
      categories: [categoryBySection[item.section_name ?? ''] ?? 'general'],
      source: { id: 'nyt', name: 'The New York Times' },
    };
  });
