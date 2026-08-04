import {
  articleFiltersSchema,
  categorySchema,
  isoDateSchema,
  providerIdSchema,
  type ArticleFilters,
} from '@contracts/index';

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
