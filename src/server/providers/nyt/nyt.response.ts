import { z } from 'zod';
import type { Article, Category } from '@contracts/index';

type NytDocument = NytResponse['response']['docs'][number];
type NytMultimedia = z.infer<typeof nytMultimediaSchema>;
type NytKeyword = NonNullable<NytDocument['keywords']>[number];

const categoryBySection: Record<string, Category> = {
  Business: 'business',
  Technology: 'technology',
  Science: 'science',
  Sports: 'sports',
  Health: 'health',
  Arts: 'entertainment',
};

const NYT_IMAGE_BASE_URL = 'https://www.nytimes.com';

const nytImageSchema = z.object({
  url: z.string(),
  height: z.number().nonnegative(),
  width: z.number().nonnegative(),
});

const nytMultimediaSchema = z
  .object({
    caption: z.string().optional().default(''),
    credit: z.string().optional().default(''),
    default: nytImageSchema.optional(),
    thumbnail: nytImageSchema.optional(),
  })
  .nullable()
  .optional();

const nytDocumentSchema = z.object({
  abstract: z.string().optional().default(''),

  byline: z
    .object({
      original: z.string().nullable().optional(),
    })
    .optional(),

  document_type: z.string().optional(),

  headline: z.object({
    main: z.string(),
    kicker: z.string().nullable().optional(),
    print_headline: z.string().nullable().optional(),
  }),

  _id: z.string(),

  keywords: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
        rank: z.number().optional(),
      }),
    )
    .optional()
    .default([]),

  multimedia: nytMultimediaSchema,

  news_desk: z.string().nullable().optional(),
  pub_date: z.string(),
  section_name: z.string().nullable().optional(),
  snippet: z.string().optional().default(''),
  source: z.string().optional().default('The New York Times'),
  subsection_name: z.string().nullable().optional(),
  type_of_material: z.string().nullable().optional(),
  uri: z.string().optional(),
  web_url: z.string().url(),
  word_count: z.number().optional(),
});

export const nytResponseSchema = z.object({
  status: z.string(),
  copyright: z.string().optional(),

  response: z.object({
    docs: z.array(nytDocumentSchema),

    metadata: z
      .object({
        hits: z.number(),
        offset: z.number(),
        time: z.number(),
      })
      .optional(),
  }),
});

export type NytResponse = z.infer<typeof nytResponseSchema>;

const getNytImageUrl = (multimedia?: NytMultimedia): string | undefined => {
  const rawUrl = multimedia?.thumbnail?.url ?? multimedia?.default?.url;

  if (!rawUrl?.trim()) {
    return undefined;
  }

  try {
    return new URL(rawUrl, NYT_IMAGE_BASE_URL).href;
  } catch {
    return undefined;
  }
};
export const mapNytResponse = (payload: NytResponse): Article[] =>
  payload.response.docs.map((item: NytDocument) => {
    const image = getNytImageUrl(item.multimedia);
    const description = item.abstract ?? item.snippet ?? undefined;
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
