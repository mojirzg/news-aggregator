import { useCallback, useEffect, useState } from 'react';
import type { ArticleFilters } from '@contracts/index';

export const useFilterDraft = (filters: ArticleFilters) => {
  const [draft, setDraft] = useState(filters);
  useEffect(() => setDraft(filters), [filters]);
  const resetDraft = useCallback(() => setDraft(filters), [filters]);
  return { draft, setDraft, resetDraft };
};
