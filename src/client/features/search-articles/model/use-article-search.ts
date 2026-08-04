import { useEffect, useState } from 'react';
import { normalizeSearchQuery } from '../lib/normalize-search-query';

export const useArticleSearch = (
  query: string,
  onCommit: (query: string) => void,
) => {
  const [value, setValue] = useState(query);

  useEffect(() => setValue(query), [query]);
  useEffect(() => {
    const timer = setTimeout(() => {
      const normalized = normalizeSearchQuery(value);
      if (normalized !== query) onCommit(normalized);
    }, 350);
    return () => clearTimeout(timer);
  }, [onCommit, query, value]);

  return { value, setValue };
};
