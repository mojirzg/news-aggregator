import { z } from 'zod';
import { categorySchema } from './article.contract';
import { isoDateSchema } from './common.contract';
import { providerIdSchema } from './provider.contract';

const csv = <T>(schema: z.ZodType<T>) =>
  z.preprocess((value) => {
    const values = Array.isArray(value) ? value : [value];
    return values
      .flatMap((item) => (typeof item === 'string' ? item.split(',') : []))
      .map((item) => item.trim())
      .filter(Boolean);
  }, z.array(schema));

const unique = <T>(values: T[]): T[] => [...new Set(values)];

const filtersObjectSchema = z.object({
  query: z.string().trim().max(160).default(''),
  sourceIds: z.array(providerIdSchema).default([]),
  categories: z.array(categorySchema).default([]),
  authors: z.array(z.string().trim().min(1).max(100)).default([]),
  dateFrom: isoDateSchema.optional(),
  dateTo: isoDateSchema.optional(),
});

export const articleFiltersSchema = filtersObjectSchema
  .refine(
    ({ dateFrom, dateTo }) => !dateFrom || !dateTo || dateFrom <= dateTo,
    {
      message: 'dateFrom must be before or equal to dateTo',
      path: ['dateFrom'],
    },
  )
  .transform((filters) => ({
    ...filters,
    sourceIds: unique(filters.sourceIds),
    categories: unique(filters.categories),
    authors: unique(filters.authors),
  }));

export const feedQuerySchema = z
  .object({
    query: z.string().trim().max(160).optional().default(''),
    sourceIds: csv(providerIdSchema).optional().default([]),
    categories: csv(categorySchema).optional().default([]),
    authors: csv(z.string().trim().min(1).max(100)).optional().default([]),
    dateFrom: isoDateSchema.optional(),
    dateTo: isoDateSchema.optional(),
  })
  .refine(
    ({ dateFrom, dateTo }) => !dateFrom || !dateTo || dateFrom <= dateTo,
    {
      message: 'dateFrom must be before or equal to dateTo',
      path: ['dateFrom'],
    },
  )
  .transform((filters) => ({
    ...filters,
    sourceIds: unique(filters.sourceIds),
    categories: unique(filters.categories),
    authors: unique(filters.authors),
  }));

export type ArticleFilters = z.infer<typeof articleFiltersSchema>;
