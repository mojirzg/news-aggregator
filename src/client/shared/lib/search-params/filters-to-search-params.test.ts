import { describe, expect, it } from 'vitest';
import { filtersToSearchParams } from './filters-to-search-params';
import { searchParamsToFilters } from './search-params-to-filters';

describe('filter URL serialization', () => {
  it('round-trips supported filters', () => {
    const filters = {
      query: 'react performance',
      sourceIds: ['guardian', 'nyt'] as const,
      categories: ['technology'] as const,
      authors: ['Maya Chen'],
      dateFrom: '2026-01-01',
      dateTo: '2026-01-31',
    };

    const parsed = searchParamsToFilters(filtersToSearchParams({
      ...filters,
      sourceIds: [...filters.sourceIds],
      categories: [...filters.categories],
    }));

    expect(parsed).toEqual({
      ...filters,
      sourceIds: [...filters.sourceIds],
      categories: [...filters.categories],
    });
  });

  it('drops unsupported source and category values', () => {
    const parsed = searchParamsToFilters(new URLSearchParams('sourceIds=guardian,unknown&categories=science,politics'));
    expect(parsed.sourceIds).toEqual(['guardian']);
    expect(parsed.categories).toEqual(['science']);
  });
});
