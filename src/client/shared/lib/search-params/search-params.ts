import type { ArticleFilters } from '@contracts/index';
import {
  articleFiltersSchema,
  categorySchema,
  isoDateSchema,
  providerIdSchema,
} from '@contracts/index';

export const filtersToSearchParams = (
  filters: ArticleFilters,
): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.query) params.set('query', filters.query);
  if (filters.sourceIds.length > 0)
    params.set('sourceIds', filters.sourceIds.join(','));
  if (filters.categories.length > 0)
    params.set('categories', filters.categories.join(','));
  if (filters.authors.length > 0)
    params.set('authors', filters.authors.join(','));
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);
  return params;
};

const parseCsv = (value: string | null): string[] =>
  value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

const parseDate = (value: string | null): string | undefined => {
  const parsed = isoDateSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
};

export const searchParamsToFilters = (
  params: URLSearchParams,
): ArticleFilters => {
  const sourceIds = parseCsv(params.get('sourceIds')).flatMap((value) => {
    const parsed = providerIdSchema.safeParse(value);
    return parsed.success ? [parsed.data] : [];
  });
  const categories = parseCsv(params.get('categories')).flatMap((value) => {
    const parsed = categorySchema.safeParse(value);
    return parsed.success ? [parsed.data] : [];
  });
  const dateFrom = parseDate(params.get('dateFrom'));
  const parsedDateTo = parseDate(params.get('dateTo'));
  const dateTo =
    dateFrom && parsedDateTo && dateFrom > parsedDateTo
      ? undefined
      : parsedDateTo;

  return articleFiltersSchema.parse({
    query: (params.get('query') ?? '').slice(0, 160),
    sourceIds,
    categories,
    authors: parseCsv(params.get('authors')).map((author) =>
      author.slice(0, 100),
    ),
    dateFrom,
    dateTo,
  });
};
