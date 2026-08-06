import { useEffect, useState } from 'react';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import type { FeedResponse, ProviderId } from '@contracts/index';
import { feedQueryKeys } from './use-feed-query';

export interface DiscoveredAuthor {
  name: string;
  sourceIds: ProviderId[];
}

const normalizeAuthorKey = (value: string): string =>
  value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');

export const collectDiscoveredAuthors = (
  queryClient: QueryClient,
): DiscoveredAuthor[] => {
  const authors = new Map<
    string,
    { name: string; sourceIds: Set<ProviderId> }
  >();

  const feeds = queryClient.getQueriesData<FeedResponse>({
    queryKey: feedQueryKeys.all,
  });

  for (const [, feed] of feeds) {
    if (!feed) continue;

    for (const article of feed.articles) {
      for (const name of article.authors) {
        const key = normalizeAuthorKey(name);
        const existing = authors.get(key);

        if (existing) {
          existing.sourceIds.add(article.source.id);
        } else {
          authors.set(key, {
            name,
            sourceIds: new Set([article.source.id]),
          });
        }
      }
    }
  }

  return [...authors.values()]
    .map(({ name, sourceIds }) => ({
      name,
      sourceIds: [...sourceIds].sort(),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
};

export const useDiscoveredAuthors = (): DiscoveredAuthor[] => {
  const queryClient = useQueryClient();
  const [authors, setAuthors] = useState<DiscoveredAuthor[]>(() =>
    collectDiscoveredAuthors(queryClient),
  );

  useEffect(() => {
    const refresh = (): void => {
      setAuthors(collectDiscoveredAuthors(queryClient));
    };

    refresh();
    return queryClient.getQueryCache().subscribe(refresh);
  }, [queryClient]);

  return authors;
};
